<script lang="ts" setup>
definePageMeta({
  middleware: ["auth"],
});
</script>

<template>
  <div>
    <Menubar>
      <template #start>Todos</template>
      <template #end>
        <div class="flex items-center gap-2">
          <Button type="button" label="ME" @click="me" />
          <Button type="button" label="Sign Out" @click="signOut" />
        </div>
      </template>
    </Menubar>
    <div class="container mx-auto">
      <TodoList />
    </div>
  </div>
</template>
