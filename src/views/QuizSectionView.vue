<script setup>
import quiz from '@/quizzes.json';
import { RouterLink } from 'vue-router';

</script>

<template>
  <div class="container mx-auto py-10 px-4">
    <h1 class="text-3xl font-bold mb-8 text-blue-600 text-center">Tous les Quiz disponibles</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="quiz in quiz.quizzes" :key="quiz.id" class="bg-white dark:bg-[#2c3140] rounded-xl shadow-lg p-6 flex flex-col justify-between">
        <div>
          <h2 class="text-xl font-bold text-blue-500 mb-2">{{ quiz.title }}</h2>
          <p class="text-gray-700 dark:text-gray-300 mb-4">Score minimum : {{ quiz.minimum_score }}</p>
        </div>
        <RouterLink :to="`/quiz/${quiz.id}`" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-700 transition">Commencer le quiz</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
