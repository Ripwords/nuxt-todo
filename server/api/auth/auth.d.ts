// auth.d.ts
declare module "#auth-utils" {
  interface User {
    // Add your own fields
    uuid: string;
    email: string;
  }

  interface UserSession {
    // Add your own fields
    loggedInAt: Date;
  }

  interface UserStoredData {
    email: string;
    password: string;
    priv_key_salt: string;
    data_pub_key: string;
    data_priv_key: string;
  }

  interface UserData {
    uuid: string;
    data: UserStoredData;
  }
}

export {};
