<script lang="ts" setup>
definePageMeta({
  middleware: ["auth"],
});

const { user } = useUserSession();
const { data: todos } = useFetch("/api/todos/list", {
  method: "GET",
  query: {
    uuid: user.value!.uuid,
  },
});

const addPost = async () => {
  await $fetch("/api/todos/list", {
    method: "POST",
    body: JSON.stringify({
      uuid: user.value!.uuid,
      todos: [
        {
          date: new Date(),
          description: "This is a new todo",
          completed: false,
        },
      ],
    }),
  });
};
</script>

<template>
  <div>
    {{ todos }}
    <Button @click="addPost">Post</Button>
  </div>
</template>
