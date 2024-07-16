export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const sessionData: {
    user: {
      email: string,
      loggedInAt: Date
    }
  } = JSON.parse(JSON.stringify(session))
  if (!session) {
    setResponseStatus(event, 401)
    return {
      message: "Unauthorized"
    }
  } else {
    const db = useStorage("mongo:auth")
    const user: string | null = await db.getItem(sessionData.user.email)    
    
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
  }
})
