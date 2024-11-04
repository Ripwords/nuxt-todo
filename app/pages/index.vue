<script lang="ts" setup>
definePageMeta({
  middleware: ["auth"],
});

const { user, fetch } = useUserSession();
</script>

<template>
  <div class="flex justify-center">
    <Card class="max-w-[50rem] w-[100vw] mx-3">
      <template #header>
        <Menubar>
          <template #start>Todos</template>
          <template #end>
            <div class="flex items-center gap-2">
              <Button
                v-if="!user?.webauthn"
                type="button"
                label="Register Passkey"
                @click="
                  async () => {
                    await registerExistingUser(user?.email);
                    await fetch();
                  }
                "
              />
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
