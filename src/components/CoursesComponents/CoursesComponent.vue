<script setup>
import { computed, ref } from 'vue'
import CoursesListComponent from './CoursesListComponent.vue'
import SideBarFilterComponent from './SideBarFilterComponent.vue'
import { useAlertesStore } from '@/store'

const props = defineProps({ showCategories: { type: Boolean, default: false } })
const emit = defineEmits(['show-details'])
const courses = useAlertesStore()
const selectedCategory = ref('')

const filteredCourses = computed(() => {
  if (!props.showCategories || !selectedCategory.value) return courses.courses
  return courses.courses.filter((course) => course.category === selectedCategory.value)
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <div class="flex flex-col lg:flex-row">
      <SideBarFilterComponent v-if="props.showCategories" :tabCourses="courses.courses" @update:category="selectedCategory = $event" />
      <div class="flex-1">
        <CoursesListComponent :tabCourses="props.showCategories ? filteredCourses : courses.courses" :showCategories="props.showCategories" @show-details="emit('show-details', $event)" />
      </div>
    </div>
  </div>
</template>


<style scoped></style>