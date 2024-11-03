import { z } from "zod";
import { Bcrypt } from "oslo/password";
import { alphabet, generateRandomString } from "oslo/crypto";
import type { UserStoredData } from "#auth-utils";
import { userExists } from "~~/server/utils/auth/utils";
import {
  generateKeyPairSync,
  createCipheriv,
  scryptSync,
  randomBytes,
} from "crypto";

const bodySchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
  });

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse);
  const db = useStorage("mongo:auth");
  // Check if email exists in database
  const userData = await userExists(body.email, "auth");
  if (userData) {
    setResponseStatus(event, 400);
    return {
      message: "User already exists",
    };
  }

  // If user does not exist, create a new user
  const bcrypt = new Bcrypt();
  const uuid = generateRandomString(32, alphabet("-", "0-9", "A-Z", "a-z"));
  const hashedPassword = await bcrypt.hash(
    body.password + process.env.NUXT_SESSION_PASSWORD
  );

  await setUserSession(event, {
    user: {
      uuid,
      email: body.email,
    },
    loggedInAt: new Date(),
  });

  const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
      cipher: "aes-256-cbc",
      passphrase: hashedPassword,
    },
  });

  // Encrypt private key
  const salt = randomBytes(32);
  const iv = randomBytes(16);
  const key = scryptSync(
    process.env.PRIV_KEY_PASSWORD + hashedPassword,
    salt,
    32
  );
  const cipher = createCipheriv("aes-256-cbc", key, iv);
  let encryptedPrivateKey = cipher.update(privateKey, "utf-8", "base64");
  encryptedPrivateKey += cipher.final("base64");

  await db.setItem<UserStoredData>(uuid, {
    email: body.email,
    password: hashedPassword,
    priv_key_salt: salt.toString("hex"),
    data_pub_key: publicKey,
    data_priv_key: `${iv.toString("hex")}|${encryptedPrivateKey}`,
  });

  setResponseStatus(event, 201);
  return {
    message: "User created",
  };
});
