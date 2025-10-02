<script setup>
import { useAlertesStore, useAuthStore } from '@/store'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
 
const store = useAlertesStore()

const auth = useAuthStore()

const router = useRouter()
 

const connecter = computed(() => auth.isAuthenticated)
const utilisateur = computed(() => auth.user)




onMounted(() => {
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark")
    isDark.value = true
  }
  window.addEventListener("keydown", search)
})
 
// Etat admin
const admin = computed(() => utilisateur.value?.username === "moodolion")
//  console.log(admin.value);
 
// Gestion du thème
const isDark = ref(false)
function toggleDarkMode() {
  isDark.value = !isDark.value
  localStorage.setItem("theme", isDark.value ? "dark" : "light")
  document.documentElement.classList.toggle(
    "dark",
    localStorage.theme === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
  )
}
 
// Redirection quand on clique sur le profil
function redirection() {
  if (connecter.value) {
    store.toggleMenu()
  } else {
    router.push({ name: 'auth' })
  }
}
 
// Déconnexion
function disconnect() {
  auth.logout()
  store.isOpen = false // fermer le menu s'il est ouvert
  router.push({ name: 'Acceuil' }) // redirection vers la page de login
}
 
// Recherche (Ctrl+K)
const isOpenSearch = ref(false)
function search(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault()
    isOpenSearch.value = !isOpenSearch.value
  }
}
onUnmounted(() => {
  window.removeEventListener("keydown", search)
})
 
</script>

<template>

  <nav
    class="flex items-center justify-between p-4 bg-white dark:bg-[#23272f] shadow-md sticky top-0 z-[100] border-b border-blue-100 dark:border-[#3a4152] transition-colors duration-300">
    <!-- Logo -->
    <RouterLink to="/">
      <div class="flex items-center space-x-2">
      <i class="fas fa-graduation-cap text-blue-500 dark:text-blue-500 text-2xl"></i>
      <span class="text-2xl font-extrabold text-blue-500 dark:text-blue-500">
        HighFive <span class="text-gray-800 dark:text-blue-100">Academy</span>
      </span>
    </div>
    </RouterLink>

    <!-- Liens de navigation -->
    <div class="hidden md:flex justify-center items-center gap-6 font-semibold flex-1">
      <RouterLink to="/" class="nav-btn" active-class="nav-btn-active">Accueil</RouterLink>
      <RouterLink to="/a-propos" class="nav-btn" active-class="nav-btn-active">À propos</RouterLink>
      <RouterLink v-if="admin!==false" to="/admin" class="nav-btn" active-class="nav-btn-active">Admin</RouterLink>
      <RouterLink to="/quiz-section" class="nav-btn" active-class="nav-btn-active">Quiz Section</RouterLink>
    </div>


    <!-- Zone droite : recherche, dark mode, profil -->
  <div class="flex items-center justify-end space-x-4 w-[400px]">

      <!-- Recherche -->
      <div class="flex items-center relative">
        <div v-if="isOpenSearch"
          class="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 transition-colors duration-300">
          <input type="text" placeholder="Rechercher..." v-model="store.searchTerm"
            class="bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 w-32 transition-colors duration-300" />
        </div>
        <button class="ml-2 text-gray-500 dark:text-blue-100 hover:text-blue-500 dark:hover:text-blue-300"
          @click="isOpenSearch = !isOpenSearch">
          <i class="fas fa-search transition-colors duration-300"></i>
        </button>
      </div>

      <!-- Dark mode toggle -->
      <button @click="toggleDarkMode"
        class="cursor-pointer w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 dark:bg-[#2c3140] text-gray-600 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-[#3a4152] transition-colors duration-300">
        <i v-if="!isDark" class="fas fa-moon"></i>
        <span v-else class="material-icons">sunny</span>
      </button>

      <!-- Menu Profil déroulant -->
      <div class="relative">
        <button @click="redirection"
          class="flex items-center gap-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">

        <!-- <button @click="store.toggleMenu"
          class="flex items-center gap-2 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300">
<<<<<<< HEAD
          <div class="w-8 h-8 rounded-full bg-blue-500 dark:bg-blue-400 flex items-center justify-center text-white dark:text-gray-900"> -->


            <i class="fas fa-user"></i>
          </div>
          <span class="hidden md:block text-gray-700 dark:text-blue-100">Profil</span>
        </button>

        <!-- Menu déroulant -->
        <div v-if="store.isOpen"
          class="absolute right-0 mt-2 w-48 bg-white dark:bg-[#23272f] border border-blue-100 dark:border-[#3a4152] rounded-lg shadow-lg transition-colors duration-300">
          <ul class="py-2">
            <li>
              <RouterLink v-if="admin!==false" to="/admin"
                class="block px-4 py-2 text-gray-700 dark:text-blue-100 hover:bg-blue-100 dark:hover:bg-[#3a4152]"
                @click="store.toggleMenu">
                Mon compte
              </RouterLink>

              <RouterLink v-else to="/profil"
                class="block px-4 py-2 text-gray-700 dark:text-blue-100 hover:bg-blue-100 dark:hover:bg-[#3a4152]"
                @click="store.toggleMenu">
                Mon compte
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/parametres"
                class="block px-4 py-2 text-gray-700 dark:text-blue-100 hover:bg-blue-100 dark:hover:bg-[#3a4152]"
                @click="store.toggleMenu">
                Paramètres
              </RouterLink>
            </li>
            <li>
              <RouterLink to='/'
                class="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                @click="disconnect">
                Déconnexion
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>

    </div>
  </nav>
</template>
<style scoped>
/* Boutons de navigation centrés et style actif bleu */
.nav-btn {
  color: #374151;
  padding: 0.5rem 1.2rem;
  border-radius: 0.5rem;
  transition: background 0.2s, color 0.2s;
  font-weight: 600;
  display: inline-block;
}
.nav-btn:hover {
  background: #e0e7ff;
  color: #2563eb;
}
.nav-btn-active {
  background: #2563eb;
  color: #fff !important;
  box-shadow: 0 2px 8px #2563eb33;
}
</style>