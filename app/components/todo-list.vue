<script lang="ts" setup>
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
      <DataView class="w-full" :value="data" data-key="id">
        <template #list>
          <div class="grid grid-cols-1 gap-2">
            <TransitionGroup name="list" tag="Card">
              <Card v-for="item in data" :key="item.id">
                <template #subtitle>
                  <div class="text-gray-500">
                    {{ new Date(item.date).toLocaleDateString() }}
                  </div>
                </template>
                <template #content>
                  <div
                    class="flex justify-between items-center p-2 shadow-md rounded-md gap-5"
                  >
                    <div class="break-words flex-grow min-w-0">
                      {{ item.description }}
                    </div>
                    <Button
                      class="flex-shrink-0 w-10 h-10"
                      icon="pi pi-check"
                      @click="completeTask(item.id)"
                    />
                  </div>
                </template>
              </Card>
            </TransitionGroup>
          </div>
        </template>
      </DataView>
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

<style scoped>
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>
