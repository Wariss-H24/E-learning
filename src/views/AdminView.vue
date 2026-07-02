<script setup>
import GestionCoursComponent from '@/components/GestionCoursComponent.vue'
import { useAlertesStore, useAuthStore } from '@/store'
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'

const store = useAlertesStore()
const auth = useAuthStore()
const isAdmin = computed(() => auth.user?.user_metadata?.username === 'wariss_ia')
const activeTab = ref('courses')

const totalCourses = computed(() => store.courses.length)
const categories = computed(() => [...new Set(store.courses.map(c => c.category))].length)
const freeCount = computed(() => store.courses.filter(c => !c.price || c.price === 0).length)
const paidCount = computed(() => store.courses.filter(c => c.price > 0).length)
</script>

<template>
  <div v-if="isAdmin" class="bg-slate-50 dark:bg-slate-900 min-h-screen">

    <!-- Hero -->
    <div class="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 pt-10 pb-24 px-4 relative overflow-hidden">
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full"></div>
        <div class="absolute -bottom-10 -left-10 w-64 h-64 bg-white/5 rounded-full"></div>
      </div>
      <div class="max-w-6xl mx-auto relative z-10">
        <div class="flex items-center gap-2 mb-3">
          <span class="px-2.5 py-1 bg-white/15 border border-white/20 rounded-full text-xs text-white font-medium">
            <i class="fas fa-shield-alt mr-1.5"></i>Administration
          </span>
        </div>
        <h1 class="text-3xl font-extrabold text-white mb-1">
          Tableau de bord
        </h1>
        <p class="text-indigo-200 text-sm">Gérez le catalogue de cours et les quiz de HighFive Academy</p>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 -mt-14 relative z-10 pb-16 space-y-6">

      <!-- Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center">
              <i class="fas fa-book-open text-indigo-600 dark:text-indigo-400"></i>
            </div>
            <span class="text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">Total</span>
          </div>
          <p class="text-2xl font-extrabold text-slate-900 dark:text-white">{{ totalCourses }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Cours publiés</p>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 bg-violet-50 dark:bg-violet-900/20 rounded-xl flex items-center justify-center">
              <i class="fas fa-tags text-violet-600 dark:text-violet-400"></i>
            </div>
          </div>
          <p class="text-2xl font-extrabold text-slate-900 dark:text-white">{{ categories }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Catégories</p>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center">
              <i class="fas fa-gift text-emerald-600 dark:text-emerald-400"></i>
            </div>
          </div>
          <p class="text-2xl font-extrabold text-slate-900 dark:text-white">{{ freeCount }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Cours gratuits</p>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center">
              <i class="fas fa-euro-sign text-amber-600 dark:text-amber-400"></i>
            </div>
          </div>
          <p class="text-2xl font-extrabold text-slate-900 dark:text-white">{{ paidCount }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Cours payants</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-lg overflow-hidden">
        <div class="flex border-b border-slate-100 dark:border-slate-700 px-4 pt-4 gap-1">
          <button
            @click="activeTab = 'courses'"
            :class="activeTab === 'courses'
              ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'"
            class="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-all -mb-px"
          >
            <i class="fas fa-book-open text-xs"></i> Cours
            <span class="px-1.5 py-0.5 text-xs rounded-full" :class="activeTab === 'courses' ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'">{{ totalCourses }}</span>
          </button>
          <button
            @click="activeTab = 'quiz'"
            :class="activeTab === 'quiz'
              ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'"
            class="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-all -mb-px"
          >
            <i class="fas fa-question-circle text-xs"></i> Quiz
          </button>
        </div>

        <div class="p-4">
          <transition name="tab" mode="out-in">
            <div v-if="activeTab === 'courses'" key="courses">
              <GestionCoursComponent :tabCourses="store.courses" />
            </div>
            <div v-else key="quiz" class="py-6 text-center">
              <div class="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-question-circle text-3xl text-indigo-500"></i>
              </div>
              <p class="text-slate-700 dark:text-slate-200 font-semibold mb-1">Gestion des Quiz</p>
              <p class="text-slate-500 dark:text-slate-400 text-sm mb-5">Créez et modifiez les quiz disponibles sur la plateforme.</p>
              <RouterLink
                to="/admin-quiz-manager"
                class="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-500/30"
              >
                <i class="fas fa-arrow-right"></i> Accéder au gestionnaire de quiz
              </RouterLink>
            </div>
          </transition>
        </div>
      </div>

    </div>
  </div>

  <!-- Accès refusé -->
  <div v-else class="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4">
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-red-100 dark:border-red-900/30 p-10 text-center shadow-xl max-w-sm w-full">
      <div class="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <i class="fas fa-lock text-3xl text-red-500"></i>
      </div>
      <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Accès restreint</h2>
      <p class="text-slate-500 dark:text-slate-400 text-sm mb-6">Cette page est réservée aux administrateurs de la plateforme.</p>
      <RouterLink to="/" class="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors">
        <i class="fas fa-home"></i> Retour à l'accueil
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.tab-enter-active, .tab-leave-active { transition: all 0.15s ease; }
.tab-enter-from, .tab-leave-to { opacity: 0; transform: translateY(6px); }
</style>
