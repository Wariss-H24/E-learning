<script>
import { RouterLink } from 'vue-router'
import { ref } from 'vue'

export default {
  setup() {
    const isOpen = ref(false)
    return {
      isOpen,
      toggleSidebar: () => isOpen.value = !isOpen.value,
      closeSidebar: () => isOpen.value = false,
    }
  }
}
</script>

<template>
  <!-- Mobile toggle -->
  <button
    @click="toggleSidebar"
    class="lg:hidden fixed bottom-6 left-4 z-[99999] w-12 h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-xl flex items-center justify-center transition-all"
  >
    <i :class="isOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
  </button>

  <!-- Mobile overlay -->
  <transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" @click="closeSidebar"></div>
  </transition>

  <!-- Mobile sidebar -->
  <transition name="slide">
    <aside v-if="isOpen" class="fixed top-16 left-0 h-[calc(100vh-4rem)] w-60 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 z-50 lg:hidden overflow-y-auto">
      <nav class="p-4 space-y-1">
        <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-3">Navigation</p>
        <RouterLink to="/" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200" @click="closeSidebar"><i class="fas fa-home w-4"></i>Accueil</RouterLink>
        <RouterLink to="/a-propos" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200" @click="closeSidebar"><i class="fas fa-info-circle w-4"></i>À propos</RouterLink>
        <RouterLink to="/quiz-section" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200" @click="closeSidebar"><i class="fas fa-brain w-4"></i>Quiz</RouterLink>
        <div class="border-t border-slate-100 dark:border-slate-700 my-3"></div>
        <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-3">Compte</p>
        <RouterLink to="/profil" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200" @click="closeSidebar"><i class="fas fa-user w-4"></i>Mon profil</RouterLink>
      </nav>
    </aside>
  </transition>

  <!-- Desktop sidebar -->
  <aside class="hidden lg:flex flex-col w-56 flex-shrink-0 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 min-h-[calc(100vh-4rem)]">
    <nav class="p-4 space-y-1 sticky top-16">
      <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-3">Navigation</p>
      <RouterLink to="/" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200" active-class="!bg-indigo-50 dark:!bg-indigo-900/30 !text-indigo-600 dark:!text-indigo-400"><i class="fas fa-home w-4"></i>Accueil</RouterLink>
      <RouterLink to="/a-propos" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200" active-class="!bg-indigo-50 dark:!bg-indigo-900/30 !text-indigo-600 dark:!text-indigo-400"><i class="fas fa-info-circle w-4"></i>À propos</RouterLink>
      <RouterLink to="/quiz-section" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200" active-class="!bg-indigo-50 dark:!bg-indigo-900/30 !text-indigo-600 dark:!text-indigo-400"><i class="fas fa-brain w-4"></i>Quiz</RouterLink>
      <div class="border-t border-slate-100 dark:border-slate-700 my-3"></div>
      <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-3">Compte</p>
      <RouterLink to="/profil" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200" active-class="!bg-indigo-50 dark:!bg-indigo-900/30 !text-indigo-600 dark:!text-indigo-400"><i class="fas fa-user w-4"></i>Mon profil</RouterLink>
    </nav>
  </aside>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-enter-active, .slide-leave-active { transition: transform 0.25s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(-100%); }
</style>
