<script lang="ts" setup>
definePageMeta({
  middleware: ["auth"],
});
</script>

<template>
  <div class="flex justify-center">
    <Card class="max-w-[50rem] w-[100vw] mx-3">
      <template #header>
        <Menubar>
          <template #start>Todos</template>
          <template #end>
            <div class="flex items-center gap-2">
              <Button type="button" label="ME" @click="me" />
              <Button type="button" label="Sign Out" @click="signOut" />
            </div>
          </template>
        </Menubar>
      </template>
      <template #content>
        <TodoList />
      </template>
    </Card>
  </div>
</template>
