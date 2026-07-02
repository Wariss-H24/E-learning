<script setup>
import { ref, computed } from 'vue'
import { useAlertesStore } from '@/store'

const courseStore = useAlertesStore()
const showModal = ref(false)
const isEditing = ref(false)
const search = ref('')
const showDeleteConfirm = ref(false)
const deleteTargetId = ref(null)

const newCourse = ref({
  id: null, title: '', category: '', instructor: '',
  duration: '', price: null, thumbnail: '', description: ''
})

const categoryColors = {
  'Programmation': 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  'Développement Web': 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400',
  'Data & IA': 'bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400',
  'Design': 'bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400',
  'Business': 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
  'Langues': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
  'Informatique': 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400',
}

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return courseStore.courses.filter(c =>
    c.title?.toLowerCase().includes(q) ||
    c.category?.toLowerCase().includes(q) ||
    c.instructor?.toLowerCase().includes(q)
  )
})

function openModal(course = null) {
  isEditing.value = !!course
  newCourse.value = course
    ? { ...course }
    : { id: null, title: '', category: '', instructor: '', duration: '', price: null, thumbnail: '', description: '' }
  showModal.value = true
}

function closeModal() { showModal.value = false }

function handleSubmit() {
  if (isEditing.value) courseStore.updateCourse({ ...newCourse.value })
  else courseStore.addCourse({ ...newCourse.value })
  closeModal()
}

function askDelete(id) {
  deleteTargetId.value = id
  showDeleteConfirm.value = true
}

function confirmDelete() {
  courseStore.removeCourse(deleteTargetId.value)
  showDeleteConfirm.value = false
  deleteTargetId.value = null
}

function handleThumbnail(e) {
  const file = e.target.files[0]
  if (file) newCourse.value.thumbnail = URL.createObjectURL(file)
}
</script>

<template>
  <div>
    <!-- Toolbar -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
      <div class="relative w-full sm:w-72">
        <i class="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
        <input
          v-model="search"
          type="text"
          placeholder="Rechercher un cours..."
          class="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
        />
      </div>
      <button
        @click="openModal()"
        class="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-500/30 flex-shrink-0"
      >
        <i class="fas fa-plus"></i> Ajouter un cours
      </button>
    </div>

    <!-- Table desktop -->
    <div class="hidden md:block overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-700">
      <table class="w-full text-sm">
        <thead class="bg-slate-50 dark:bg-slate-700/50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cours</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Catégorie</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Instructeur</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Durée</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Prix</th>
            <th class="px-4 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
          <tr v-for="el in filtered" :key="el.id" class="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0">
                  <img v-if="el.thumbnail" :src="el.thumbnail" class="w-full h-full object-cover" alt="" />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <i class="fas fa-book text-slate-400 text-xs"></i>
                  </div>
                </div>
                <div>
                  <p class="font-semibold text-slate-900 dark:text-white text-sm leading-tight">{{ el.title }}</p>
                  <p class="text-xs text-slate-400 mt-0.5">#{{ el.id }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3">
              <span class="px-2.5 py-1 rounded-full text-xs font-semibold" :class="categoryColors[el.category] || 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'">
                {{ el.category || '—' }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{{ el.instructor || '—' }}</td>
            <td class="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
              <span class="flex items-center gap-1.5"><i class="fas fa-clock text-slate-400 text-xs"></i>{{ el.duration || '—' }}</span>
            </td>
            <td class="px-4 py-3">
              <span v-if="!el.price || el.price === 0" class="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-semibold">Gratuit</span>
              <span v-else class="text-sm font-semibold text-slate-900 dark:text-white">{{ el.price }}€</span>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center justify-center gap-2">
                <button @click="openModal(el)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 transition-colors" title="Modifier">
                  <i class="fas fa-pen text-xs"></i>
                </button>
                <button @click="askDelete(el.id)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 transition-colors" title="Supprimer">
                  <i class="fas fa-trash-alt text-xs"></i>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filtered.length === 0">
            <td colspan="6" class="px-4 py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
              <i class="fas fa-search text-2xl mb-2 block"></i>
              Aucun cours trouvé
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Cards mobile -->
    <div class="md:hidden space-y-3">
      <div v-for="el in filtered" :key="el.id" class="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 shadow-sm">
        <div class="flex items-start gap-3 mb-3">
          <div class="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0">
            <img v-if="el.thumbnail" :src="el.thumbnail" class="w-full h-full object-cover" alt="" />
            <div v-else class="w-full h-full flex items-center justify-center"><i class="fas fa-book text-slate-400"></i></div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-slate-900 dark:text-white text-sm truncate">{{ el.title }}</p>
            <span class="px-2 py-0.5 rounded-full text-xs font-semibold mt-1 inline-block" :class="categoryColors[el.category] || 'bg-slate-100 text-slate-600'">{{ el.category }}</span>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <span v-if="!el.price || el.price === 0" class="text-xs font-semibold text-emerald-600">Gratuit</span>
          <span v-else class="text-sm font-bold text-slate-900 dark:text-white">{{ el.price }}€</span>
          <div class="flex gap-2">
            <button @click="openModal(el)" class="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-lg">
              <i class="fas fa-pen mr-1"></i>Modifier
            </button>
            <button @click="askDelete(el.id)" class="px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-semibold rounded-lg">
              <i class="fas fa-trash-alt mr-1"></i>Supprimer
            </button>
          </div>
        </div>
      </div>
      <div v-if="filtered.length === 0" class="text-center py-10 text-slate-400 text-sm">
        <i class="fas fa-search text-2xl mb-2 block"></i>Aucun cours trouvé
      </div>
    </div>

    <!-- Footer table -->
    <div class="mt-3 flex items-center justify-between px-1">
      <p class="text-xs text-slate-400 dark:text-slate-500">{{ filtered.length }} cours affichés</p>
    </div>
  </div>

  <!-- Modal ajout/édition -->
  <transition name="modal">
    <div v-if="showModal" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="closeModal"></div>
      <div class="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-100 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center gap-3 p-6 border-b border-slate-100 dark:border-slate-700">
          <div class="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
            <i :class="isEditing ? 'fas fa-pen' : 'fas fa-plus'" class="text-indigo-600 dark:text-indigo-400"></i>
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white">{{ isEditing ? 'Modifier le cours' : 'Ajouter un cours' }}</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">{{ isEditing ? 'Mettez à jour les informations' : 'Remplissez les informations du nouveau cours' }}</p>
          </div>
          <button @click="closeModal" class="ml-auto w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <i class="fas fa-times text-sm"></i>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Titre</label>
              <input v-model="newCourse.title" type="text" required placeholder="Titre du cours"
                class="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Catégorie</label>
              <select v-model="newCourse.category"
                class="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all">
                <option value="">Sélectionner</option>
                <option>Programmation</option>
                <option>Développement Web</option>
                <option>Data & IA</option>
                <option>Design</option>
                <option>Business</option>
                <option>Langues</option>
                <option>Informatique</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Instructeur</label>
              <input v-model="newCourse.instructor" type="text" placeholder="Nom de l'instructeur"
                class="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Durée</label>
              <input v-model="newCourse.duration" type="text" placeholder="ex: 4h30"
                class="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Prix (€) — 0 = gratuit</label>
              <input v-model="newCourse.price" type="number" min="0" placeholder="0"
                class="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
            </div>
            <div class="col-span-2">
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Vignette</label>
              <div v-if="newCourse.thumbnail" class="mb-2 rounded-xl overflow-hidden h-32 bg-slate-100 dark:bg-slate-700">
                <img :src="newCourse.thumbnail" class="w-full h-full object-cover" alt="preview" />
              </div>
              <input type="file" accept="image/*" @change="handleThumbnail"
                class="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-500 dark:text-slate-400 outline-none transition-all file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-600 dark:file:bg-indigo-900/20 dark:file:text-indigo-400" />
            </div>
            <div class="col-span-2">
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
              <textarea v-model="newCourse.description" rows="3" placeholder="Description du cours..."
                class="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"></textarea>
            </div>
          </div>

          <div class="flex gap-3 pt-2">
            <button type="button" @click="closeModal"
              class="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-xl transition-colors">
              Annuler
            </button>
            <button type="submit"
              class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-500/30">
              <i :class="isEditing ? 'fas fa-save' : 'fas fa-plus'"></i>
              {{ isEditing ? 'Mettre à jour' : 'Ajouter' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>

  <!-- Modal suppression -->
  <transition name="modal">
    <div v-if="showDeleteConfirm" class="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showDeleteConfirm = false"></div>
      <div class="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-red-100 dark:border-red-900/30">
        <div class="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-trash-alt text-2xl text-red-500"></i>
        </div>
        <h3 class="text-base font-bold text-slate-900 dark:text-white text-center mb-1">Supprimer ce cours ?</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 text-center mb-5">Cette action est irréversible.</p>
        <div class="flex gap-3">
          <button @click="showDeleteConfirm = false"
            class="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-xl transition-colors">
            Annuler
          </button>
          <button @click="confirmDelete"
            class="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-xl transition-colors">
            <i class="fas fa-trash-alt mr-1.5"></i>Supprimer
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
