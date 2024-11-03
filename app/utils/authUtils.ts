const { register, authenticate } = useWebAuthn({
  registerEndpoint: "/api/webauthn/register", // Default
  authenticateEndpoint: "/api/webauthn/authenticate", // Default
});

const { register: registerExisting } = useWebAuthn({
  registerEndpoint: "/api/webauthn/register-existing",
});

export const signUp = async (
  email: string,
  password: string,
  confirmPassword: string
) => {
  const toast = usePvToast();
  const router = useRouter();
  const { fetch } = useUserSession();

  try {
    await register({
      userName: email,
      password,
      confirmPassword,
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
    router.push("/");
  }
};

export const signIn = async (email: string) => {
  const toast = usePvToast();
  const router = useRouter();
  const { fetch } = useUserSession();

  try {
    await authenticate(email);
    await fetch();
  } catch (e: any) {
    if (e.statusCode === 400 && e.message === "Credential not found") {
      try {
        await registerExisting({
          userName: email,
        });
        await fetch();
      } catch (e: any) {
        toast.add({
          life: 3000,
          summary: "Error",
          detail: e,
          severity: "error",
        });
      }
    }
  }

  router.push("/");
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
