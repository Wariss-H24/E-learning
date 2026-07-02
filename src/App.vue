<script setup>
import NavbarComponent from './components/NavbarComponent.vue';

import AssistantIA from './components/AssistantIAComponent.vue';
import FooterComponent from './components/FooterComponent.vue';

</script>



<template>
  <div class="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
    <NavbarComponent />
    <main class="flex-1">
      <RouterView />
      <AssistantIA />
    </main>
    <FooterComponent />
  </div>
</template>

<style scoped></style>
