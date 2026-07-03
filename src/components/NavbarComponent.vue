<script setup>
import { useAlertesStore, useAuthStore } from '@/store'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const store = useAlertesStore()
const auth = useAuthStore()
const router = useRouter()

const connecter = computed(() => auth.isAuthenticated)
const utilisateur = computed(() => auth.user)
const admin = computed(() => utilisateur.value?.user_metadata?.username === 'wariss_ia')
const displayName = computed(() => utilisateur.value?.user_metadata?.full_name || utilisateur.value?.user_metadata?.username || utilisateur.value?.email || '')
const profileImg = ref(null)

const isDark = ref(false)
const isOpenSearch = ref(false)
const mobileMenuOpen = ref(false)

onMounted(() => {
  if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark')
    isDark.value = true
  }
  profileImg.value = localStorage.getItem('image') || null
  window.addEventListener('keydown', search)
  // Sync image si modifiée dans le dashboard
  window.addEventListener('storage', () => {
    profileImg.value = localStorage.getItem('image') || null
  })
})
onUnmounted(() => {
  window.removeEventListener('keydown', search)
  window.removeEventListener('storage', () => {})
})

function toggleDarkMode() {
  isDark.value = !isDark.value
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  document.documentElement.classList.toggle('dark', isDark.value)
}

function redirection() {
  if (connecter.value) store.toggleMenu()
  else router.push({ name: 'auth' })
}

function disconnect() {
  auth.logout()
  store.isOpen = false
  router.push({ name: 'Acceuil' })
}

function search(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    isOpenSearch.value = !isOpenSearch.value
  }
}

const userInitials = computed(() => {
  const name = displayName.value
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'
})
</script>

<template>
  <nav class="sticky top-0 z-[100] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 transition-all duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">

        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2.5 flex-shrink-0">
          <div class="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <i class="fas fa-graduation-cap text-white text-sm"></i>
          </div>
          <span class="text-lg font-bold text-slate-900 dark:text-white">
            HighFive<span class="text-indigo-500">Academy</span>
          </span>
        </RouterLink>

        <!-- Nav links desktop -->
        <div class="hidden md:flex items-center gap-1">
          <RouterLink to="/" class="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200" active-class="!text-indigo-600 dark:!text-indigo-400 !bg-indigo-50 dark:!bg-indigo-900/30">Accueil</RouterLink>
          <RouterLink to="/a-propos" class="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200" active-class="!text-indigo-600 dark:!text-indigo-400 !bg-indigo-50 dark:!bg-indigo-900/30">À propos</RouterLink>
          <RouterLink to="/cours" class="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200" active-class="!text-indigo-600 dark:!text-indigo-400 !bg-indigo-50 dark:!bg-indigo-900/30">Cours</RouterLink>
          <RouterLink v-if="admin" to="/admin" class="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200" active-class="!text-indigo-600 dark:!text-indigo-400 !bg-indigo-50 dark:!bg-indigo-900/30">Admin</RouterLink>
          <RouterLink to="/quiz-section" class="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200" active-class="!text-indigo-600 dark:!text-indigo-400 !bg-indigo-50 dark:!bg-indigo-900/30">Quiz</RouterLink>
        </div>

        <!-- Right zone -->
        <div class="flex items-center gap-2">

          <!-- Search -->
          <div class="flex items-center">
            <transition name="search-expand">
              <div v-if="isOpenSearch" class="flex items-center bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-1.5 mr-1 border border-slate-200 dark:border-slate-700">
                <i class="fas fa-search text-slate-400 text-xs mr-2"></i>
                <input
                  type="text"
                  placeholder="Rechercher un cours..."
                  v-model="store.searchTerm"
                  class="bg-transparent outline-none text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 w-44"
                  autofocus
                />
                <kbd class="hidden sm:inline-flex items-center px-1.5 py-0.5 text-xs text-slate-400 bg-slate-200 dark:bg-slate-700 rounded ml-2">⌘K</kbd>
              </div>
            </transition>
            <button
              @click="isOpenSearch = !isOpenSearch"
              class="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-all duration-200"
              :class="isOpenSearch ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500' : ''"
            >
              <i class="fas fa-search text-sm"></i>
            </button>
          </div>

          <!-- Dark mode -->
          <button @click="toggleDarkMode" class="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200">
            <i v-if="!isDark" class="fas fa-moon text-sm"></i>
            <i v-else class="fas fa-sun text-sm text-amber-400"></i>
          </button>

          <!-- Profile -->
          <div class="relative">
            <button @click="redirection" class="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <div class="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-md flex-shrink-0">
                <img v-if="connecter && profileImg" :src="profileImg" class="w-full h-full object-cover" alt="avatar" />
                <span v-else-if="connecter">{{ userInitials }}</span>
                <i v-else class="fas fa-user text-xs"></i>
              </div>
              <span class="hidden md:block text-sm font-medium text-slate-700 dark:text-slate-200">
                {{ connecter ? displayName : 'Connexion' }}
              </span>
              <i v-if="connecter" class="fas fa-chevron-down text-xs text-slate-400"></i>
            </button>

            <!-- Dropdown -->
            <transition name="dropdown">
              <div v-if="store.isOpen" class="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden">
                <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    <img v-if="profileImg" :src="profileImg" class="w-full h-full object-cover" alt="avatar" />
                    <span v-else>{{ userInitials }}</span>
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-semibold text-slate-800 dark:text-white truncate">{{ displayName }}</p>
                    <p class="text-xs text-slate-400 truncate">{{ utilisateur?.email }}</p>
                  </div>
                </div>
                <ul class="py-1">
                  <li>
                    <RouterLink :to="admin ? '/admin' : '/profil'" class="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors" @click="store.toggleMenu">
                      <i class="fas fa-user-circle w-4"></i> Mon compte
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/parametres" class="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors" @click="store.toggleMenu">
                      <i class="fas fa-cog w-4"></i> Paramètres
                    </RouterLink>
                  </li>
                  <li class="border-t border-slate-100 dark:border-slate-700 mt-1 pt-1">
                    <button @click="disconnect" class="flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left">
                      <i class="fas fa-sign-out-alt w-4"></i> Déconnexion
                    </button>
                  </li>
                </ul>
              </div>
            </transition>
          </div>

          <!-- Mobile menu btn -->
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200">
            <i :class="mobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'" class="text-sm"></i>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <transition name="mobile-menu">
        <div v-if="mobileMenuOpen" class="md:hidden border-t border-slate-200 dark:border-slate-700 py-3 space-y-1">
          <RouterLink to="/" class="block px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 rounded-lg transition-colors" @click="mobileMenuOpen = false">Accueil</RouterLink>
          <RouterLink to="/a-propos" class="block px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 rounded-lg transition-colors" @click="mobileMenuOpen = false">À propos</RouterLink>
          <RouterLink to="/cours" class="block px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 rounded-lg transition-colors" @click="mobileMenuOpen = false">Cours</RouterLink>
          <RouterLink v-if="admin" to="/admin" class="block px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 rounded-lg transition-colors" @click="mobileMenuOpen = false">Admin</RouterLink>
          <RouterLink to="/quiz-section" class="block px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 rounded-lg transition-colors" @click="mobileMenuOpen = false">Quiz</RouterLink>
        </div>
      </transition>
    </div>
  </nav>
</template>

<style scoped>
.search-expand-enter-active, .search-expand-leave-active { transition: all 0.2s ease; }
.search-expand-enter-from, .search-expand-leave-to { opacity: 0; transform: scaleX(0.8); }

.dropdown-enter-active, .dropdown-leave-active { transition: all 0.15s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-8px) scale(0.95); }

.mobile-menu-enter-active, .mobile-menu-leave-active { transition: all 0.2s ease; }
.mobile-menu-enter-from, .mobile-menu-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
