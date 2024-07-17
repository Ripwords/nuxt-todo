// todos.d.ts
declare module '#todos' {
  interface Todo {
    date: Date
    description: string
    completed: boolean
  }
}