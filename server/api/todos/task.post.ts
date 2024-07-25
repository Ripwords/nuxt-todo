import type { Todo } from "./types";
import { z } from "zod";
import { publicEncrypt } from "crypto";
import { getUser } from "~~/server/utils/auth/utils";

const bodySchema = z.object({
  description: z.string(),
});

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const uuid = session.user.uuid;

  const { description } = await readValidatedBody(event, bodySchema.parse);
  const db = useStorage("mongo:todos");

  const todoKeys = await db.getKeys(uuid);
  const userTodos = todoKeys.filter((key) => key.includes(uuid));

  // Find max id of user's todos
  const maxId = userTodos.reduce((acc, key) => {
    const id = parseInt(key.split(":")[1]);
    return id > acc ? id : acc;
  }, 0);

  const user = await getUser(uuid);
  if (!user) {
    setResponseStatus(event, 400);
    return {
      message: "User not found",
    };
  }

  const encryptedData = publicEncrypt(
    user.data_pub_key,
    Buffer.from(description)
  );

  await db.setItem<Todo>(`${uuid}:${maxId + 1}`, {
    id: maxId + 1,
    date: new Date(),
    description: encryptedData.toString("base64"),
  });

  return {
    message: "Todos added",
  };
});
