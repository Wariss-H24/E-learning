<script setup>
const props = defineProps({
  earnedBadges: { type: Array, required: true }
})
</script>

<template>
  <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6">
    <h2 class="text-base font-bold text-slate-900 dark:text-white mb-4">
      <i class="fas fa-medal text-amber-500 mr-2"></i>Badges obtenus
    </h2>

    <div v-if="props.earnedBadges.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="badge in props.earnedBadges"
        :key="badge.name"
        class="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-700 transition-colors"
      >
        <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-md shadow-indigo-500/20">
          <span v-html="badge.icon"></span>
        </div>
        <div class="min-w-0">
          <p class="text-sm font-bold text-slate-900 dark:text-white truncate">{{ badge.name }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400 truncate">{{ badge.description }}</p>
        </div>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-10 text-center">
      <div class="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center mb-3">
        <i class="fas fa-medal text-xl text-slate-300 dark:text-slate-600"></i>
      </div>
      <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Aucun badge pour l'instant</p>
      <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">Terminez des cours pour débloquer vos premiers badges !</p>
    </div>
  </div>
</template>
