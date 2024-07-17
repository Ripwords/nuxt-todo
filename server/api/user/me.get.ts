import type { User, UserSession } from "#auth-utils"

export default defineEventHandler(async (event) => {
  const session =  await requireUserSession(event)
  const sessionData: UserSession = JSON.parse(JSON.stringify(session))
  
  const db = useStorage("mongo:auth")
  const user: User | null = await db.getItem(sessionData.user!.uuid)    
  
  if (!user) {
    setResponseStatus(event, 401)
    return {
      message: "User doesn't exist"
    }
  }

  setResponseStatus(event, 200)
  return {
    user: sessionData.user
  }
})
