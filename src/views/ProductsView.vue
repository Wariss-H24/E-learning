<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import CoursesComponent from '@/components/CoursesComponents/CoursesComponent.vue'
import ProductDetailView from '@/views/ProductDetailView.vue'

const route = useRoute()
const isModalOpen = ref(false)
const selectedCourseId = ref(null)
const showCategories = computed(() => route.path === '/cours')

function showDetails(courseId) {
  selectedCourseId.value = courseId
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  selectedCourseId.value = null
}
</script>

<template>
  <div class="relative flex-1 min-w-0">
    <CoursesComponent :show-categories="showCategories" @show-details="showDetails" />

    <!-- Modal overlay -->
    <transition name="modal">
      <div v-if="isModalOpen" class="fixed inset-0 z-[1000] flex items-center justify-center p-4" @click.self="closeModal">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div class="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[88vh] overflow-y-auto p-10 z-10">
          <button
            @click="closeModal"
            class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-all z-20"
          >
            <i class="fas fa-times text-sm"></i>
          </button>
          <ProductDetailView v-if="selectedCourseId" :course-id="selectedCourseId" @close-modal="closeModal" />
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .relative, .modal-leave-to .relative { transform: scale(0.95) translateY(10px); }
</style>
