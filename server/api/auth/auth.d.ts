// auth.d.ts
declare module '#auth-utils' {
  interface User {
    // Add your own fields
    uuid: string
    email: string
  }

  interface UserSession {
    // Add your own fields
    loggedInAt: Date
  }

  interface UserStoredData {
    email: string
    password: string
  }

  interface UserData {
    uuid: string
    data: UserStoredData
  }
}

export {}