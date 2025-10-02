<script setup>
import { ref, computed } from 'vue';
import { useQuizStore } from '@/quizStore.js';
import { RouterLink } from 'vue-router';

const quizStore = useQuizStore();
const quizzes = computed(() => quizStore.quizzes);
const isEditing = ref(null);
const newQuiz = ref({ title: '', minimum_score: 1, questions: [] });
const showAddModal = ref(false);

function addQuiz() {
  quizStore.quizzes.push({
    id: Date.now(),
    title: newQuiz.value.title,
    minimum_score: newQuiz.value.minimum_score,
    questions: [],
    success_message: 'Quiz ajouté !',
    failure_message: 'Essayez encore !',
  });
  showAddModal.value = false;
  newQuiz.value = { title: '', minimum_score: 1, questions: [] };
}

function deleteQuiz(id) {
  quizStore.quizzes = quizStore.quizzes.filter(q => q.id !== id);
}

function startEdit(quiz) {
  isEditing.value = quiz.id;
  newQuiz.value = { ...quiz };
}

function saveEdit() {
  const idx = quizStore.quizzes.findIndex(q => q.id === isEditing.value);
  if (idx !== -1) quizStore.quizzes[idx] = { ...newQuiz.value };
  isEditing.value = null;
  newQuiz.value = { title: '', minimum_score: 1, questions: [] };
}

function cancelEdit() {
  isEditing.value = null;
  newQuiz.value = { title: '', minimum_score: 1, questions: [] };
}
</script>

<template>
  <div class="container mx-auto py-10 px-4">
    <h1 class="text-3xl font-bold mb-8 text-primary text-center">Gestion des Quiz</h1>
    <div class="stats shadow mb-8 flex justify-center">
      <div class="stat">
        <div class="stat-title">Nombre de quiz</div>
        <div class="stat-value text-primary">{{ quizzes.length }}</div>
      </div>
    </div>
    <div class="flex justify-end mb-6">
      <button class="btn btn-success" @click="showAddModal = true">Ajouter un quiz</button>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="quiz in quizzes" :key="quiz.id" class="card bg-base-100 shadow-xl flex flex-col justify-between">
        <div class="card-body">
          <h2 class="card-title text-primary">{{ quiz.title }}</h2>
          <p class="text-base-content mb-2">Score minimum : {{ quiz.minimum_score }}</p>
          <div class="flex gap-2 mt-2">
            <button class="btn btn-info btn-sm" @click="startEdit(quiz)">Modifier</button>
            <button class="btn btn-error btn-sm" @click="deleteQuiz(quiz.id)">Supprimer</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal ajout/modification -->
    <dialog :open="showAddModal || isEditing" class="modal">
      <form method="dialog" class="modal-box">
        <h3 class="font-bold text-lg mb-4">{{ isEditing ? 'Modifier le quiz' : 'Ajouter un quiz' }}</h3>
        <div class="form-control mb-4">
          <label class="label">Titre du quiz</label>
          <input v-model="newQuiz.title" type="text" class="input input-bordered" required />
        </div>
        <div class="form-control mb-4">
          <label class="label">Score minimum</label>
          <input v-model.number="newQuiz.minimum_score" type="number" min="1" class="input input-bordered" required />
        </div>
        <div class="modal-action">
          <button type="button" class="btn btn-primary" @click.prevent="isEditing ? saveEdit() : addQuiz()">{{ isEditing ? 'Enregistrer' : 'Ajouter' }}</button>
          <button type="button" class="btn" @click.prevent="isEditing ? cancelEdit() : showAddModal = false">Annuler</button>
        </div>
      </form>
    </dialog>
  </div>
</template>

<style scoped>
</style>
