<script setup>
import { ref, onMounted } from 'vue'

const cours = ref([])

onMounted(() => {
  const history = JSON.parse(localStorage.getItem('courseHistory') || '{}')
  cours.value = Object.values(history)
})

function statusStyle(statut) {
  if (statut === 'Terminé') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
  if (statut === 'En cours') return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
  return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
}
</script>

<template>
  <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6">
    <h2 class="text-base font-bold text-slate-900 dark:text-white mb-4">
      <i class="fas fa-history text-indigo-500 mr-2"></i>Historique des cours
    </h2>

    <!-- Mobile cards -->
    <div v-if="cours.length > 0" class="lg:hidden space-y-3">
      <div v-for="c in cours" :key="c.titre" class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-700">
        <div class="flex items-start justify-between gap-2 mb-3">
          <h3 class="font-semibold text-sm text-slate-900 dark:text-white leading-snug">{{ c.titre }}</h3>
          <span :class="statusStyle(c.statut)" class="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0">{{ c.statut }}</span>
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-400 mb-2">
          <i class="fas fa-user-tie mr-1 text-indigo-400"></i>{{ c.formateur }}
        </p>
        <div class="mb-1">
          <div class="flex justify-between text-xs text-slate-400 mb-1">
            <span>Progression</span><span>{{ c.progression }}%</span>
          </div>
          <div class="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-1.5">
            <div class="bg-indigo-600 h-1.5 rounded-full transition-all" :style="{ width: c.progression + '%' }"></div>
          </div>
        </div>
        <p class="text-xs text-slate-400 mt-2"><i class="fas fa-calendar mr-1"></i>{{ c.date }}</p>
      </div>
    </div>

    <!-- Desktop table -->
    <div v-if="cours.length > 0" class="hidden lg:block overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-slate-100 dark:border-slate-700">
            <th class="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 pr-4">Cours</th>
            <th class="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 pr-4">Formateur</th>
            <th class="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 pr-4">Progression</th>
            <th class="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 pr-4">Dernier accès</th>
            <th class="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3">Statut</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50 dark:divide-slate-700/50">
          <tr v-for="c in cours" :key="c.titre" class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
            <td class="py-3.5 pr-4 text-sm font-medium text-slate-900 dark:text-white max-w-[200px] truncate">{{ c.titre }}</td>
            <td class="py-3.5 pr-4 text-sm text-slate-500 dark:text-slate-400">{{ c.formateur }}</td>
            <td class="py-3.5 pr-4">
              <div class="flex items-center gap-2">
                <div class="w-24 bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
                  <div class="bg-indigo-600 h-1.5 rounded-full" :style="{ width: c.progression + '%' }"></div>
                </div>
                <span class="text-xs text-slate-400">{{ c.progression }}%</span>
              </div>
            </td>
            <td class="py-3.5 pr-4 text-sm text-slate-500 dark:text-slate-400">{{ c.date }}</td>
            <td class="py-3.5">
              <span :class="statusStyle(c.statut)" class="text-xs font-semibold px-2.5 py-1 rounded-full">{{ c.statut }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty state -->
    <div v-if="cours.length === 0" class="flex flex-col items-center justify-center py-10 text-center">
      <div class="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center mb-3">
        <i class="fas fa-book-open text-xl text-slate-300 dark:text-slate-600"></i>
      </div>
      <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Aucun cours commencé</p>
      <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">Vos cours en cours et terminés apparaîtront ici.</p>
    </div>
  </div>
</template>
