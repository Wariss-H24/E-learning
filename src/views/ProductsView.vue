<script setup>
import { ref } from 'vue';
import CoursesComponent from '@/components/CoursesComponents/CoursesComponent.vue';
import ProductDetailView from '@/views/ProductDetailView.vue';

const isModalOpen = ref(false);
const selectedCourseId = ref(null);

function showDetails(courseId) {
  selectedCourseId.value = courseId;
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  selectedCourseId.value = null;
}

</script>


<template>
  <div class="relative">
    <CoursesComponent @show-details="showDetails" />

    <!-- Modal -->
    <div v-if="isModalOpen" class=" fixed inset-0 bg-[rgba(0,0,0,0.55)] z-[1000000] flex justify-center items-center">
      <div class="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[70vh] overflow-y-auto relative p-[40px]">
        <!-- Boutton pour fermer le modaal -->
        <button @click="closeModal" class="absolute top- right-1 z-50 h-[40px] w-[40px] rounded-full flex justify-center items-center bg-red-500 text-white shadow-md transition-colors hover:bg-black  hover:text-red-500">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        
        <ProductDetailView v-if="selectedCourseId" :course-id="selectedCourseId" @close-modal="closeModal" />
      </div>
    </div>
  </div>

</template>


<style scoped>


</style>