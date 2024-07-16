import { z } from "zod"
import { Bcrypt } from "oslo/password";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse)
  const db = useStorage("mongo:auth")
  // Check if email exists in database
  const userExist = await db.hasItem(body.email)
  if (userExist) {
    setResponseStatus(event, 400)
    return {
      message: "User already exists"
    }
  }

  // If user does not exist, create a new user
  const bcrypt = new Bcrypt()
  
  const session = await setUserSession(event, {
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
    message: "User created"
  }
})