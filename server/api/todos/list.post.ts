import type { Todo } from "#todos"
import { z } from "zod"

const bodySchema = z.object({
  uuid: z.string(),
  todos: z.array(z.object({
    date: z.coerce.date(),
    description: z.string(),
    completed: z.boolean()
  }))
})

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const { uuid } = await readValidatedBody(event, bodySchema.parse)
  const db = useStorage("mongo:todos")

  const todoKeys = await db.getKeys()
  const userTodos = todoKeys.filter((key) => key.includes(uuid))

  // Find max id of user's todos
  const maxId = userTodos.reduce((acc, key) => {
    const id = parseInt(key.split(":")[1])
    return id > acc ? id : acc
  }, 0)

  // Create new todos
  await db.setItem<Todo>(`${uuid}:${maxId + 1}`, {
    date: new Date(),
    description: "New todo",
    completed: false
  })

  return {
    message: "Todo added"
  }
})
