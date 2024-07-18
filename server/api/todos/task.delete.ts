import { z } from "zod"

const bodySchema = z.object({
  index: z.coerce.number(),
  completed: z.coerce.boolean(),
})

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const { index } = await readValidatedBody(event, bodySchema.parse)

  const uuid = session.user.uuid

  const db = useStorage("mongo:todos")
  const todoKeys = await db.getKeys()
  const userTodo = todoKeys.find((key) => key == `${uuid}:${index}`)
  if (!userTodo) {
    throw new Error("Task not found")
  }

  await db.removeItem(`${uuid}:${index}`)

  return {
    message: "Task completed"
  }
})
