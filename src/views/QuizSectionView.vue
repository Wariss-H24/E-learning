<script setup>
import quizData from '@/quizzes.json'
import { RouterLink, useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import { useAuthStore } from '@/store'

const auth = useAuthStore()
const router = useRouter()
const search = ref('')
const selectedDifficulty = ref('')
const showAuthModal = ref(false)
const pendingQuizId = ref(null)

const difficulties = [
  { label: 'Tous', value: '' },
  { label: 'Facile', value: 'easy', max: 5 },
  { label: 'Moyen', value: 'medium', min: 5, max: 7 },
  { label: 'Difficile', value: 'hard', min: 7 },
]

function getDifficulty(quiz) {
  if (quiz.minimum_score <= 4) return { label: 'Facile', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' }
  if (quiz.minimum_score <= 6) return { label: 'Moyen', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' }
  return { label: 'Difficile', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' }
}

function startQuiz(quizId) {
  if (auth.isAuthenticated) {
    router.push(`/quiz/${quizId}`)
  } else {
    pendingQuizId.value = quizId
    showAuthModal.value = true
  }
}

function getDifficultyKey(quiz) {
  if (quiz.minimum_score <= 4) return 'easy'
  if (quiz.minimum_score <= 6) return 'medium'
  return 'hard'
}

const categoryIcons = {
  'HTML': 'fab fa-html5',
  'CSS': 'fab fa-css3-alt',
  'JavaScript': 'fab fa-js',
  'Vue': 'fab fa-vuejs',
  'React': 'fab fa-react',
  'Python': 'fab fa-python',
  'Java': 'fab fa-java',
  'Node': 'fab fa-node-js',
  'Laravel': 'fab fa-laravel',
  'WordPress': 'fab fa-wordpress',
  'Go': 'fas fa-code',
  'Kotlin': 'fas fa-mobile-alt',
  'Rust': 'fas fa-cog',
  'C': 'fas fa-microchip',
  'TypeScript': 'fas fa-code',
  'SQL': 'fas fa-database',
  'Data': 'fas fa-chart-bar',
  'Machine': 'fas fa-brain',
  'Power': 'fas fa-chart-pie',
  'Pandas': 'fas fa-table',
  'Adobe': 'fas fa-paint-brush',
  'Email': 'fas fa-envelope',
  'Agile': 'fas fa-tasks',
  'Gestion': 'fas fa-project-diagram',
}

function getIcon(title) {
  for (const [key, icon] of Object.entries(categoryIcons)) {
    if (title.includes(key)) return icon
  }
  return 'fas fa-question-circle'
}

const filteredQuizzes = computed(() => {
  return quizData.quizzes.filter(q => {
    const matchSearch = q.title.toLowerCase().includes(search.value.toLowerCase())
    const matchDiff = !selectedDifficulty.value || getDifficultyKey(q) === selectedDifficulty.value
    return matchSearch && matchDiff
  })
})
</script>

<template>
  <div class="bg-slate-50 dark:bg-slate-900 min-h-screen">

    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 py-16 px-4">
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-20 -right-20 w-72 h-72 bg-white/5 rounded-full"></div>
        <div class="absolute -bottom-16 -left-16 w-64 h-64 bg-white/5 rounded-full"></div>
      </div>
      <div class="relative z-10 max-w-3xl mx-auto text-center">
        <span class="inline-flex items-center gap-2 bg-white/15 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm border border-white/20">
          <i class="fas fa-brain"></i> Testez vos connaissances
        </span>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
          Quiz & Évaluations
        </h1>
        <p class="text-indigo-100 text-base sm:text-lg max-w-xl mx-auto mb-8">
          {{ quizData.quizzes.length }} quiz disponibles pour tester et renforcer vos compétences dans différents domaines.
        </p>

        <!-- Search bar dans le hero -->
        <div class="max-w-md mx-auto relative">
          <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input
            v-model="search"
            type="text"
            placeholder="Rechercher un quiz..."
            class="w-full bg-white dark:bg-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none shadow-xl border border-white/20 focus:ring-2 focus:ring-white/30 transition-all"
          />
        </div>
      </div>
    </section>

    <!-- Filtres + contenu -->
    <div class="max-w-7xl mx-auto px-4 py-10">

      <!-- Filtres difficulté -->
      <div class="flex items-center gap-2 mb-8 flex-wrap">
        <span class="text-sm font-medium text-slate-500 dark:text-slate-400 mr-1">Difficulté :</span>
        <button
          v-for="d in difficulties"
          :key="d.value"
          @click="selectedDifficulty = d.value"
          :class="selectedDifficulty === d.value
            ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600'"
          class="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
        >
          {{ d.label }}
        </button>

        <span class="ml-auto text-sm text-slate-400 dark:text-slate-500">
          {{ filteredQuizzes.length }} résultat{{ filteredQuizzes.length > 1 ? 's' : '' }}
        </span>
      </div>

      <!-- Grid quiz -->
      <div v-if="filteredQuizzes.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <div
          v-for="quiz in filteredQuizzes"
          :key="quiz.id"
          class="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:shadow-slate-200/60 dark:hover:shadow-slate-900/60 hover:-translate-y-1 transition-all duration-300 flex flex-col"
        >
          <!-- Card header coloré -->
          <div class="h-2 bg-gradient-to-r from-indigo-500 to-violet-600"></div>

          <div class="p-5 flex flex-col flex-1">
            <!-- Icon + difficulté -->
            <div class="flex items-start justify-between mb-4">
              <div class="w-11 h-11 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <i :class="getIcon(quiz.title)" class="text-indigo-600 dark:text-indigo-400 text-lg"></i>
              </div>
              <span :class="getDifficulty(quiz).color" class="text-xs font-semibold px-2.5 py-1 rounded-full">
                {{ getDifficulty(quiz).label }}
              </span>
            </div>

            <!-- Titre -->
            <h2 class="font-bold text-sm text-slate-900 dark:text-white leading-snug mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
              {{ quiz.title }}
            </h2>

            <!-- Meta -->
            <div class="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 mb-4 mt-auto">
              <span class="flex items-center gap-1">
                <i class="fas fa-list-ol text-indigo-400"></i>
                {{ quiz.questions.length }} questions
              </span>
              <span class="flex items-center gap-1">
                <i class="fas fa-trophy text-amber-400"></i>
                Score min : {{ quiz.minimum_score }}/{{ quiz.questions.length }}
              </span>
            </div>

            <!-- CTA -->
            <button
              @click="startQuiz(quiz.id)"
              class="flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shadow-indigo-500/30"
            >
              <i class="fas fa-play text-xs"></i> Commencer le quiz
            </button>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="flex flex-col items-center justify-center py-20 text-center">
        <div class="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
          <i class="fas fa-search text-2xl text-slate-400"></i>
        </div>
        <h3 class="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-1">Aucun quiz trouvé</h3>
        <p class="text-sm text-slate-400">Essayez d'autres mots-clés ou filtres</p>
      </div>

    </div>

    <!-- Modal auth requis -->
    <transition name="modal">
      <div v-if="showAuthModal" class="fixed inset-0 z-[1000] flex items-center justify-center p-4" @click.self="showAuthModal = false">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div class="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-8 z-10 text-center">
          <div class="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-lock text-2xl text-indigo-600 dark:text-indigo-400"></i>
          </div>
          <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">Connexion requise</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Vous devez être connecté pour passer un quiz et enregistrer votre score.
          </p>
          <div class="flex gap-3">
            <button @click="showAuthModal = false" class="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Annuler
            </button>
            <RouterLink to="/auth" class="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold text-center transition-colors shadow-lg shadow-indigo-500/30">
              Se connecter
            </RouterLink>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.modal-enter-active, .modal-leave-active { transition: all 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
