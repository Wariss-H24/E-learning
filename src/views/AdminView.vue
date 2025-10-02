<script setup>
import GestionCoursComponent from '@/components/GestionCoursComponent.vue';
import { useAlertesStore, useAuthStore } from '@/store';
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

const { courses } = useAlertesStore()
const auth = useAuthStore()
const utilisateur = computed(() => auth.user)
const isAdmin = computed(() => utilisateur.value?.username === 'moodolion')

</script>

<template>
  <div v-if="isAdmin">
    <div class="bg-adminBg dark:bg-neutral-600 pb-[50px] pt-4 px-4 transition-colors duration-300">
      <h1 class="font-archivo text-[30px] font-extrabold py-[2] dark:text-blue-100">
        Bienvenue, Administrateur!
      </h1>
      <p class="w-[1056px] font-inter text-[16px] leading-[24px] font-normal text-para2Color dark:text-gray-300 ">
        Utilisez cette interface pour gérer le catalogue de cours d'EduMaster. Vous pouvez ajouter, <br />modifier
        ou supprimer des cours en toute simplicité.
      </p>
      <div class="mt-6">
        <RouterLink to="/admin-quiz-manager" class="btn btn-primary">Gérer les quiz</RouterLink>
      </div>
    </div>
    <div>
      <GestionCoursComponent :tabCourses="courses" />
    </div>
  </div>
  <div v-else class="text-center text-red-500 font-bold mt-10">
    Accès réservé à l'administrateur.
  </div>
</template>
<style>
@keyframes fadeIn {
    0% {
        opacity: 0;
        transform: translateY(20px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fadeIn {
    animation: fadeIn 0.8s ease-out forwards;
}
</style>