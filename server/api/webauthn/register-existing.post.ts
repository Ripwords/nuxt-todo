import { z } from "zod";
import type { CredentialData } from "#auth-utils";

export default defineWebAuthnRegisterEventHandler({
  validateUser: z.object({
    userName: z.string().email().trim(),
  }).parse,
  async onSuccess(event, { credential, user }) {
    const credDb = useStorage("mongo:credentials");
    if ((await userExists(user.userName, "credentials")) !== undefined) {
      throw createError({
        statusCode: 400,
        statusMessage: "User already exists",
      });
    }

    const userData = await userExists(user.userName, "auth");
    if (!userData) {
      throw createError({
        statusCode: 400,
        statusMessage: "User not found",
      });
    }

    const existingCredential = await userExists(user.userName, "credentials");
    if (existingCredential) {
      throw createError({
        statusCode: 400,
        statusMessage: "Credential already exists",
      });
    }

    await credDb.setItem<CredentialData>(user.userName, {
      id: credential.id,
      uuid: userData.uuid,
      publicKey: credential.publicKey,
      counter: credential.counter,
      backedUp: credential.backedUp,
      transports: JSON.stringify(credential.transports),
    });

    await setUserSession(event, {
      user: {
        uuid: userData.uuid,
        email: user.userName,
      },
      loggedInAt: new Date(),
    });
  },
});
