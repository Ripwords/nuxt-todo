import { z } from "zod";
import type { CredentialData } from "#auth-utils";

export default defineWebAuthnRegisterEventHandler({
  validateUser: z.object({
    userName: z.string().email().trim(),
  }).parse,
  async onSuccess(event, { credential, user }) {
    const credDb = useStorage("mongo:credentials");

    const userData = await userExists(user.userName);
    if (!userData) {
      throw createError({
        statusCode: 400,
        statusMessage: "User not found",
      });
    }

    const existingCredential = await credDb.getItem<CredentialData>(
      user.userName
    );
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
