const { authenticate } = useWebAuthn({
  registerEndpoint: "/api/webauthn/register", // Default
  authenticateEndpoint: "/api/webauthn/authenticate", // Default
});

const { register: registerExisting } = useWebAuthn({
  registerEndpoint: "/api/webauthn/register-existing",
});

export const registerExistingUser = async (email: string) => {
  const { loggedIn } = useUserSession();
  if (loggedIn.value) {
    await registerExisting({ userName: email });
  } else {
    throw new Error("User is not logged in");
  }
};

export const signUp = async (
  email: string,
  password: string,
  confirmPassword: string
) => {
  const toast = usePvToast();
  const router = useRouter();
  const { fetch } = useUserSession();

  try {
    await $fetch("/api/auth/signup", {
      method: "POST",
      body: {
        email,
        password,
        confirmPassword,
      },
    });
    await fetch();

    router.push("/");
    toast.add({
      life: 3000,
      summary: "Success",
      detail: "You have been signed up",
      severity: "success",
    });
  } catch (e) {
    toast.add({
      life: 3000,
      summary: "Error",
      detail: e,
      severity: "error",
    });
  }
};

export const signInWithPassword = async (email: string, password: string) => {
  const toast = usePvToast();
  const router = useRouter();
  const { fetch } = useUserSession();

  try {
    await $fetch("/api/auth/signin", {
      method: "POST",
      body: { email, password },
    });
    await fetch();

    router.push("/");
  } catch (e) {
    toast.add({
      life: 3000,
      summary: "Error",
      detail: e,
      severity: "error",
    });
  }
};

export const signInWithPasskey = async (email: string) => {
  const toast = usePvToast();
  const router = useRouter();
  const { fetch } = useUserSession();

  try {
    await authenticate(email);
    await fetch();

    router.push("/");
  } catch {
    toast.add({
      life: 3000,
      summary: "Credentials not found",
      detail: "Please sign up or register your passkey",
      severity: "error",
    });
  }
};

export const signOut = async () => {
  const toast = usePvToast();
  const router = useRouter();
  const { clear } = useUserSession();

  try {
    await $fetch("/api/auth/signout", {
      method: "POST",
    });

    toast.add({
      life: 3000,
      summary: "Success",
      detail: "You have been signed out",
      severity: "success",
    });
  } catch (e) {
    toast.add({
      life: 3000,
      summary: "Error",
      detail: e,
      severity: "error",
    });
  }

  await clear();
  router.push("/auth/signin");
};

export const me = async () => {
  const toast = usePvToast();
  const router = useRouter();
  const { fetch, user, clear } = useUserSession();

  try {
    await $fetch("/api/user/me");
    await fetch();

    toast.add({
      life: 3000,
      summary: "Success",
      detail: user.value?.email,
      severity: "success",
    });
  } catch (e) {
    await clear();
    router.push("/auth/signin");
    toast.add({
      life: 3000,
      summary: "Error",
      detail: e,
      severity: "error",
    });
  }
};
