<script setup>
import HistoryWatch from './HistoryWatch.vue'
import BadgesComponent from './BadgesComponent.vue'
import { ref, onMounted, computed } from 'vue'
import allCourses from '@/newCourses.json'
import { useAuthStore } from '@/store'
import { supabase } from '@/supabase'

const auth = useAuthStore()
const profileImg = ref('https://cdn-icons-png.flaticon.com/512/1946/1946429.png')
const showEditForm = ref(false)
const saveSuccess = ref(false)
const saveError = ref('')
const saving = ref(false)

const modifiedUser = ref({
  full_name: auth.user?.user_metadata?.full_name || '',
  username: auth.user?.user_metadata?.username || '',
})

onMounted(() => {
  const savedImage = localStorage.getItem('image')
  if (savedImage) profileImg.value = savedImage

  // Sync au cas où le store se charge après
  modifiedUser.value = {
    full_name: auth.user?.user_metadata?.full_name || '',
    username: auth.user?.user_metadata?.username || '',
  }

  const history = JSON.parse(localStorage.getItem('courseHistory') || '{}')
  courseHistory.value = Object.values(history)
})

function previewImage(event) {
  const file = event.target.files[0]
  const allowed = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp']
  if (file && allowed.includes(file.type)) {
    const reader = new FileReader()
    reader.onload = (e) => {
      profileImg.value = e.target.result
      localStorage.setItem('image', e.target.result)
    }
    reader.readAsDataURL(file)
  }
}

async function saveProfile() {
  saving.value = true
  saveError.value = ''
  const { data, error } = await supabase.auth.updateUser({
    data: {
      full_name: modifiedUser.value.full_name,
      username: modifiedUser.value.username,
    }
  })
  saving.value = false
  if (error) {
    saveError.value = error.message
    return
  }
  // Mettre à jour le store
  auth.user = data.user
  showEditForm.value = false
  saveSuccess.value = true
  setTimeout(() => saveSuccess.value = false, 3000)
}

const courseHistory = ref([])

const completedCoursesCount = computed(() =>
  courseHistory.value.filter(c => c.statut === 'Terminé').length
)

const totalLearningHours = computed(() => {
  let totalMinutes = 0
  courseHistory.value.forEach(h => {
    const course = allCourses.courses.find(c => c.id === h.id)
    if (course?.duration) {
      const d = course.duration
      if (d.includes('h')) {
        const parts = d.split('h')
        totalMinutes += parseInt(parts[0]) * 60
        if (parts[1]?.includes('min')) totalMinutes += parseInt(parts[1])
      } else if (d.includes('min')) {
        totalMinutes += parseInt(d)
      }
    }
  })
  return Math.floor(totalMinutes / 60)
})

const badgeDefinitions = {
  'Développement Web': {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor"><path d="M323-160q-11 0-20.5-5.5T288-181l-78-139h58l40 80h92v-40h-68l-40-80H188l-57-100q-2-5-3.5-10t-1.5-10q0-4 5-20l57-100h104l40-80h68v-40h-92l-40 80h-58l78-139q5-10 14.5-15.5T323-800h97q17 0 28.5 11.5T460-760v160h-60l-40 40h100v120h-88l-40-80h-92l-40 40h108l40 80h112v200q0 17-11.5 28.5T420-160h-97Zm217 0q-17 0-28.5-11.5T500-200v-200h112l40-80h108l-40-40h-92l-40 80h-88v-120h100l-40-40h-60v-160q0-17 11.5-28.5T540-800h97q11 0 20.5 5.5T672-779l78 139h-58l-40-80h-92v40h68l40 80h104l57 100q2 5 3.5 10t1.5 10q0 4-5 20l-57 100H668l-40 80h-68v40h92l40-80h58l-78 139q-5 10-14.5 15.5T637-160h-97Z"/></svg>`,
    levels: [
      { required: 5, name: 'Maître du Code', description: '5+ cours Web terminés' },
      { required: 3, name: 'Artisan du Web', description: '3 cours Web terminés' },
      { required: 2, name: 'Apprenti du Web', description: '2 cours Web terminés' }
    ]
  },
  'Programmation': {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor"><path d="M320-240 80-480l240-240 57 57-184 184 183 183-56 56Zm320 0-57-57 184-184-183-183 56-56 240 240-240 240Z"/></svg>`,
    levels: [
      { required: 5, name: 'Architecte Logiciel', description: '5+ cours Programmation terminés' },
      { required: 3, name: 'Développeur Confirmé', description: '3 cours Programmation terminés' },
      { required: 2, name: 'Apprenti Développeur', description: '2 cours Programmation terminés' }
    ]
  },
  'Data & IA': {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480v320q0 33-23.5 56.5T800-80H480Z"/></svg>`,
    levels: [
      { required: 5, name: 'Star de l\'IA', description: '5+ cours Data & IA terminés' },
      { required: 3, name: 'Analyste de Données', description: '3 cours Data & IA terminés' },
      { required: 2, name: 'Explorateur de Données', description: '2 cours Data & IA terminés' }
    ]
  },
  'Design': {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor"><path d="M480-160q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740v484q51-32 107-48t113-16q36 0 70.5 6t69.5 18v-480q15 5 29.5 10.5T898-752q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59Z"/></svg>`,
    levels: [
      { required: 5, name: 'Maître du Design', description: '5+ cours Design terminés' },
      { required: 3, name: 'Designer Aguerri', description: '3 cours Design terminés' },
      { required: 2, name: 'Créatif en Herbe', description: '2 cours Design terminés' }
    ]
  },
}

const earnedBadges = computed(() => {
  const badges = []
  const completed = courseHistory.value
    .filter(c => c.statut === 'Terminé')
    .map(h => allCourses.courses.find(c => c.id === h.id))
    .filter(Boolean)

  const counts = completed.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1
    return acc
  }, {})

  for (const cat in counts) {
    if (badgeDefinitions[cat]) {
      const level = badgeDefinitions[cat].levels.find(l => counts[cat] >= l.required)
      if (level) badges.push({ ...level, category: cat, icon: badgeDefinitions[cat].icon })
    }
  }
  return badges
})

const displayName = computed(() => auth.user?.user_metadata?.full_name || auth.user?.user_metadata?.username || auth.user?.email || 'Utilisateur')
const displayUsername = computed(() => auth.user?.user_metadata?.username || auth.user?.email || '')
const displayEmail = computed(() => auth.user?.email || '')

const userInitials = computed(() => {
  return displayName.value.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
})
</script>

<template>
  <div class="bg-slate-50 dark:bg-slate-900 min-h-screen">

    <!-- Toast succès -->
    <transition name="toast">
      <div v-if="saveSuccess" class="fixed top-20 right-5 z-[9999] flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500 text-white shadow-xl text-sm font-medium">
        <i class="fas fa-check-circle text-lg"></i> Profil mis à jour avec succès !
      </div>
    </transition>

    <!-- Hero profil -->
    <div class="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 pt-10 pb-20 px-4 relative overflow-hidden">
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-20 -right-20 w-72 h-72 bg-white/5 rounded-full"></div>
        <div class="absolute -bottom-10 -left-10 w-56 h-56 bg-white/5 rounded-full"></div>
      </div>
      <div class="max-w-4xl mx-auto relative z-10">
        <div class="flex flex-col sm:flex-row items-center sm:items-end gap-5">
          <!-- Avatar -->
          <div class="relative flex-shrink-0">
            <input id="upload" type="file" accept="image/jpg,image/jpeg,image/png,image/webp" class="hidden" @change="previewImage" />
            <label for="upload" class="cursor-pointer block">
              <div class="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white/30 shadow-xl">
                <img :src="profileImg" class="w-full h-full object-cover" alt="Photo de profil" />
              </div>
              <div class="absolute -bottom-1 -right-1 w-7 h-7 bg-indigo-500 border-2 border-white rounded-lg flex items-center justify-center shadow-md">
                <i class="fas fa-camera text-white text-xs"></i>
              </div>
            </label>
          </div>

          <!-- Infos -->
          <div class="text-center sm:text-left flex-1">
            <h1 class="text-2xl font-extrabold text-white">{{ displayName }}</h1>
            <p class="text-indigo-200 text-sm mt-0.5">@{{ displayUsername }}</p>
            <p v-if="displayEmail" class="text-indigo-300 text-xs mt-1">
              <i class="fas fa-envelope mr-1"></i>{{ displayEmail }}
            </p>
          </div>

          <!-- Bouton modifier -->
          <button
            @click="showEditForm = !showEditForm"
            class="flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/20 text-white text-sm font-medium rounded-xl backdrop-blur-sm transition-all"
          >
            <i :class="showEditForm ? 'fas fa-times' : 'fas fa-pen'"></i>
            {{ showEditForm ? 'Annuler' : 'Modifier le profil' }}
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 -mt-10 relative z-10 pb-16 space-y-6">

      <!-- Formulaire d'édition -->
      <transition name="slide-down">
        <div v-if="showEditForm" class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-lg">
          <h2 class="text-base font-bold text-slate-900 dark:text-white mb-4">Modifier mes informations</h2>
          <form @submit.prevent="saveProfile" class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Nom complet</label>
              <input
                v-model="modifiedUser.full_name"
                type="text"
                placeholder="Votre nom complet"
                class="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Nom d'utilisateur</label>
              <input
                v-model="modifiedUser.username"
                type="text"
                placeholder="Votre pseudo"
                class="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
            <div v-if="saveError" class="sm:col-span-2 text-red-500 text-xs">{{ saveError }}</div>
            <div class="sm:col-span-2 flex justify-end">
              <button type="submit" :disabled="saving" class="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-500/30">
                <i :class="saving ? 'fas fa-spinner fa-spin' : 'fas fa-save'"></i>
                {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
              </button>
            </div>
          </form>
        </div>
      </transition>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-4">
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 text-center shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50">
          <div class="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center mx-auto mb-2">
            <i class="fas fa-check-circle text-emerald-600 dark:text-emerald-400"></i>
          </div>
          <p class="text-2xl font-extrabold text-slate-900 dark:text-white">{{ completedCoursesCount }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Cours terminés</p>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 text-center shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50">
          <div class="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center mx-auto mb-2">
            <i class="fas fa-clock text-indigo-600 dark:text-indigo-400"></i>
          </div>
          <p class="text-2xl font-extrabold text-slate-900 dark:text-white">{{ totalLearningHours }}h</p>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Heures apprises</p>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 text-center shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50">
          <div class="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center mx-auto mb-2">
            <i class="fas fa-medal text-amber-500 dark:text-amber-400"></i>
          </div>
          <p class="text-2xl font-extrabold text-slate-900 dark:text-white">{{ earnedBadges.length }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Badges obtenus</p>
        </div>
      </div>

      <!-- Badges -->
      <BadgesComponent :earned-badges="earnedBadges" />

      <!-- Historique -->
      <HistoryWatch />
    </div>
  </div>
</template>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(20px); }

.slide-down-enter-active, .slide-down-leave-active { transition: all 0.25s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
