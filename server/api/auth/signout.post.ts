export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  if (!session) {
    setResponseStatus(event, 401)
    return {
      message: "Unauthorized"
    }
  }

  await clearUserSession(event)
  setResponseStatus(event, 200)
  return {
    message: "User logged out"
  }
})
