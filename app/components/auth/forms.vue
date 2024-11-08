<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    register?: boolean;
  }>(),
  {
    register: false,
  }
);

const { enter } = useMagicKeys();
const loading = ref(false);
const toast = usePvToast();

const email = defineModel<string>("email", { required: true });
const password = defineModel<string>("password", { required: true });
const confirmPassword = defineModel<string>("confirmPassword", {
  required: false,
});

watchDebounced(
  enter!,
  () => {
    if (props.register) {
      if (
        confirmPassword.value == "" ||
        password.value == "" ||
        email.value == ""
      ) {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "Information is incomplete",
          life: 2000,
        });
        return;
      }

      if (password.value != confirmPassword.value) {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "Passwords do not match",
          life: 2000,
        });
        return;
      }
      signUp(email.value, password.value, confirmPassword.value!);
    } else {
      if (email.value == "") {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "Information is incomplete",
          life: 2000,
        });
        return;
      }
      signInWithPassword(email.value, password.value);
    }
  },
  { debounce: 500 }
);

const loginPasswordHandler = async () => {
  loading.value = true;
  try {
    await signInWithPassword(email.value, password.value);
  } catch (e) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: e,
      life: 2000,
    });
  } finally {
    loading.value = false;
  }
};

const loginPasskeyHandler = async () => {
  loading.value = true;
  try {
    await signInWithPasskey(email.value);
  } catch (e) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: e,
      life: 2000,
    });
  } finally {
    loading.value = false;
  }
};

const signUpHandler = async () => {
  loading.value = true;
  try {
    await signUp(email.value, password.value, confirmPassword.value!);
  } catch (e) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: e,
      life: 2000,
    });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <Card class="w-[30rem] m-3">
    <template #title>
      <span v-if="!register">Authentication</span>
      <span v-else>Register</span>
    </template>

    <template #content>
      <form>
        <div class="flex justify-between items-center gap-3 mb-3">
          <label for="email" class="font-semibold w-6rem">Email</label>
          <InputText
            id="email"
            v-model="email"
            autocomplete="email"
            type="email"
          />
        </div>
        <div class="flex justify-between items-center gap-3 mb-5">
          <label for="password" class="font-semibold w-6rem">Password</label>
          <Password
            v-model="password"
            :feedback="register"
            :input-props="{
              autocomplete: register ? 'new-password' : 'current-password',
            }"
          />
        </div>
        <div
          v-if="register"
          class="flex justify-between items-center gap-3 mb-5"
        >
          <label for="password" class="font-semibold w-6rem"
            >Confirm Password</label
          >
          <Password
            v-model="confirmPassword"
            :feedback="false"
            :input-props="{ autocomplete: 'new-password' }"
          />
        </div>

        <div class="flex justify-between items-center gap-2 text-sm">
          <div>
            <span v-if="register"> Have an account? </span>
            <span v-else> Don't have an account? </span>
            <NuxtLink
              class="underline transition-colors delay-75 hover:text-[#10b981]"
              :to="`/auth/${register ? 'signin' : 'signup'}`"
            >
              {{ register ? "Sign In" : "Sign Up" }}
            </NuxtLink>
          </div>
          <Button
            v-if="register"
            type="button"
            label="Sign Up"
            :loading
            @click="signUpHandler"
          />
          <div v-else class="flex gap-2">
            <Button
              type="button"
              label="Passkey"
              :loading
              @click="loginPasskeyHandler"
            />
            <Button
              type="button"
              label="Sign In"
              :loading
              @click="loginPasswordHandler"
            />
          </div>
        </div>
      </form>
    </template>
  </Card>
</template>
