<script setup>
import { ref, computed } from 'vue';
import coursesData from '@/newCourses.json';

const props = defineProps({
  courseId: {
    type: [String, Number],
    required: true
  }
});

const emit = defineEmits(['close-modal']);

const course = computed(() => {
  return coursesData.courses.find(c => c.id == props.courseId);
});
</script>

<template>
  <div v-if="course" class="container mx-auto p-4">
    <div class="bg-white shadow-lg rounded-lg overflow-hidden">
      <img :src="course.thumbnail" :alt="course.title" class="w-full object-cover">
      <div class="p-6">
        <h1 class="text-4xl font-bold mb-2">{{ course.title }}</h1>
        <span class="inline-block bg-redColor text-white text-sm font-semibold px-3 py-1 rounded-full mb-4">
          {{ course.category }}
        </span>
        <p class="text-gray-700 mb-4 text-lg">{{ course.description }}</p>

        <div class="flex items-center mb-4">
          <span class="text-yellow-500 mr-1">★</span>
          <span class="text-lg font-semibold">{{ course.rating }}</span>
          <span class="text-gray-600 ml-2">({{ course.enrolledStudents }} étudiants)</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p><span class="font-semibold">Instructeur:</span> {{ course.instructor }}</p>
            <p><span class="font-semibold">Niveau:</span> {{ course.level }}</p>
            <p><span class="font-semibold">Langue:</span> {{ course.language }}</p>
            <p><span class="font-semibold">Durée:</span> {{ course.duration }}</p>
            <p><span class="font-semibold">Temps estimé:</span> {{ course.estimatedTime }}</p>
            <p><span class="font-semibold">Certificat:</span> {{ course.certificate ? 'Oui' : 'Non' }}</p>
          </div>
          <div>
            <!-- <div class="flex items-baseline">
                <p class="text-4xl font-bold text-green-700">{{ course.price === 0 ? 'Gratuit' : course.price + ' €' }}</p>
                <p v-if="course.price !== 0 && course.originalPrice" class="ml-2 text-gray-500 line-through">{{ course.originalPrice }} €</p>
            </div> -->
            <p class="text-sm text-gray-500">Créé le: {{ course.createdDate }}</p>
            <p class="text-sm text-gray-500">Mis à jour le: {{ course.updatedDate }}</p>
          </div>
        </div>

        <div class="mb-6">
          <h2 class="text-2xl font-semibold mb-2">Prérequis</h2>
          <ul class="list-disc list-inside">
            <li v-for="(req, index) in course.prerequisites" :key="index">{{ req }}</li>
          </ul>
        </div>

        <div class="mb-6">
          <h2 class="text-2xl font-semibold mb-2">Ce que vous apprendrez</h2>
          <ul class="list-disc list-inside grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <li v-for="lesson in course.lessons" :key="lesson.id">{{ lesson.title }}</li>
          </ul>
        </div>

        <div class="mb-6">
          <h2 class="text-2xl font-semibold mb-2">Tags</h2>
          <div class="flex flex-wrap gap-2">
            <span v-for="(tag, index) in course.tags" :key="index"
              class="bg-gray-200 text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">#{{ tag }}</span>
          </div>
        </div>

        <div class="mt-8">
          <router-link :to="`/lessons/${course.id}`" @click="emit('close-modal')"
            class="bg-blueColor text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 text-lg transition-colors">
            Commencer la formation
          </router-link>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center p-10">
    <p class="text-xl">Cours non trouvé.</p>
  </div>
</template>

<style scoped>
/* Styles additionnels pour améliorer la présentation */
.container {
  max-width: 1200px;
}
</style>
