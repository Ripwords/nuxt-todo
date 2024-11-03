import { z } from "zod";
import type { CredentialData } from "#auth-utils";

export default defineWebAuthnRegisterEventHandler({
  validateUser: z.object({
    userName: z.string().email().trim(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  }).parse,
  async onSuccess(event, { credential, user }) {
    const credDb = useStorage("mongo:credentials");
    if ((await userExists(user.userName, "credentials")) === undefined) {
      throw createError({
        statusCode: 400,
        statusMessage: "User already exists",
      });
    }

    if (!(await userExists(user.userName, "auth"))) {
      await $fetch("/api/auth/signup", {
        method: "POST",
        body: {
          email: user.userName,
          password: user.password,
          confirmPassword: user.confirmPassword,
        },
      });
    }

    const userData = await userExists(user.userName, "auth");

    if (!userData) {
      throw createError({ statusCode: 400, message: "User not found" });
    }

    await credDb.setItem<CredentialData>(user.userName, {
      id: credential.id,
      uuid: userData.uuid,
      publicKey: credential.publicKey,
      counter: credential.counter,
      backedUp: credential.backedUp,
      transports: JSON.stringify(credential.transports),
    });
  },
});
