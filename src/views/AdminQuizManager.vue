<script setup>
import { ref, computed } from 'vue'
import { useQuizStore } from '@/quizStore.js'

const quizStore = useQuizStore()
const quizzes = computed(() => quizStore.quizzes)

const search = ref('')
const showModal = ref(false)
const isEditing = ref(false)
const showDeleteConfirm = ref(false)
const deleteTargetId = ref(null)
const activeQuizId = ref(null)

const emptyQuiz = () => ({
  id: null, title: '', minimum_score: 1,
  success_message: 'Félicitations ! Vous avez réussi !',
  failure_message: 'Continuez à pratiquer !',
  questions: []
})

const form = ref(emptyQuiz())

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return quizStore.quizzes.filter(qz => qz.title?.toLowerCase().includes(q))
})

const activeQuiz = computed(() => quizStore.quizzes.find(q => q.id === activeQuizId.value))

function openAdd() {
  isEditing.value = false
  form.value = emptyQuiz()
  showModal.value = true
}

function openEdit(quiz) {
  isEditing.value = true
  form.value = JSON.parse(JSON.stringify(quiz))
  showModal.value = true
}

function closeModal() { showModal.value = false }

function handleSubmit() {
  if (isEditing.value) {
    const idx = quizStore.quizzes.findIndex(q => q.id === form.value.id)
    if (idx !== -1) quizStore.quizzes[idx] = { ...form.value }
  } else {
    quizStore.quizzes.push({ ...form.value, id: Date.now() })
  }
  closeModal()
}

function askDelete(id) {
  deleteTargetId.value = id
  showDeleteConfirm.value = true
}

function confirmDelete() {
  quizStore.quizzes = quizStore.quizzes.filter(q => q.id !== deleteTargetId.value)
  if (activeQuizId.value === deleteTargetId.value) activeQuizId.value = null
  showDeleteConfirm.value = false
}

// Gestion questions
function addQuestion() {
  form.value.questions.push({ question: '', choices: ['', '', '', ''], correct_answer: '' })
}

function removeQuestion(idx) {
  form.value.questions.splice(idx, 1)
}

function difficultyLabel(q) {
  const n = q.questions?.length || 0
  if (n <= 5) return { label: 'Facile', cls: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' }
  if (n <= 8) return { label: 'Moyen', cls: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' }
  return { label: 'Difficile', cls: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' }
}
</script>

<template>
  <div class="bg-slate-50 dark:bg-slate-900 min-h-screen">

    <!-- Hero -->
    <div class="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 pt-10 pb-24 px-4 relative overflow-hidden">
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full"></div>
        <div class="absolute -bottom-10 -left-10 w-64 h-64 bg-white/5 rounded-full"></div>
      </div>
      <div class="max-w-6xl mx-auto relative z-10">
        <div class="flex items-center gap-2 mb-3">
          <RouterLink to="/admin" class="flex items-center gap-1.5 text-indigo-200 hover:text-white text-sm transition-colors">
            <i class="fas fa-arrow-left text-xs"></i> Retour admin
          </RouterLink>
        </div>
        <h1 class="text-3xl font-extrabold text-white mb-1">Gestionnaire de Quiz</h1>
        <p class="text-indigo-200 text-sm">Créez et gérez les quiz de la plateforme</p>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 -mt-14 relative z-10 pb-16 space-y-6">

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-4">
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 shadow-lg text-center">
          <div class="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center mx-auto mb-2">
            <i class="fas fa-question-circle text-indigo-600 dark:text-indigo-400"></i>
          </div>
          <p class="text-2xl font-extrabold text-slate-900 dark:text-white">{{ quizzes.length }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Quiz total</p>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 shadow-lg text-center">
          <div class="w-10 h-10 bg-violet-50 dark:bg-violet-900/20 rounded-xl flex items-center justify-center mx-auto mb-2">
            <i class="fas fa-list-ol text-violet-600 dark:text-violet-400"></i>
          </div>
          <p class="text-2xl font-extrabold text-slate-900 dark:text-white">
            {{ quizzes.reduce((acc, q) => acc + (q.questions?.length || 0), 0) }}
          </p>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Questions au total</p>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 shadow-lg text-center">
          <div class="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center mx-auto mb-2">
            <i class="fas fa-star text-emerald-600 dark:text-emerald-400"></i>
          </div>
          <p class="text-2xl font-extrabold text-slate-900 dark:text-white">
            {{ quizzes.length ? Math.round(quizzes.reduce((a, q) => a + q.minimum_score, 0) / quizzes.length) : 0 }}
          </p>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Score min. moyen</p>
        </div>
      </div>

      <!-- Liste quiz -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-lg overflow-hidden">
        <!-- Toolbar -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 border-b border-slate-100 dark:border-slate-700">
          <div class="relative w-full sm:w-72">
            <i class="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input v-model="search" type="text" placeholder="Rechercher un quiz..."
              class="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
          </div>
          <button @click="openAdd"
            class="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-500/30 flex-shrink-0">
            <i class="fas fa-plus"></i> Nouveau quiz
          </button>
        </div>

        <!-- Grid quiz -->
        <div class="p-5">
          <div v-if="filtered.length === 0" class="text-center py-12 text-slate-400 dark:text-slate-500">
            <i class="fas fa-question-circle text-3xl mb-3 block"></i>
            <p class="text-sm">Aucun quiz trouvé</p>
          </div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="quiz in filtered" :key="quiz.id"
              class="group bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-600 p-4 hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-md transition-all cursor-pointer"
              :class="activeQuizId === quiz.id ? 'border-indigo-400 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10' : ''"
              @click="activeQuizId = activeQuizId === quiz.id ? null : quiz.id"
            >
              <div class="flex items-start justify-between mb-3">
                <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-500/20">
                  <i class="fas fa-question text-white text-sm"></i>
                </div>
                <div class="flex gap-1.5">
                  <button @click.stop="openEdit(quiz)" class="w-7 h-7 flex items-center justify-center rounded-lg bg-white dark:bg-slate-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-500 transition-colors shadow-sm">
                    <i class="fas fa-pen text-xs"></i>
                  </button>
                  <button @click.stop="askDelete(quiz.id)" class="w-7 h-7 flex items-center justify-center rounded-lg bg-white dark:bg-slate-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 hover:text-red-600 dark:hover:text-red-400 border border-slate-200 dark:border-slate-500 transition-colors shadow-sm">
                    <i class="fas fa-trash-alt text-xs"></i>
                  </button>
                </div>
              </div>
              <h3 class="font-semibold text-slate-900 dark:text-white text-sm leading-tight mb-2 line-clamp-2">{{ quiz.title }}</h3>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="px-2 py-0.5 rounded-full text-xs font-semibold" :class="difficultyLabel(quiz).cls">
                  {{ difficultyLabel(quiz).label }}
                </span>
                <span class="text-xs text-slate-500 dark:text-slate-400">
                  <i class="fas fa-list-ol mr-1"></i>{{ quiz.questions?.length || 0 }} questions
                </span>
                <span class="text-xs text-slate-500 dark:text-slate-400">
                  <i class="fas fa-star mr-1 text-amber-400"></i>min. {{ quiz.minimum_score }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Détail quiz sélectionné -->
      <transition name="slide-down">
        <div v-if="activeQuiz" class="bg-white dark:bg-slate-800 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 shadow-lg overflow-hidden">
          <div class="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
            <div>
              <h2 class="font-bold text-slate-900 dark:text-white text-base">{{ activeQuiz.title }}</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{{ activeQuiz.questions?.length }} questions · Score minimum : {{ activeQuiz.minimum_score }}</p>
            </div>
            <button @click="activeQuizId = null" class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <i class="fas fa-times text-sm"></i>
            </button>
          </div>
          <div class="p-5 space-y-3 max-h-96 overflow-y-auto">
            <div v-for="(q, i) in activeQuiz.questions" :key="i"
              class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-100 dark:border-slate-600">
              <p class="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                <span class="text-indigo-500 mr-1.5">Q{{ i + 1 }}.</span>{{ q.question }}
              </p>
              <div class="grid grid-cols-2 gap-1.5">
                <div v-for="(choice, ci) in q.choices" :key="ci"
                  class="px-3 py-1.5 rounded-lg text-xs font-medium"
                  :class="choice === q.correct_answer
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-white dark:bg-slate-600 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-500'">
                  <i v-if="choice === q.correct_answer" class="fas fa-check mr-1.5 text-emerald-500"></i>
                  {{ choice }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- Modal ajout/édition -->
    <transition name="modal">
      <div v-if="showModal" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="closeModal"></div>
        <div class="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-100 dark:border-slate-700 max-h-[90vh] flex flex-col">

          <!-- Header modal -->
          <div class="flex items-center gap-3 p-6 border-b border-slate-100 dark:border-slate-700 flex-shrink-0">
            <div class="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
              <i :class="isEditing ? 'fas fa-pen' : 'fas fa-plus'" class="text-indigo-600 dark:text-indigo-400"></i>
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white">{{ isEditing ? 'Modifier le quiz' : 'Nouveau quiz' }}</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">{{ form.questions.length }} question(s) ajoutée(s)</p>
            </div>
            <button @click="closeModal" class="ml-auto w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <i class="fas fa-times text-sm"></i>
            </button>
          </div>

          <!-- Body modal scrollable -->
          <div class="overflow-y-auto flex-1 p-6 space-y-5">

            <!-- Infos générales -->
            <div class="grid grid-cols-2 gap-4">
              <div class="col-span-2">
                <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Titre du quiz</label>
                <input v-model="form.title" type="text" required placeholder="Ex: Quiz sur les bases du HTML"
                  class="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Score minimum</label>
                <input v-model.number="form.minimum_score" type="number" min="1" required
                  class="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Message succès</label>
                <input v-model="form.success_message" type="text" placeholder="Félicitations !"
                  class="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
              </div>
              <div class="col-span-2">
                <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Message échec</label>
                <input v-model="form.failure_message" type="text" placeholder="Continuez à pratiquer !"
                  class="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
              </div>
            </div>

            <!-- Questions -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Questions ({{ form.questions.length }})</label>
                <button type="button" @click="addQuestion"
                  class="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-lg border border-indigo-200 dark:border-indigo-800 transition-colors">
                  <i class="fas fa-plus"></i> Ajouter une question
                </button>
              </div>

              <div v-if="form.questions.length === 0" class="text-center py-8 bg-slate-50 dark:bg-slate-700/30 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-600">
                <i class="fas fa-question-circle text-2xl text-slate-300 dark:text-slate-600 mb-2 block"></i>
                <p class="text-sm text-slate-400 dark:text-slate-500">Aucune question — cliquez sur "Ajouter une question"</p>
              </div>

              <div class="space-y-4">
                <div v-for="(q, qi) in form.questions" :key="qi"
                  class="bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 p-4">
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2.5 py-1 rounded-full">Question {{ qi + 1 }}</span>
                    <button type="button" @click="removeQuestion(qi)" class="w-7 h-7 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      <i class="fas fa-times text-xs"></i>
                    </button>
                  </div>
                  <input v-model="q.question" type="text" placeholder="Énoncé de la question" required
                    class="w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all mb-3" />
                  <div class="grid grid-cols-2 gap-2 mb-3">
                    <div v-for="(_, ci) in q.choices" :key="ci" class="relative">
                      <input v-model="q.choices[ci]" type="text" :placeholder="`Choix ${ci + 1}`"
                        class="w-full bg-white dark:bg-slate-700 border rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white outline-none transition-all pr-8"
                        :class="q.choices[ci] && q.choices[ci] === q.correct_answer
                          ? 'border-emerald-400 dark:border-emerald-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                          : 'border-slate-200 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'" />
                      <button v-if="q.choices[ci]" type="button" @click="q.correct_answer = q.choices[ci]"
                        class="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full transition-colors"
                        :class="q.choices[ci] === q.correct_answer ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-600 text-slate-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-600'"
                        :title="q.choices[ci] === q.correct_answer ? 'Bonne réponse' : 'Définir comme bonne réponse'">
                        <i class="fas fa-check text-xs"></i>
                      </button>
                    </div>
                  </div>
                  <p v-if="q.correct_answer" class="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <i class="fas fa-check-circle"></i> Bonne réponse : <strong>{{ q.correct_answer }}</strong>
                  </p>
                  <p v-else class="text-xs text-amber-500 flex items-center gap-1.5">
                    <i class="fas fa-exclamation-circle"></i> Cliquez sur ✓ pour définir la bonne réponse
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer modal -->
          <div class="flex gap-3 p-6 border-t border-slate-100 dark:border-slate-700 flex-shrink-0">
            <button type="button" @click="closeModal"
              class="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-xl transition-colors">
              Annuler
            </button>
            <button type="button" @click="handleSubmit"
              class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-500/30">
              <i :class="isEditing ? 'fas fa-save' : 'fas fa-plus'"></i>
              {{ isEditing ? 'Enregistrer' : 'Créer le quiz' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal suppression -->
    <transition name="modal">
      <div v-if="showDeleteConfirm" class="fixed inset-0 z-[300] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showDeleteConfirm = false"></div>
        <div class="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-red-100 dark:border-red-900/30">
          <div class="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-trash-alt text-2xl text-red-500"></i>
          </div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white text-center mb-1">Supprimer ce quiz ?</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 text-center mb-5">Toutes les questions associées seront perdues.</p>
          <div class="flex gap-3">
            <button @click="showDeleteConfirm = false"
              class="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-xl transition-colors">
              Annuler
            </button>
            <button @click="confirmDelete"
              class="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-xl transition-colors">
              <i class="fas fa-trash-alt mr-1.5"></i>Supprimer
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

.slide-down-enter-active, .slide-down-leave-active { transition: all 0.25s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-10px); }

.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>
