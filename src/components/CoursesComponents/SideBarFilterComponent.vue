<script setup>
import { computed, ref } from 'vue'

const props = defineProps({ tabCourses: Array })
const selectedCategory = ref('')
const emits = defineEmits(['update:category'])

const categories = computed(() => {
  const counts = {}
  props.tabCourses.forEach(c => {
    counts[c.category] = (counts[c.category] || 0) + 1
  })
  return Object.entries(counts).map(([name, count]) => ({ name, count }))
})

function selectCategory(cat) {
  selectedCategory.value = cat
  emits('update:category', cat)
}
</script>

<template>
  <aside class="w-full lg:w-64 flex-shrink-0 p-4 lg:p-5">
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 lg:sticky lg:top-20">
      <h3 class="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
        <i class="fas fa-filter mr-2 text-indigo-500"></i>Catégories
      </h3>

      <div class="space-y-1">
        <button
          @click="selectCategory('')"
          :class="selectedCategory === '' ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'"
          class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
        >
          <span>Tous les cours</span>
          <span :class="selectedCategory === '' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'" class="text-xs px-2 py-0.5 rounded-full font-semibold">
            {{ tabCourses.length }}
          </span>
        </button>

        <button
          v-for="cat in categories"
          :key="cat.name"
          @click="selectCategory(cat.name)"
          :class="selectedCategory === cat.name ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'"
          class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
        >
          <span>{{ cat.name }}</span>
          <span :class="selectedCategory === cat.name ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'" class="text-xs px-2 py-0.5 rounded-full font-semibold">
            {{ cat.count }}
          </span>
        </button>
      </div>
    </div>
  </aside>
</template>
