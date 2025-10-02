<script setup>
import NavbarComponent from './components/NavbarComponent.vue';

import AssistantIA from './components/AssistantIAComponent.vue';
import FooterComponent from './components/FooterComponent.vue';

</script>



<template>
  <div class="flex flex-col min-h-screen relative">
    <header class="sticky top-0 z-[100000000]">
      <NavbarComponent />
    </header>
    <main class="flex-1">
      <RouterView />
      <AssistantIA />
    </main>
    <footer class=" z-[100000000]">
      <FooterComponent />
    </footer>
  </div>
</template>

<style scoped></style>
