import { z } from "zod";
import { Bcrypt } from "oslo/password";
import { userExists } from "~~/server/utils/auth/utils";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default defineEventHandler(async (event) => {
  await clearUserSession(event);
  const body = await readValidatedBody(event, bodySchema.parse);
  // Check if email exists in database
  const userData = await userExists(body.email, "auth");
  const webauthn = await useStorage("mongo:credentials").getItem(body.email);
  if (!userData) {
    setResponseStatus(event, 401);
    return {
      message: "User doesn't exist",
    };
  }

  if (!userData.data.password) {
    setResponseStatus(event, 401);
    return {
      message: "User doesn't have a password",
    };
  }

  const bcrypt = new Bcrypt();
  const passwordMatch = await bcrypt.verify(
    userData.data.password,
    body.password + process.env.NUXT_SESSION_PASSWORD
  );

  if (!passwordMatch) {
    setResponseStatus(event, 401);
    return {
      message: "Invalid password",
    };
  }

  await replaceUserSession(event, {
    user: {
      uuid: userData.uuid,
      email: body.email,
      webauthn: webauthn ? true : false,
    },
    loggedInAt: new Date(),
  });

  setResponseStatus(event, 201);
  return {
    message: "User logged in",
  };
});
