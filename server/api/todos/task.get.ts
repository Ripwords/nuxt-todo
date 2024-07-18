import type { Todo } from "#todos"

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const uuid = session.user.uuid

  const db = useStorage("mongo:todos")

  const todoKeys = await db.getKeys()
  const userTodos = todoKeys.filter((key) => key.includes(uuid))
  const todos = await Promise.all(userTodos.map((key) => db.getItem<Todo>(key)))
  return {
    todos
  }
})
