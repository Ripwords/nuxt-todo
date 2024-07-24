<script lang="ts" setup>
import { breakpointsTailwind } from "@vueuse/core";

const breakpoints = useBreakpoints(breakpointsTailwind);
const xs = breakpoints.smaller("sm");

const { data, refresh } = useFetch("/api/todos/task", {
  method: "GET",
});

const toast = usePvToast();
const description = ref("");
const showPostModal = ref(false);

const addTask = async () => {
  await $fetch("/api/todos/task", {
    method: "POST",
    body: JSON.stringify({
      description: description.value,
    }),
  });
  await refresh();
  description.value = "";
  showPostModal.value = false;

  toast.add({
    severity: "success",
    summary: "Success",
    detail: "Task added successfully",
    life: 2000,
  });
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
      <DataTable class="m-3 w-[100vw]" :value="data">
        <Column v-if="!xs" class="w-[3rem]" field="id" header="No." />
        <Column v-if="!xs" class="w-[6rem]" field="date" header="Date">
          <template #body="slotProps">
            {{ new Date(slotProps.data.date).toLocaleDateString() }}
          </template>
        </Column>
        <Column field="description" header="Desc." />
        <Column class="w-[5rem]" field="action" header="Action">
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
      <Button icon="pi pi-plus" rounded @click="showPostModal = true" />
    </div>
    <NewPost
      v-model:description="description"
      v-model:visible="showPostModal"
      @post="addTask"
    />
  </div>
</template>
