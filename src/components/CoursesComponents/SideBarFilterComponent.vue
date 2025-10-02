<script setup>
import { computed, ref } from 'vue';


const props = defineProps({
  tabCourses: Array
})

const selectedCategory = ref('')
const emits = defineEmits(['update:category'])

const categories = computed(() => [...new Set(props.tabCourses.map(el => el.category))])

function selectCategory(cour) {
  selectedCategory.value = cour
  emits('update:category', cour)
}


</script>


<template>
  <div
    class="p-4 bg-white dark:bg-[#23272f] rounded-lg shadow-md w-full lg:w-[25%] h-auto lg:h-[50vh] sticky top-[80px] flex flex-col justify-center items-center ml-0 lg:ml-[16px] dark:text-blue-100 border border-blue-100 dark:border-[#3a4152] transition-all duration-300">
  <h3 class="font-semibold mb-2 text-3xl dark:text-blue-100">Catégories</h3>

    <div class="flex flex-col gap-2">
      <!-- Bouton Tout -->
      <button @click="selectCategory('')" :class="[
        'px-4 py-1 rounded-lg border text-sm font-medium transition w-full',
        selectedCategory === ''
          ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-700 dark:border-blue-700'
          : 'bg-white dark:bg-[#2c3140] text-gray-700 dark:text-blue-100 border-blue-100 dark:border-[#3a4152] hover:bg-blue-100 dark:hover:bg-[#23272f]'
      ]">
        Tout
      </button>

      <!-- Boutons catégories -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        <button v-for="cat in categories" :key="cat" @click="selectCategory(cat)" :class="[
          'px-4 py-1 rounded-lg border text-sm font-medium transition w-full',
          selectedCategory === cat
            ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-700 dark:border-blue-700'
            : 'bg-white dark:bg-[#2c3140] text-gray-700 dark:text-blue-100 border-blue-100 dark:border-[#3a4152] hover:bg-blue-100 dark:hover:bg-[#23272f]'
        ]" class="flex justify-center items-center">
          {{ cat }}
        </button>
      </div>
    </div>
  </div>

</template>


<style scoped></style>