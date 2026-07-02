<script setup>
import { useQuizStore } from '@/quizStore'
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const courseId = Number(route.params.id)
const quizStore = useQuizStore()
const quiz = quizStore.getQuizByCourseId(courseId)
const currentQuestion = computed(() => quiz?.questions[quizStore.currentQuestionIndex] || null)
const userAnswer = ref(null)

const progress = computed(() => {
  if (!quiz) return 0
  return Math.round((quizStore.currentQuestionIndex / quiz.questions.length) * 100)
})

function submitAnswer() {
  quizStore.answerQuestion(userAnswer.value)
  userAnswer.value = null
  if (quizStore.currentQuestionIndex >= quiz.questions.length) {
    quizStore.completeQuiz()
  }
}

function getScore() {
  return quiz.questions.reduce((score, q, i) =>
    score + (quizStore.userAnswers[i] === q.correct_answer ? 1 : 0), 0)
}

const passed = computed(() => getScore() >= quiz?.minimum_score)
const scorePercent = computed(() => quiz ? Math.round((getScore() / quiz.questions.length) * 100) : 0)

function restartQuiz() {
  quizStore.startQuiz(courseId)
  userAnswer.value = null
}

onMounted(() => {
  quizStore.startQuiz(courseId)
  userAnswer.value = null
})

watch(() => route.params.id, (newId) => {
  quizStore.startQuiz(Number(newId))
  userAnswer.value = null
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 px-4">

    <!-- Quiz non disponible -->
    <div v-if="!quiz" class="max-w-md mx-auto text-center py-20">
      <div class="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <i class="fas fa-exclamation-circle text-2xl text-slate-400"></i>
      </div>
      <h2 class="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">Quiz non disponible</h2>
      <p class="text-slate-400 mb-6">Aucun quiz n'est associé à ce cours.</p>
      <button @click="router.back()" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-colors">
        Retour
      </button>
    </div>

    <div v-else class="max-w-2xl mx-auto">

      <!-- Header quiz -->
      <div class="mb-6">
        <button @click="router.back()" class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-4">
          <i class="fas fa-arrow-left"></i> Retour
        </button>
        <h1 class="text-xl font-bold text-slate-900 dark:text-white">{{ quiz.title }}</h1>
      </div>

      <!-- En cours -->
      <div v-if="!quizStore.quizCompleted">

        <!-- Barre de progression -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 mb-4">
          <div class="flex items-center justify-between text-sm mb-2">
            <span class="text-slate-500 dark:text-slate-400 font-medium">
              Question {{ quizStore.currentQuestionIndex + 1 }} / {{ quiz.questions.length }}
            </span>
            <span class="text-indigo-600 dark:text-indigo-400 font-semibold">{{ progress }}%</span>
          </div>
          <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
            <div
              class="bg-gradient-to-r from-indigo-500 to-violet-600 h-2 rounded-full transition-all duration-500"
              :style="{ width: progress + '%' }"
            ></div>
          </div>
        </div>

        <!-- Question -->
        <div v-if="currentQuestion" class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 mb-4">
          <div class="flex items-start gap-3 mb-6">
            <div class="w-8 h-8 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400">{{ quizStore.currentQuestionIndex + 1 }}</span>
            </div>
            <h2 class="text-base font-semibold text-slate-900 dark:text-white leading-relaxed">
              {{ currentQuestion.question }}
            </h2>
          </div>

          <!-- Choix -->
          <div class="space-y-3">
            <label
              v-for="(choice, idx) in currentQuestion.choices"
              :key="idx"
              :class="[
                'flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200',
                userAnswer === choice
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-500'
                  : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              ]"
            >
              <input type="radio" v-model="userAnswer" :value="choice" class="hidden" />
              <div :class="[
                'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
                userAnswer === choice ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300 dark:border-slate-600'
              ]">
                <div v-if="userAnswer === choice" class="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span :class="[
                'text-sm font-medium',
                userAnswer === choice ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-200'
              ]">{{ choice }}</span>
            </label>
          </div>
        </div>

        <!-- Bouton suivant -->
        <button
          @click="submitAnswer"
          :disabled="userAnswer === null"
          :class="[
            'w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-200',
            userAnswer !== null
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
          ]"
        >
          {{ quizStore.currentQuestionIndex + 1 < quiz.questions.length ? 'Question suivante' : 'Terminer le quiz' }}
          <i class="fas fa-arrow-right ml-2"></i>
        </button>
      </div>

      <!-- Résultats -->
      <div v-else class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-8 text-center">

        <!-- Icône résultat -->
        <div :class="[
          'w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5',
          passed ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-red-50 dark:bg-red-900/20'
        ]">
          <i :class="[
            'text-4xl',
            passed ? 'fas fa-trophy text-amber-500' : 'fas fa-redo text-red-500'
          ]"></i>
        </div>

        <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">
          {{ passed ? 'Félicitations !' : 'Presque !' }}
        </h2>

        <!-- Score circulaire -->
        <div class="my-6">
          <div :class="[
            'text-5xl font-extrabold mb-1',
            passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'
          ]">
            {{ getScore() }}<span class="text-2xl text-slate-400">/{{ quiz.questions.length }}</span>
          </div>
          <div class="w-48 bg-slate-100 dark:bg-slate-700 rounded-full h-3 mx-auto mb-2">
            <div
              :class="passed ? 'bg-emerald-500' : 'bg-red-500'"
              class="h-3 rounded-full transition-all duration-700"
              :style="{ width: scorePercent + '%' }"
            ></div>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400">Score minimum requis : {{ quiz.minimum_score }}/{{ quiz.questions.length }}</p>
        </div>

        <p :class="[
          'text-sm font-medium mb-8 px-4 py-3 rounded-xl',
          passed
            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
        ]">
          {{ passed ? quiz.success_message : quiz.failure_message }}
        </p>

        <div class="flex gap-3">
          <button
            @click="restartQuiz"
            class="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <i class="fas fa-redo mr-2"></i>Recommencer
          </button>
          <router-link
            :to="`/lessons/${courseId}`"
            class="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold text-center transition-colors shadow-lg shadow-indigo-500/30"
          >
            <i class="fas fa-book-open mr-2"></i>Retour au cours
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
