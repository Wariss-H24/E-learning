<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useAuthStore, useAlertesStore } from '@/store'

const auth = useAuthStore()
const props = defineProps({ tabCourses: Array })
const router = useRouter()
const emit = defineEmits(['show-details'])
const store = useAlertesStore()

const filteredCourses = computed(() => {
  if (!store.searchTerm) return props.tabCourses
  return props.tabCourses.filter(course =>
    course.title.toLowerCase().includes(store.searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(store.searchTerm.toLowerCase()) ||
    course.level.toLowerCase().includes(store.searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(store.searchTerm.toLowerCase())
  )
})

const levelColors = {
  'Débutant': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'Intermédiaire': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'Avancé': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

function getLevelColor(level) {
  return levelColors[level] || 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
}
</script>

<template>
  <div class="p-6">
    <!-- Header résultats -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-xl font-bold text-slate-900 dark:text-white">Tous les cours</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{{ filteredCourses.length }} cours disponibles</p>
      </div>
    </div>

    <!-- Grid cours -->
    <div v-if="filteredCourses.length > 0" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      <div
        v-for="cours in filteredCourses"
        :key="cours.id"
        class="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:shadow-slate-200/60 dark:hover:shadow-slate-900/60 hover:-translate-y-1 transition-all duration-300"
      >
        <!-- Thumbnail -->
        <div class="relative overflow-hidden h-44">
          <img
            :src="cours.thumbnail"
            :alt="cours.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          <span class="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg">
            {{ cours.category }}
          </span>
          <span v-if="cours.price === 0" class="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            Gratuit
          </span>
        </div>

        <!-- Content -->
        <div class="p-4">
          <h3 class="font-semibold text-slate-900 dark:text-white text-sm leading-snug mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {{ cours.title }}
          </h3>

          <p class="text-xs text-slate-500 dark:text-slate-400 mb-3">
            <i class="fas fa-user-tie mr-1"></i>{{ cours.instructor }}
          </p>

          <!-- Rating -->
          <div class="flex items-center gap-1.5 mb-3">
            <div class="flex">
              <i v-for="n in 5" :key="n" class="fas fa-star text-xs" :class="n <= Math.round(cours.rating || 4) ? 'text-amber-400' : 'text-slate-200 dark:text-slate-600'"></i>
            </div>
            <span class="text-xs font-semibold text-amber-600 dark:text-amber-400">{{ cours.rating || '4.5' }}</span>
            <span class="text-xs text-slate-400">({{ cours.enrolledStudents || 0 }})</span>
          </div>

          <!-- Meta -->
          <div class="flex items-center gap-2 mb-4">
            <span :class="getLevelColor(cours.level)" class="text-xs font-medium px-2 py-0.5 rounded-full">
              {{ cours.level }}
            </span>
            <span class="text-xs text-slate-400 dark:text-slate-500">
              <i class="fas fa-clock mr-1"></i>{{ cours.duration }}
            </span>
          </div>

          <!-- Actions -->
          <div class="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
            <button
              @click="emit('show-details', cours.id)"
              class="flex-1 text-xs font-medium py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-indigo-300 hover:text-indigo-600 dark:hover:border-indigo-500 dark:hover:text-indigo-400 transition-all"
            >
              Détails
            </button>
            <router-link
              :to="auth.isAuthenticated ? `/lessons/${cours.id}` : { name: 'auth' }"
              class="flex-1 text-xs font-semibold py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-center transition-colors shadow-sm shadow-indigo-500/30"
            >
              Commencer
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="flex flex-col items-center justify-center py-20 text-center">
      <div class="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
        <i class="fas fa-search text-2xl text-slate-400"></i>
      </div>
      <h3 class="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-1">Aucun cours trouvé</h3>
      <p class="text-sm text-slate-400">Essayez d'autres mots-clés ou catégories</p>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
