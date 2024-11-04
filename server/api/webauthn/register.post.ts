import { z } from "zod";
import type { CredentialData } from "#auth-utils";

export default defineWebAuthnRegisterEventHandler({
  async storeChallenge(event, challenge, attemptId) {
    await useStorage("mongo:challenges").setItem<string>(
      `auth:challenge:${attemptId}`,
      challenge
    );
  },
  async getChallenge(event, attemptId) {
    const challenge = await useStorage("mongo:challenges").getItem<string>(
      `auth:challenge:${attemptId}`
    );
    if (!challenge) {
      throw createError({
        statusCode: 400,
        message: "Challenge not found or expired",
      });
    }
    await useStorage("mongo:challenges").removeItem(
      `auth:challenge:${attemptId}`
    );
    return challenge;
  },
  validateUser: z.object({
    userName: z.string().email().trim(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  }).parse,
  async onSuccess(event, { credential, user }) {
    const existingUser = await userExists(user.userName);
    if (!existingUser) {
      await $fetch("/api/auth/signup", {
        method: "POST",
        body: {
          email: user.userName,
          password: user.password,
          confirmPassword: user.confirmPassword,
        },
      });
    }

    if (existingUser) {
      throw createError({
        statusCode: 400,
        statusMessage: "User already exists",
      });
    }

    const userData = await userExists(user.userName);

    if (!userData) {
      throw createError({ statusCode: 400, message: "User not found" });
    }

    const credDb = useStorage("mongo:credentials");
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
        webauthn: true,
      },
      loggedInAt: new Date(),
    });
  },
  async excludeCredentials(event, userName) {
    const credDb = useStorage("mongo:credentials");
    const user = await credDb.getItem<CredentialData>(userName);
    if (!user) {
      return [];
    }
    return [
      {
        id: user.id,
        transports: JSON.parse(user.transports),
      },
    ];
  },
});
