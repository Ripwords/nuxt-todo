import { z } from "zod"
import { Bcrypt } from "oslo/password";
import { alphabet, generateRandomString } from "oslo/crypto";
import type { UserStoredData } from "#auth-utils";
import { userExists } from "~~/server/utils/auth/utils";

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
   const userData = await userExists(body.email)
  if (userData) {
    setResponseStatus(event, 400)
    return {
      message: "User already exists"
    }
  }

  // If user does not exist, create a new user
  const bcrypt = new Bcrypt()
  const uuid = generateRandomString(32, alphabet("-", "0-9", "A-Z", "a-z"))
  
  await setUserSession(event, {
      user: {
        uuid,
        email: body.email
      },
      loggedInAt: new Date()
  })
  
  await db.setItem<UserStoredData>(uuid, {
    email: body.email,
    password: await bcrypt.hash(body.password + process.env.NUXT_SESSION_PASSWORD),
  })

  setResponseStatus(event, 201)
  return {
    message: "User created"
  }
})