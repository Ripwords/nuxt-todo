import { z } from "zod"
import { Bcrypt } from "oslo/password";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse)
  const db = useStorage("mongo:auth")
  // Check if email exists in database
  const userExist = await db.hasItem(body.email)
  if (!userExist) {
    setResponseStatus(event, 401)
    return {
      message: "User doesn't exist"
    }
  }

  // If user does not exist, create a new user
  const bcrypt = new Bcrypt()
  const user: string | null = await db.getItem(body.email)
  console.log(user)

  if (!user) {
    await clearUserSession(event)
    setResponseStatus(event, 500)
    return {
      message: "Something went wrong"
    }
  }
  
  const userData = JSON.parse(JSON.stringify(user))
  const passwordMatch = await bcrypt.verify(userData.password, body.password + process.env.NUXT_SESSION_PASSWORD)

  if (!passwordMatch) {
    setResponseStatus(event, 401)
    return {
      message: "Invalid password"
    }
  }

  const session = await replaceUserSession(event, {
    user: {
      email: body.email,
      loggedInAt: new Date()
    },
  })

  await db.setItem(body.email, JSON.stringify({
    password: await bcrypt.hash(body.password + process.env.NUXT_SESSION_PASSWORD),
    session
  }))

  setResponseStatus(event, 201)
  return {
    message: "User logged in"
  }
})