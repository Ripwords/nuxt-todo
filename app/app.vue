<script lang="ts" setup>
import { breakpointsTailwind } from "@vueuse/core";
import "primeicons/primeicons.css";

const breakpoints = useBreakpoints(breakpointsTailwind);
const xs = breakpoints.smaller("sm");
</script>

<template>
  <div>
    <div class="m-3">
      <Toast :position="xs ? 'bottom-center' : 'top-right'" />
    </div>
    <NuxtRouteAnnouncer />
    <NuxtPwaAssets />
    <NuxtPage />
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}

.p-toast {
  max-width: 100%;
  padding: 0.5rem;
}
</style>
