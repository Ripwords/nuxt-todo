<script lang="ts" setup>
withDefaults(
  defineProps<{
    register?: boolean;
  }>(),
  {
    register: false,
  }
);

const loading = ref(false);

const email = defineModel<string>("email", { required: true });
const password = defineModel<string>("password", { required: true });
const confirmPassword = defineModel<string>("confirmPassword", {
  required: false,
});
</script>

<template>
  <Card class="w-[30rem] m-3">
    <template v-if="!signUp" #title>Authentication</template>
    <template v-else #title>Sign Up</template>

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
      </form>

      <div class="flex justify-between items-center gap-2 text-sm">
        <NuxtLink v-if="register" to="/auth/signin">
          Already have an account? Sign In
        </NuxtLink>
        <NuxtLink v-else to="/auth/signup">
          Don't have an account? Sign Up
        </NuxtLink>
        <Button
          v-if="register"
          type="button"
          label="Sign Up"
          :loading
          @click="
            async () => {
              loading = true;
              await signUp(email, password, confirmPassword!);
              loading = false;
            }
          "
        />
        <Button
          v-else
          type="button"
          label="Sign In"
          :loading
          @click="
            async () => {
              loading = true;
              await signIn(email, password);
              loading = false;
            }
          "
        />
      </div>
    </template>
  </Card>
</template>
