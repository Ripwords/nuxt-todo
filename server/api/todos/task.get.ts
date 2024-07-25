import { getUser } from "~~/server/utils/auth/utils";
import type { Todo } from "./types";
import {
  privateDecrypt,
  createPrivateKey,
  scryptSync,
  createDecipheriv,
} from "crypto";

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const uuid = session.user.uuid;

  const db = useStorage("mongo:todos");
  const user = await getUser(uuid);
  if (!user) {
    setResponseStatus(event, 400);
    return [];
  }

  // Decrypt user's private key
  const [iv, encrypted_private_key] = user.data_priv_key.split("|");
  const key = scryptSync(
    process.env.PRIV_KEY_PASSWORD + user.password,
    Buffer.from(user.priv_key_salt, "hex"),
    32
  );
  const decipher = createDecipheriv("aes-256-cbc", key, Buffer.from(iv, "hex"));
  let decryptedPrivateKey = decipher.update(
    encrypted_private_key,
    "base64",
    "utf-8"
  );
  decryptedPrivateKey += decipher.final("utf-8");

  const priv_key = createPrivateKey({
    key: decryptedPrivateKey,
    type: "pkcs8",
    passphrase: user.password,
  });

  const todoKeys = await db.getKeys(uuid);
  const todosFromDB = await Promise.all(
    todoKeys.map((key) => db.getItem<Todo>(key))
  );
  const todos: Todo[] = todosFromDB
    .filter((todo) => todo !== null)
    .map((todo) => ({
      ...todo,
      description: privateDecrypt(
        priv_key,
        Buffer.from(todo.description, "base64")
      ).toString(),
    }));

  return todos;
});
