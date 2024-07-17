<script lang="ts" setup>
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
</script>

<template>
  <div class="flex justify-center mt-3">
    <AuthForm
      v-model:email="email"
      v-model:password="password"
      v-model:confirm-password="confirmPassword"
      :register="true"
    />
  </div>
</template>
