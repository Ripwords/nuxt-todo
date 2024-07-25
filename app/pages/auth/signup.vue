<script lang="ts" setup>
definePageMeta({
  middleware: ["auto-login"],
});

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
</script>

<template>
  <div class="flex justify-center mt-3">
    <AuthForms
      v-model:email="email"
      v-model:password="password"
      v-model:confirm-password="confirmPassword"
      :register="true"
    />
  </div>
</template>
