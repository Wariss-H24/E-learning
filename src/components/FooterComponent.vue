<script setup>

</script>

<template>
  <footer class="bg-white dark:bg-[#23272f] border-t border-gray-200 py-6 z-[100] relative transition-colors duration-300">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6">
      <!-- Menu -->
      <nav class="flex space-x-6 mb-4 md:mb-0">
        <RouterLink to="/" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Apprendre</RouterLink>
        <RouterLink to="" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Entreprise</RouterLink>
        <RouterLink to="" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Ressources</RouterLink>
      </nav>

      <!-- Réseaux sociaux -->
      <div class="flex space-x-5">
        <RouterLink to="" class="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
          <i class="fab fa-facebook-f"></i>
        </RouterLink>
        <RouterLink to="" class="text-gray-500 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-300">
          <i class="fab fa-twitter"></i>
        </RouterLink>
        <RouterLink to="" class="text-gray-500 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-500">
          <i class="fab fa-linkedin-in"></i>
        </RouterLink>
        <RouterLink to="" class="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
          <i class="fab fa-github"></i>
        </RouterLink>
      </div>
    </div>
  </footer>
</template>

<style scoped>
i {
  font-size: 1.2rem;
}
</style>


