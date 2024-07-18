<script lang="ts" setup>
const { data, refresh } = useFetch("/api/todos/task", {
  method: "GET",
});

const description = ref("");

const addTask = async () => {
  await $fetch("/api/todos/task", {
    method: "POST",
    body: JSON.stringify({
      date: new Date(),
      description: description.value,
    }),
  });
  await refresh();
};

const completeTask = async (index: number) => {
  await $fetch("/api/todos/task", {
    method: "DELETE",
    body: JSON.stringify({
      index,
    }),
  });
  await refresh();
};
</script>

<template>
  <div>
    <div class="flex justify-center">
      <DataTable
        class="mt-3"
        table-style="min-width: 50rem"
        :value="data?.todos"
      >
        <Column field="id" header="No." />
        <Column field="date" header="Date">
          <template #body="slotProps">
            {{ new Date(slotProps.data.date).toLocaleDateString() }}
          </template>
        </Column>
        <Column field="description" header="Desc." />
        <Column field="completed" header="Completed">
          <template #body="slotProps">
            <Button
              icon="pi pi-check"
              @click="completeTask(slotProps.data.id)"
            />
          </template>
        </Column>
      </DataTable>
    </div>
    <div class="fixed right-5 bottom-5">
      <Button icon="pi pi-plus" rounded @click="addTask" />
    </div>
  </div>
</template>
