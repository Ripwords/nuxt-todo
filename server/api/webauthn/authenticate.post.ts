import type { CredentialData } from "#auth-utils";

export default defineWebAuthnAuthenticateEventHandler({
  async allowCredentials(event, userName) {
    const credDb = useStorage("mongo:credentials");
    const user = await credDb.getItem<CredentialData>(userName);
    if (!user) {
      throw createError({ statusCode: 400, message: "User not found" });
    }
    return [{ id: user.id }];
  },
  async getCredential(event, credentialId) {
    const credDb = useStorage("mongo:credentials");
    const credentials = await credDb.getKeys();

    const userEmail = credentials.find(async (c) => {
      const cred = await credDb.getItem<CredentialData>(c);
      if (!cred) return false;
      return cred.id === credentialId;
    });

    if (!userEmail) {
      throw createError({ statusCode: 400, message: "Credential not found" });
    }

    const credential = await credDb.getItem<CredentialData>(userEmail);
    if (!credential) {
      throw createError({ statusCode: 400, message: "Credential not found" });
    }

    return {
      ...credential,
      backedUp: Boolean(credential.backedUp),
      transports: JSON.parse(JSON.stringify(credential.transports)),
    };
  },
  async onSuccess(event, { credential, authenticationInfo }) {
    const credDb = useStorage("mongo:credentials");
    const credentials = await credDb.getKeys();

    const userEmail = credentials.find(async (c) => {
      const cred = await credDb.getItem<CredentialData>(c);
      if (!cred) return false;
      return cred.id === credential.id;
    });

    if (!userEmail) {
      throw createError({ statusCode: 400, message: "Credential not found" });
    }

    const userData = await userExists(userEmail, "auth");

    if (!userData) {
      throw createError({ statusCode: 400, message: "User not found" });
    }

    await credDb.setItem<CredentialData>(userEmail, {
      ...credential,
      counter: authenticationInfo.newCounter,
    });

    await setUserSession(event, {
      user: {
        uuid: userData.uuid,
        email: userEmail,
      },
      loggedInAt: new Date(),
    });
  },
});
