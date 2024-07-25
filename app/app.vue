<script lang="ts" setup>
import "primeicons/primeicons.css";
import { breakpointsTailwind } from "@vueuse/core";
import { SpeedInsights } from "@vercel/speed-insights/nuxt";

useHead({
  htmlAttrs: {
    lang: "en",
  },
  meta: [
    {
      name: "apple-mobile-web-app-capable",
      content: "yes",
    },
    {
      name: "color-scheme",
      content: "light dark",
    },
    {
      name: "viewport",
      content:
        "viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no",
    },
  ],
  title: "Nuxt Todo",
});

const breakpoints = useBreakpoints(breakpointsTailwind);
const xs = breakpoints.smaller("sm");
</script>

<template>
  <div>
    <SpeedInsights />
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
