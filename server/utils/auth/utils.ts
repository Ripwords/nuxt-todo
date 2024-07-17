import type { UserData, UserStoredData } from "#auth-utils"

export const userExists = async (email: string): Promise<UserData | undefined> => {
  const db = useStorage("mongo:auth")
  const uuids = await db.getKeys()
  let userData: UserData | undefined
  for (const uuid of uuids) {
    const user = await db.getItem<UserStoredData>(uuid)
    if (user?.email === email) {
      userData = {
        uuid,
        data: user
      }
      break
    }
  }

  return userData
}