import type { Todo } from "#todos"
import { z } from "zod"

const bodySchema = z.object({
  date: z.coerce.date(),
  description: z.string(),
})

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const uuid = session.user.uuid

  const { date, description } = await readValidatedBody(event, bodySchema.parse)
  const db = useStorage("mongo:todos")

  const todoKeys = await db.getKeys()
  const userTodos = todoKeys.filter((key) => key.includes(uuid))

  // Find max id of user's todos
  const maxId = userTodos.reduce((acc, key) => {
    const id = parseInt(key.split(":")[1])
    return id > acc ? id : acc
  }, 0)

  await db.setItem<Todo>(`${uuid}:${maxId + 1}`, {
    id: maxId + 1,
    date,
    description,
  })

  return {
    message: "Todos added"
  }
})
