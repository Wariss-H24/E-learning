<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store'
import coursesData from '@/newCourses.json'

const props = defineProps({
  courseId: { type: [String, Number], required: true }
})
const emit = defineEmits(['close-modal'])

const auth = useAuthStore()
const router = useRouter()
const course = computed(() => coursesData.courses.find(c => c.id == props.courseId))

function startCourse() {
  emit('close-modal')
  if (auth.isAuthenticated) {
    router.push(`/lessons/${course.value.id}`)
  } else {
    router.push({ name: 'auth' })
  }
}
</script>

<template>
  <div v-if="course">
    <!-- Hero image -->
    <div class="relative -mx-10 -mt-10 mb-6 h-52 overflow-hidden rounded-t-lg">
      <img :src="course.thumbnail" :alt="course.title" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
      <div class="absolute bottom-4 left-6 right-6">
        <span class="inline-block bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-2">
          {{ course.category }}
        </span>
        <h1 class="text-2xl font-bold text-white leading-tight">{{ course.title }}</h1>
      </div>
    </div>

    <!-- Rating & stats bar -->
    <div class="flex flex-wrap items-center gap-4 mb-5 pb-5 border-b border-slate-100 dark:border-slate-700">
      <div class="flex items-center gap-1.5">
        <div class="flex">
          <i v-for="n in 5" :key="n" class="fas fa-star text-xs" :class="n <= Math.round(course.rating || 4) ? 'text-amber-400' : 'text-slate-200'"></i>
        </div>
        <span class="text-sm font-bold text-amber-600">{{ course.rating }}</span>
        <span class="text-sm text-slate-400">({{ course.enrolledStudents }} étudiants)</span>
      </div>
      <span class="text-sm text-slate-500 dark:text-slate-400"><i class="fas fa-clock mr-1 text-indigo-400"></i>{{ course.duration }}</span>
      <span class="text-sm text-slate-500 dark:text-slate-400"><i class="fas fa-language mr-1 text-indigo-400"></i>{{ course.language }}</span>
      <span v-if="course.certificate" class="flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
        <i class="fas fa-certificate"></i> Certificat inclus
      </span>
    </div>

    <!-- Description -->
    <p class="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">{{ course.description }}</p>

    <!-- Info grid -->
    <div class="grid grid-cols-2 gap-3 mb-6">
      <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
        <p class="text-xs text-slate-400 mb-0.5">Instructeur</p>
        <p class="text-sm font-semibold text-slate-800 dark:text-white">{{ course.instructor }}</p>
      </div>
      <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
        <p class="text-xs text-slate-400 mb-0.5">Niveau</p>
        <p class="text-sm font-semibold text-slate-800 dark:text-white">{{ course.level }}</p>
      </div>
      <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
        <p class="text-xs text-slate-400 mb-0.5">Temps estimé</p>
        <p class="text-sm font-semibold text-slate-800 dark:text-white">{{ course.estimatedTime }}</p>
      </div>
      <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
        <p class="text-xs text-slate-400 mb-0.5">Mis à jour</p>
        <p class="text-sm font-semibold text-slate-800 dark:text-white">{{ course.updatedDate }}</p>
      </div>
    </div>

    <!-- Prérequis -->
    <div class="mb-5" v-if="course.prerequisites?.length">
      <h2 class="text-base font-bold text-slate-900 dark:text-white mb-2">Prérequis</h2>
      <ul class="space-y-1.5">
        <li v-for="(req, i) in course.prerequisites" :key="i" class="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
          <i class="fas fa-check-circle text-indigo-500 mt-0.5 flex-shrink-0"></i>{{ req }}
        </li>
      </ul>
    </div>

    <!-- Ce que vous apprendrez -->
    <div class="mb-5">
      <h2 class="text-base font-bold text-slate-900 dark:text-white mb-2">Ce que vous apprendrez</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        <div v-for="lesson in course.lessons" :key="lesson.id" class="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
          <i class="fas fa-play-circle text-indigo-500 mt-0.5 flex-shrink-0 text-xs"></i>{{ lesson.title }}
        </div>
      </div>
    </div>

    <!-- Tags -->
    <div class="flex flex-wrap gap-2 mb-6">
      <span v-for="(tag, i) in course.tags" :key="i" class="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-medium px-2.5 py-1 rounded-full">
        #{{ tag }}
      </span>
    </div>

    <!-- CTA -->
    <div class="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
      <button @click="emit('close-modal')" class="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
        Fermer
      </button>
      <button @click="startCourse()" class="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold text-center transition-colors shadow-lg shadow-indigo-500/30">
        <i class="fas fa-play mr-2"></i>{{ auth.isAuthenticated ? 'Commencer la formation' : 'Se connecter pour commencer' }}
      </button>
    </div>
  </div>

  <div v-else class="flex flex-col items-center justify-center py-16">
    <i class="fas fa-exclamation-circle text-4xl text-slate-300 mb-3"></i>
    <p class="text-slate-500">Cours non trouvé.</p>
  </div>
</template>
