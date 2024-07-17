export const signUp = async (email: string, password: string, confirmPassword: string) => {
  const toast = usePvToast()
  const router = useRouter()
  const { fetch } = useUserSession()

  try {
    await $fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        confirmPassword
      })
    })
    await fetch()

    router.push("/")
    toast.add({
      life: 3000,
      summary: "Success",
      detail: "You have been signed up",
      severity: "success"
    })
  } catch (e) {
    toast.add({
      life: 3000,
      summary: "Error",
      detail: e,
      severity: "error"
    })
  }
}

export const signIn = async (email: string, password: string) => {
  const toast = usePvToast()
  const router = useRouter()
  const { fetch } = useUserSession()

  try {
    await $fetch("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify({
        email,
        password
      })
    })
    await fetch()

    router.push("/")
    toast.add({
      life: 3000,
      summary: "Success",
      detail: "You have been signed in",
      severity: "success"
    })
  } catch (e) {
    toast.add({
      life: 3000,
      summary: "Error",
      detail: e,
      severity: "error"
    })
  }
}

export const signOut = async () => {
  const toast = usePvToast()
  const router = useRouter()
  const { fetch } = useUserSession()

  try {
    await $fetch("/api/auth/signout", {
      method: "POST"
    })
    await fetch()

    router.push("/auth/signin")
    toast.add({
      life: 3000,
      summary: "Success",
      detail: "You have been signed out",
      severity: "success"
    })
  } catch (e) {
    toast.add({
      life: 3000,
      summary: "Error",
      detail: e,
      severity: "error"
    })
  }
}

export const me = async () => {
  const toast = usePvToast()
  const { fetch, user } = useUserSession()

  try {
    await $fetch("/api/user/me")
    await fetch()

    toast.add({
      life: 3000,
      summary: "Success",
      detail: user.value?.email,
      severity: "success"
    })
  }
  catch (e) {
    toast.add({
      life: 3000,
      summary: "Error",
      detail: e,
      severity: "error"
    })
  }
}