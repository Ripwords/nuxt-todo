<script lang="ts" setup>

const email = ref("")
const password = ref("")

const signUp = async () => {
  await $fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({
      email: email.value,
      password: password.value,
      confirmPassword: password.value
    })
  })
}

const signIn = async () => {
  await $fetch("/api/auth/signin", {
    method: "POST",
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  })
}

const signOut = async () => {
  await $fetch("/api/auth/signout", {
    method: "POST"
  })
}

const me = async () => {
  await $fetch("/api/user/me")
}
</script>

<template>
  <div class="flex justify-center mt-3">
    <Card class="w-[30vw]">
      <template #title>Authentication</template>
      <template #content>
        <div class="flex justify-between items-center gap-3 mb-3">
          <label
            for="email"
            class="font-semibold w-6rem"
            >Email</label
          >
          <InputText
            id="email"
            v-model="email"
            autocomplete="on"
            type="email"
          />
        </div>
        <div class="flex justify-between items-center gap-3 mb-5">
          <label
            for="password"
            class="font-semibold w-6rem"
            >Password</label
          >
          <Password
            v-model="password"
            :feedback="true"
          />
        </div>
        <div class="flex justify-end gap-2">
          <Button
            type="button"
            label="Sign Up"
            severity="secondary"
            @click="signUp"
          />
          <Button
            type="button"
            label="Sign In"
            @click="signIn"
          />
        </div>
        <Button
          type="button"
          label="ME"
          @click="me"
        />
        <Button
          type="button"
          label="Sign Out"
          @click="signOut"
        />
      </template>
    </Card>
  </div>
</template>