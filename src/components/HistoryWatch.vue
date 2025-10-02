<script setup>
import { ref, onMounted } from 'vue';

const cours = ref([]);



onMounted(() => {
  const history = JSON.parse(localStorage.getItem('courseHistory') || '{}');
  cours.value = Object.values(history);
});
</script>

<template>
   <div class="py-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 rounded">
    <h2 class="text-2xl text-black dark:text-white font-bold mb-5">Historique des cours</h2>
    <!-- Vue pour mobile et tablette -->
    <div v-if="cours.length > 0" class="lg:hidden space-y-4">
      <div v-for="c in cours" :key="c.titre" class="bg-white p-4 rounded-lg shadow">
        <h3 class="font-bold text-lg mb-2">{{ c.titre }}</h3>
        <p class="text-sm text-para1Color mb-2">Formateur: {{ c.formateur }}</p>
        <div class="mb-2">
          <p class="text-sm text-gray-600 mb-1">Progression</p>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-indigo-600 h-2 rounded-full" :style="{ width: c.progression + '%' }"></div>
          </div>
        </div>
        <div class="flex justify-between items-center text-sm">
          <p class="text-gray-500">Dernier accès: {{ c.date }}</p>
          <span :class="[
            'text-xs px-2 py-1 rounded-full',
            c.statut === 'En cours' ? 'bg-pink-500 text-white' :
            c.statut === 'Terminé' ? 'bg-indigo-600 text-white' :
            'bg-gray-400 text-white'
          ]">
            {{ c.statut }}
          </span>
        </div>
      </div>
    </div>

    <!-- Vue pour desktop -->
    <div v-if="cours.length > 0" class="hidden lg:block overflow-x-auto">
      <table class="w-full border-collapse">
        <thead class="text-left text-[#171A1FFF] font-medium bg-gray-50">
          <tr>
            <th class="p-4">Titre du cours</th>
            <th class="p-4">Formateur</th>
            <th class="p-4">Progression</th>
            <th class="p-4">Dernier accès</th>
            <th class="p-4">Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in cours" :key="c.titre" class="border-b border-para1Color/20">
            <td class="p-4 font-medium">{{ c.titre }}</td>
            <td class="p-4 text-para1Color">{{ c.formateur }}</td>
            <td class="p-4">
              <div class="w-32 bg-gray-200 rounded-full h-2">
                <div class="bg-indigo-600 h-2 rounded-full" :style="{ width: c.progression + '%' }"></div>
              </div>
            </td>
            <td class="p-4 text-[#565D6DFF]">{{ c.date }}</td>
            <td class="p-4">
              <span :class="[
                'text-xs px-2 py-1 rounded-full',
                c.statut === 'En cours' ? 'bg-pink-500 text-white' :
                c.statut === 'Terminé' ? 'bg-indigo-600 text-white' :
                'bg-gray-400 text-white'
              ]">
                {{ c.statut }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="text-center p-10 text-gray-500">
      Vous n'avez pas encore commencé de cours.
    </div>
  </div>
</template>
<style scoped>

table{
    border-radius:100px ;
}


tr{
    border-radius: 100px;
    /* border: 1px solid #171A1FFF; */
}
td{
    margin-block: 10px;
}
/* Vous pouvez garder des styles spécifiques ici si nécessaire, 
   mais la plupart des styles sont maintenant gérés par Tailwind CSS. */
</style>