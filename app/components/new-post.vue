<script lang="ts" setup>
const { enter } = useMagicKeys();

const description = defineModel<string>("description", {
  required: true,
});

const visible = defineModel<boolean>("visible", {
  required: true,
});

const toast = usePvToast();
const emptyDesc = () => {
  toast.add({
    severity: "error",
    summary: "Error",
    detail: "Description is required",
    life: 2000,
  });
  visible.value = false;
};
const emit = defineEmits(["post"]);

const post = async () => {
  if (description.value == "") {
    emptyDesc();
  } else {
    emit("post");
  }
};

watchDebounced(
  enter!,
  () => {
    if (visible.value) {
      if (description.value == "") {
        emptyDesc();
      } else {
        post();
      }
    }
  },
  {
    debounce: 250,
  }
);
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="New Post"
    :style="{ width: '25rem' }"
  >
    <span class="text-surface-500 dark:text-surface-400 block mb-4"
      >Write your new task</span
    >
    <div class="flex items-center gap-4 mb-4">
      <InputText v-model="description" class="w-full" />
    </div>
    <div class="flex justify-end gap-2">
      <Button
        label="Cancel"
        severity="secondary"
        outlined
        class="w-full"
        @click="visible = false"
      />
      <Button label="Post" class="w-full" @click="post" />
    </div>
  </Dialog>
</template>
