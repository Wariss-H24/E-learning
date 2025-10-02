<script>

import { RouterLink } from 'vue-router';
import { ref } from 'vue';

export default {
  setup() {
    const isOpen = ref(false);
    function toggleSidebar() {
      isOpen.value = !isOpen.value;
    }
    function closeSidebar() {
      isOpen.value = false;
    }
    return { isOpen, toggleSidebar, closeSidebar };
  }
}

</script>

<template>
  <!-- Bouton menu hamburger visible sur mobile/tablette -->
  <button @click="toggleSidebar" class="lg:hidden fixed top-40 right-4 z-[100000] bg-blue-500 text-white rounded-full p-2 shadow-md">
    <i class="fas fa-bars text-xl"></i>
  </button>

  <!-- Overlay et sidebar mobile/tablette -->
  <transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-40 z-40 lg:hidden" @click="closeSidebar"></div>
  </transition>
  <transition name="slide">
    <aside
      v-if="isOpen"
      class="fixed top-[100px] left-0 h-full w-64 bg-white dark:bg-[#23272f] shadow-md transition-colors duration-300 border-r border-blue-100 dark:border-[#3a4152] z-50 lg:hidden"
    >
      <div class="flex flex-col h-full py-6">
        <!-- ...existing code... -->
        <div class="px-4 py-2">
          <RouterLink to="/" class="flex items-center px-3 py-2 text-gray-700 dark:text-blue-100 rounded-lg transition-colors hover:bg-blue-100 dark:hover:bg-[#3a4152] border border-transparent dark:border-[#2c3140]" @click="closeSidebar">
            <i class="fas fa-home w-5 h-5 mr-3"></i>
            Accueil
          </RouterLink>
        </div>
        <div class="px-4 py-2">
          <RouterLink to="/lessons/:id" class="flex items-center px-3 py-2 text-gray-700 dark:text-blue-100 rounded-lg transition-colors hover:bg-blue-100 dark:hover:bg-[#3a4152] border border-transparent dark:border-[#2c3140]" @click="closeSidebar">
            <i class="fas fa-book w-5 h-5 mr-3"></i>
            Cours
          </RouterLink>
        </div>
        <div class="border-t border-blue-100 dark:border-[#3a4152] my-2 mx-4"></div>
        <div class="px-4 py-2">
          <RouterLink to="/profil" class="flex items-center px-3 py-2 text-gray-700 dark:text-blue-100 rounded-lg transition-colors hover:bg-blue-100 dark:hover:bg-[#3a4152] border border-transparent dark:border-[#2c3140]" @click="closeSidebar">
            <i class="fas fa-user w-5 h-5 mr-3"></i>
            Profil Utilisateur
          </RouterLink>
        </div>
        <div class="border-t border-blue-100 dark:border-[#3a4152] my-2 mx-4"></div>
        <div class="px-4 py-2">
          <RouterLink to="" class="flex items-center px-3 py-2 text-gray-700 dark:text-blue-100 rounded-lg transition-colors hover:bg-blue-100 dark:hover:bg-[#3a4152] border border-transparent dark:border-[#2c3140]" @click="closeSidebar">
            <i class="fas fa-cog w-5 h-5 mr-3"></i>
            GESTION
          </RouterLink>
        </div>
        <div class="px-4 py-2">
          <RouterLink to="" class="flex items-center px-3 py-2 text-gray-700 dark:text-blue-100 rounded-lg transition-colors hover:bg-blue-100 dark:hover:bg-[#3a4152] border border-transparent dark:border-[#2c3140]" @click="closeSidebar">
            <i class="fas fa-users-cog w-5 h-5 mr-3"></i>
            Administration
          </RouterLink>
        </div>
      </div>
    </aside>
  </transition>

  <!-- Sidebar desktop -->
  <aside class="container w-64 min-h-screen bg-white dark:bg-[#23272f] shadow-md transition-colors duration-300 border-r border-blue-100 dark:border-[#3a4152] hidden lg:block">
    <div class="flex flex-col h-full py-6">
      <!-- ...existing code... -->
      <div class="px-4 py-2">
        <RouterLink to="/" class="flex items-center px-3 py-2 text-gray-700 dark:text-blue-100 rounded-lg transition-colors hover:bg-blue-100 dark:hover:bg-[#3a4152] border border-transparent dark:border-[#2c3140]">
          <i class="fas fa-home w-5 h-5 mr-3"></i>
          Accueil
        </RouterLink>
      </div>
      <div class="px-4 py-2">
        <RouterLink to="/lessons/:id" class="flex items-center px-3 py-2 text-gray-700 dark:text-blue-100 rounded-lg transition-colors hover:bg-blue-100 dark:hover:bg-[#3a4152] border border-transparent dark:border-[#2c3140]">
          <i class="fas fa-book w-5 h-5 mr-3"></i>
          Cours
        </RouterLink>
      </div>
      <div class="border-t border-blue-100 dark:border-[#3a4152] my-2 mx-4"></div>
      <div class="px-4 py-2">
        <RouterLink to="/profil" class="flex items-center px-3 py-2 text-gray-700 dark:text-blue-100 rounded-lg transition-colors hover:bg-blue-100 dark:hover:bg-[#3a4152] border border-transparent dark:border-[#2c3140]">
          <i class="fas fa-user w-5 h-5 mr-3"></i>
          Profil Utilisateur
        </RouterLink>
      </div>
      <div class="border-t border-blue-100 dark:border-[#3a4152] my-2 mx-4"></div>
      <div class="px-4 py-2">
        <RouterLink to="" class="flex items-center px-3 py-2 text-gray-700 dark:text-blue-100 rounded-lg transition-colors hover:bg-blue-100 dark:hover:bg-[#3a4152] border border-transparent dark:border-[#2c3140]">
          <i class="fas fa-cog w-5 h-5 mr-3"></i>
          GESTION
        </RouterLink>
      </div>
      <div class="px-4 py-2">
        <RouterLink to="" class="flex items-center px-3 py-2 text-gray-700 dark:text-blue-100 rounded-lg transition-colors hover:bg-blue-100 dark:hover:bg-[#3a4152] border border-transparent dark:border-[#2c3140]">
          <i class="fas fa-users-cog w-5 h-5 mr-3"></i>
          Administration
        </RouterLink>
      </div>
    </div>
  </aside>
</template>

<style scoped>
  .container {
    margin-top: 0.1rem;
    border-top: 1px solid rgba(128, 128, 128, 0.199);
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.2s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  .slide-enter-active, .slide-leave-active {
    transition: transform 0.3s;
  }
  .slide-enter, .slide-leave-to {
    transform: translateX(-100%);
  }
</style>