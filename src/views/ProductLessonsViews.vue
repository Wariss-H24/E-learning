<script setup>
import { useQuizStore } from '@/quizStore.js';
import { useRoute } from 'vue-router';
import { ref, computed, watch, onMounted } from 'vue';
import coursesData from '@/newCourses.json';
import CourseComments from '@/components/CourseComments.vue';

const route = useRoute();
const courseId = ref(route.params.id);
const quizStore = useQuizStore()

const courseData = coursesData.courses.find(c => c.id == courseId.value);
// On utilise ref() pour créer une copie réactive et modifiable du cours.
const course = ref(courseData ? JSON.parse(JSON.stringify(courseData)) : null);

const currentLessonIndex = ref(0);
const openedLessonId = ref(null);

const currentLesson = computed(() => {
  if (course.value && course.value.lessons) {
    return course.value.lessons[currentLessonIndex.value];
  }
  return null;
});

const progress = computed(() => {
  if (!course.value) return 0;
  const completedLessons = course.value.lessons.filter(l => l.completed).length;
  return Math.round((completedLessons / course.value.lessons.length) * 100);
});

const badgeEarned = ref(false);
const showBadgeNotification = ref(false);

function updateCourseHistory(currentProgress) {
  if (!course.value) return;

  const history = JSON.parse(localStorage.getItem('courseHistory') || '{}');
  const today = new Date().toISOString().split('T')[0];
  const status = currentProgress === 100 ? 'Terminé' : 'En cours';

  history[course.value.id] = {
    id: course.value.id,
    titre: course.value.title,
    formateur: course.value.instructor,
    progression: currentProgress,
    date: today,
    statut: status,
    lessons: course.value.lessons, // Sauvegarde l'état des leçons
  };

  localStorage.setItem('courseHistory', JSON.stringify(history));
}

// Vérifie si le badge a déjà été gagné au chargement du composant
onMounted(() => {
  const earnedBadges = JSON.parse(localStorage.getItem('earnedBadges') || '{}');
  if (earnedBadges[courseId.value]) {
    badgeEarned.value = true;
  }

  const history = JSON.parse(localStorage.getItem('courseHistory') || '{}');
  if (history[courseId.value] && course.value) {
    const savedLessons = history[courseId.value].lessons;
    if (savedLessons) {
      course.value.lessons.forEach((lesson) => {
        const savedLesson = savedLessons.find(l => l.id === lesson.id);
        if (savedLesson) {
          lesson.completed = savedLesson.completed;
        }
      });
    }
  }

  updateCourseHistory(progress.value);
});

// Surveille la progression pour attribuer le badge
watch(progress, (newProgress) => {
  if (newProgress === 100 && !badgeEarned.value) {
    badgeEarned.value = true;
    showBadgeNotification.value = true;
    const earnedBadges = JSON.parse(localStorage.getItem('earnedBadges') || '{}');
    earnedBadges[courseId.value] = true;
    localStorage.setItem('earnedBadges', JSON.stringify(earnedBadges));
    setTimeout(() => { showBadgeNotification.value = false; }, 5000); // Cache la notif après 5s
  }
  updateCourseHistory(newProgress);
});

function nextLesson() {
  // Marque la leçon actuelle comme terminée
  //   if (course.value && course.value.lessons[currentLessonIndex.value]) {
  //     course.value.lessons[currentLessonIndex.value].completed = true;
  //   }
  if (currentLessonIndex.value < course.value.lessons.length - 1) {
    currentLessonIndex.value++;
  }
}

function previousLesson() {
  if (currentLessonIndex.value > 0) {
    currentLessonIndex.value--;
  }
}

function toggleLesson(lessonId) {
  openedLessonId.value = openedLessonId.value === lessonId ? null : lessonId;
}

function selectLesson(index) {
  currentLessonIndex.value = index;
  openedLessonId.value = course.value.lessons[index].id;
}
</script>

<template>
  <div v-if="course" class="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-[#23272f] transition-colors duration-300">
    <!-- Notification de badge -->
    <Transition name="slide-fade">
      <div v-if="showBadgeNotification"
        class="fixed top-20 right-5 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 flex items-center">
        <svg class="w-8 h-8 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.33 14.414l-3.535-3.536 1.414-1.414L10.67 13.586l5.657-5.657 1.414 1.414-7.07 7.071z">
          </path>
        </svg>
        <div>
          <p class="font-bold">Félicitations !</p>
          <p>Vous avez obtenu le badge de réussite pour ce cours !</p>
        </div>
      </div>
    </Transition>
    <div class="max-w-4xl mx-auto">


      <div class="mb-6">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-blue-100">{{ course.title }}</h1>
        <div class="mt-2">
          <div class="flex justify-between items-center">
            <span class="text-sm font-medium text-gray-600 dark:text-gray-300">{{ progress }}% Terminé</span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-[#2c3140] rounded-full h-2.5 mt-1">
            <div class="bg-blue-600 dark:bg-blue-700 h-2.5 rounded-full" :style="{ width: progress + '%' }"></div>
          </div>
        </div>
      </div>


      <div class="bg-white dark:bg-[#2c3140] shadow-lg rounded-lg overflow-hidden mb-6 transition-colors duration-300">
        <div class="p-4 border-b border-gray-200 dark:border-[#3a4152]">
          <h2 class="text-lg font-semibold text-gray-700 dark:text-blue-100">Vidéo de la Leçon: {{ currentLesson.title }}</h2>
        </div>
        <div class="aspect-w-16 aspect-h-9 bg-black dark:bg-[#23272f]">
          <iframe v-if="currentLesson" :src="currentLesson.videoUrl" frameborder="0"
            allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen class="w-full h-full"></iframe>
        </div>
      </div>

      <div class="flex justify-between items-center mb-8">
        <button @click="previousLesson" :disabled="currentLessonIndex === 0"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-blue-100 bg-white dark:bg-[#23272f] rounded-md border border-gray-300 dark:border-[#3a4152] hover:bg-gray-100 dark:hover:bg-[#2c3140] disabled:opacity-50 disabled:cursor-not-allowed">Précédent</button>
        <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Leçon {{ currentLessonIndex + 1 }} sur {{ course.lessons.length }}</span>
        <button @click="nextLesson" :disabled="currentLessonIndex === course.lessons.length - 1"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-blue-100 bg-white dark:bg-[#23272f] rounded-md border border-gray-300 dark:border-[#3a4152] hover:bg-gray-100 dark:hover:bg-[#2c3140] disabled:opacity-50 disabled:cursor-not-allowed">Suivant
        </button>
      </div>

      <!-- Lessons List -->
      <div class="bg-white dark:bg-[#2c3140] shadow-md rounded-lg transition-colors duration-300">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-blue-100 p-4 border-b border-gray-200 dark:border-[#3a4152]">Liste des leçons</h3>
        <ul>
          <li v-for="(lesson, index) in course.lessons" :key="lesson.id"
            class="border-b hover:bg-red-50 dark:hover:bg-[#23272f] transition-colors duration-500 cursor-pointer border-gray-200 dark:border-[#3a4152] last:border-b-0 last:pb-4 ">
            <div @click="selectLesson(index)"
              class="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#23272f]"
              :class="{ 'bg-gray-100 dark:bg-[#23272f]': currentLessonIndex === index }">
              <div class="flex items-center">
                <span class="text-blue-600 dark:text-blue-300 font-semibold mr-3">{{ index + 1 }}.</span>
                <span class="font-medium text-gray-800 dark:text-blue-100">{{ lesson.title }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-sm text-gray-500 dark:text-gray-400 mr-4">{{ lesson.duration }}</span>
                <button @click.stop="toggleLesson(lesson.id)" class="focus:outline-none">
                  <svg class="w-5 h-5 text-gray-500 dark:text-blue-100 transform transition-transform"
                    :class="{ 'rotate-180': openedLessonId === lesson.id }" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div v-if="openedLessonId === lesson.id" class="p-4 bg-gray-50 dark:bg-[#23272f] border-t border-gray-200 dark:border-[#3a4152]">
              <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">{{ lesson.description }}</p>
              <div class="flex items-center">
                <input type="checkbox" :id="'lesson-' + lesson.id" v-model="lesson.completed"
                  class="h-4 w-4 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-[#3a4152] rounded focus:ring-blue-500 dark:focus:ring-blue-700">
                <label :for="'lesson-' + lesson.id" class="ml-2 block text-sm text-gray-900 dark:text-blue-100">Marquer comme
                  terminé</label>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div v-if="progress === 100 && quizStore.getQuizByCourseId(course.id)"  class="my-5">
        <RouterLink :to="`/quiz/${course.id}`" class="border p-2 rounded-lg font-semibold text-white bg-green-600 hover:bg-blue-600 transition-all duration-300">
          Commencer le quiz
        </RouterLink>
      </div>

      <!-- Comments Section -->
      <CourseComments :comments="course.comments || []" :course-id="course.id"
        @update:comments="newComments => course.comments = newComments" />

    </div>
  </div>
  <div v-else class="text-center p-10 bg-white dark:bg-[#23272f] rounded-lg shadow-md">
    <p class="text-xl text-gray-800 dark:text-blue-100">Veuillez choisir le cours que vous souhaitez suivre s'il vous plaît !</p>
  </div>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.aspect-w-16 {
  position: relative;
  padding-bottom: 56.25%;
}

.aspect-w-16>iframe {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
</style>
