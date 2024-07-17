<script lang="ts" setup>
definePageMeta({
  middleware: ["auth"],
});
</script>

<template>
  <div>
    I'm a protected page
    <Button type="button" label="ME" @click="me" />
    <Button type="button" label="Sign Out" @click="signOut" />
  </div>
</template>
