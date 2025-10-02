<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

// const isOpen = ref(false);

// function toggleMenu() {
//   isOpen.value = !isOpen.value;
// }
</script>

<template>
  <div class="relative">
    <!-- Bouton Profil -->
    <button 
      @click="toggleMenu" 
      class="flex items-center gap-2 p-2 rounded-full bg-white dark:bg-[#23272f] hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
    >
      <img src="/profile.jpg" alt="Profil" class="w-8 h-8 rounded-full" />
      <span class="hidden md:block">Mon Profil</span>
    </button>

    <!-- Menu déroulant -->
    <div 
      v-if="isOpen" 
      class="absolute right-0 mt-2 w-48 bg-white dark:bg-[#23272f] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg text-gray-900 dark:text-gray-100"
    >
  <ul class="py-2">
        <li>
          <RouterLink 
            to="/compte" 
            class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
            @click="isOpen = false"
          >
            Mon compte
          </RouterLink>
        </li>
        <li>
          <RouterLink 
            to="/parametres" 
            class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
            @click="isOpen = false"
          >
            Paramètres
          </RouterLink>
        </li>
        <li>
          <RouterLink 
            to="/logout" 
            class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            @click="isOpen = false"
          >
            Déconnexion
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>
