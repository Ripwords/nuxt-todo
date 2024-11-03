import type { UserData, UserStoredData } from "#auth-utils";

type DBName = "auth" | "credentials";

export const userExists = async (
  email: string,
  dbName: DBName
): Promise<UserData | undefined> => {
  const db = useStorage(`mongo:${dbName}`);
  const uuids = await db.getKeys();
  let userData: UserData | undefined;
  for (const uuid of uuids) {
    const user = await db.getItem<UserStoredData>(uuid);
    if (user?.email === email) {
      userData = {
        uuid,
        data: user,
      };
      break;
    }
  }

  return userData;
};

export const getUser = async (uuid: string) => {
  // Get user's data
  const user = await useStorage("mongo:auth").getItem<UserStoredData>(uuid);
  return user;
};
