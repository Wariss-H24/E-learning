<script setup>
import { ref, computed } from 'vue'
import { useAlertesStore } from '@/store'
 
const courseStore = useAlertesStore()
 
const showModal = ref(false)
const isEditing = ref(false)
const newCourse = ref({
  id: null,
  title: '',
  category: '',
  instructor: '',
  duration: '',
  price: null,
  thumbnail: '',
  description: ''
})
 
const tabFilter = computed(() => courseStore.courses)
 
function openModal(course = null) {
  if (course) {
    isEditing.value = true
    newCourse.value = { ...course }
  } else {
    isEditing.value = false
    newCourse.value = {
      id: null,
      title: '',
      category: '',
      instructor: '',
      duration: '',
      price: null,
      thumbnail: '',
      description: ''
    }
  }
  showModal.value = true
}
 
function closeModal() {
  showModal.value = false
}
 
function handleSubmit(event) {
  event.preventDefault()
  if (isEditing.value) {
    courseStore.updateCourse({ ...newCourse.value })
  } else {
    courseStore.addCourse({ ...newCourse.value })
  }
  closeModal()
}
 
function removeCours(id) {
  courseStore.removeCourse(id)
}
 
function handleThumbnail(e) {
  const file = e.target.files[0]
  if (file) {
    newCourse.value.thumbnail = URL.createObjectURL(file)
  }
}
</script>
 
<template>
<div class="relative w-full bg-white dark:bg-[#23272f] transition-colors duration-300">
  <div class="flex flex-col sm:flex-row justify-between items-center py-5 mx-2 sm:mx-4 md:mx-10 gap-3">
    <h2 class="text-xl font-bold dark:text-gray-100">Gestion des Cours</h2>
    <button
      class="bg-blue-600 text-white px-4 py-2 rounded hover:scale-105 hover:bg-blue-700 transition-transform duration-300 w-full sm:w-auto"
      @click="openModal()"
    >
      + Ajouter un nouveau cours
    </button>
  </div>

  <!-- Tableau -->
  <div class="overflow-x-auto w-full">
    <table class="table-auto w-full border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-[#23272f]">
      <thead class="bg-gray-100 dark:bg-[#2c3140]">
        <tr>
          <th class="p-2 text-center dark:text-gray-100">ID</th>
          <th class="p-2 text-left dark:text-gray-100">Titre</th>
          <th class="p-2 text-center dark:text-gray-100">Catégorie</th>
          <th class="p-2 text-center dark:text-gray-100">Durée</th>
          <th class="p-2 text-center dark:text-gray-100">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="el in tabFilter"
          :key="el.id"
          class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2c3140] transition"
        >
          <td class="p-2 text-center dark:text-gray-200">{{ el.id }}</td>
          <td class="p-2 dark:text-gray-200">{{ el.title }}</td>
          <td class="p-2 text-center dark:text-gray-200">{{ el.category }}</td>
          <td class="p-2 text-center dark:text-gray-200">{{ el.duration }}</td>
          <td class="p-2 flex flex-col sm:flex-row justify-center gap-2">
            <button
              @click="openModal(el)"
              class="flex items-center gap-2 bg-green-500 text-white dark:bg-green-500 dark:text-gray-100 px-3 py-1 rounded hover:scale-105 hover:bg-gray-300 dark:hover:bg-[#23272f] w-full sm:w-auto"
            >
              <img src="../../public/lucide-SquarePen-Outlined.svg" alt="Modifier" class="h-4 w-4" />
              Modifier
            </button>
            <button
              @click="removeCours(el.id)"
              class="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded hover:scale-105 hover:bg-red-700 w-full sm:w-auto"
            >
              <img src="../../public/lucide-Trash2-Outlined.svg" alt="Supprimer" class="h-4 w-4" />
              Supprimer
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
 
  <!-- Modal -->
<transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 scale-90"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-90"
>
<div
      v-if="showModal"
      class="fixed inset-0 bg-[rgba(0,0,0,0.55)] flex items-center justify-center z-50 p-4"
>
  <div class="bg-white dark:bg-[#23272f] rounded-lg shadow-lg p-6 w-full max-w-[500px] max-h-screen overflow-y-auto transition-colors duration-300">
    <h2 class="text-lg font-bold mb-4 text-center dark:text-gray-100">
      {{ isEditing ? "Modifier le cours" : "Ajouter un nouveau cours" }}
    </h2>

    <form @submit="handleSubmit" class="space-y-4">
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Titre</label>
        <input type="text" id="title" v-model="newCourse.title"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-[#2c3140] dark:text-gray-100" />
      </div>

      <div>
        <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Catégorie</label>
        <select id="category" v-model="newCourse.category"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-[#2c3140] dark:text-gray-100">
          <option value="">Sélectionnez une catégorie</option>
          <option value="Programmation">Programmation</option>
          <option value="Informatique">Informatique</option>
          <option value="Business">Business</option>
          <option value="Design">Design</option>
          <option value="Langues">Langues</option>
        </select>
      </div>

      <div>
        <label for="instructor" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Instructeur</label>
        <input type="text" id="instructor" v-model="newCourse.instructor"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-[#2c3140] dark:text-gray-100" />
      </div>

      <div>
        <label for="duration" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Durée</label>
        <input type="text" id="duration" v-model="newCourse.duration"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-[#2c3140] dark:text-gray-100" />
      </div>

      <div>
        <label for="price" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Prix (€)</label>
        <input type="number" id="price" v-model="newCourse.price"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-[#2c3140] dark:text-gray-100" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Vignette</label>
        <div class="flex flex-col items-center">
          <img v-if="newCourse.thumbnail" :src="newCourse.thumbnail" alt="thumbnail"
            class="w-64 h-40 object-cover rounded-lg mb-3" />
          <input id="thumbnail" type="file" @change="handleThumbnail"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-[#2c3140] dark:text-gray-100" />
        </div>
      </div>

      <div>
        <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Description</label>
        <textarea id="description" v-model="newCourse.description" rows="3"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-[#2c3140] dark:text-gray-100"></textarea>
      </div>

      <div class="flex flex-col sm:flex-row justify-center gap-3 mt-4">
        <button type="submit"
          class="w-full sm:w-auto px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          {{ isEditing ? "Mettre à jour" : "Ajouter" }}
        </button>
        <button type="button" @click="closeModal"
          class="w-full sm:w-auto px-5 py-2 bg-gray-400 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-500 dark:hover:bg-gray-800 transition">
          Annuler
        </button>
      </div>
    </form>
  </div>
</div>
</transition>
</template>