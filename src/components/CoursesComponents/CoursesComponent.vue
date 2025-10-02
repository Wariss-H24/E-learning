<script setup>
import data from '@/newCourses.json'
import { ref } from 'vue';
import CoursesListComponent from './CoursesListComponent.vue';
import SideBarFilterComponent from './SideBarFilterComponent.vue';
import { computed } from 'vue';
import { useAlertesStore } from '@/store';
const MainCourses = ref(data.courses)
const emit = defineEmits(['show-details'])

const  courses  = useAlertesStore()
const Courses = courses.courses
console.log(Courses);


// const coursesTable = ref([...MainCourses.value])

const selectedCategory = ref('')


const filteredCourses = computed(() => {
    if (!selectedCategory.value) return Courses
    return Courses.filter((el) => el.category === selectedCategory.value)
})

</script>


<template>
    <div class="flex flex-col lg:flex-row  min-h-screen  bg-gray-50 dark:bg-gray-900 transition-colors duration-300  ">
        <SideBarFilterComponent :tabCourses="Courses" @update:category="selectedCategory = $event" />
        <div class="flex-1">
            <CoursesListComponent :tabCourses="filteredCourses" @show-details="emit('show-details', $event)" />
        </div>
    </div>


</template>


<style scoped></style>