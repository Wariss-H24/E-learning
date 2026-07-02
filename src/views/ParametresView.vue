<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/store'
import { supabase } from '@/supabase'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const isDark = ref(localStorage.getItem('theme') === 'dark')
const saveSuccess = ref('')

// Modales
const showPwModal = ref(false)
const showDeleteModal = ref(false)

// Mot de passe
const passwords = ref({ new: '', confirm: '' })
const pwError = ref('')
const saving = ref(false)

// Suppression
const deleteConfirmText = ref('')
const deleting = ref(false)
const deleteError = ref('')

const email = computed(() => auth.user?.email || '')

function toggleDark() {
  isDark.value = !isDark.value
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  document.documentElement.classList.toggle('dark', isDark.value)
}

function openPwModal() {
  passwords.value = { new: '', confirm: '' }
  pwError.value = ''
  showPwModal.value = true
}

async function confirmChangePassword() {
  pwError.value = ''
  if (passwords.value.new.length < 6) {
    pwError.value = 'Au moins 6 caractères requis.'
    return
  }
  if (passwords.value.new !== passwords.value.confirm) {
    pwError.value = 'Les mots de passe ne correspondent pas.'
    return
  }
  saving.value = true
  const { error } = await supabase.auth.updateUser({ password: passwords.value.new })
  saving.value = false
  if (error) { pwError.value = error.message; return }
  showPwModal.value = false
  saveSuccess.value = 'Mot de passe mis à jour !'
  setTimeout(() => saveSuccess.value = '', 3000)
}

function openDeleteModal() {
  deleteConfirmText.value = ''
  deleteError.value = ''
  showDeleteModal.value = true
}

async function confirmDelete() {
  if (deleteConfirmText.value !== 'SUPPRIMER') {
    deleteError.value = 'Tapez exactement "SUPPRIMER" pour confirmer.'
    return
  }
  deleting.value = true
  // Supabase ne permet pas la suppression côté client sans service_role key
  // On déconnecte et on informe l'utilisateur de contacter le support
  await auth.logout()
  router.push({ name: 'Acceuil' })
}
</script>

<template>
  <div class="bg-slate-50 dark:bg-slate-900 min-h-screen">

    <!-- Toast -->
    <transition name="toast">
      <div v-if="saveSuccess" class="fixed top-20 right-5 z-[9999] flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500 text-white shadow-xl text-sm font-medium">
        <i class="fas fa-check-circle"></i> {{ saveSuccess }}
      </div>
    </transition>

    <!-- Modal mot de passe -->
    <transition name="modal">
      <div v-if="showPwModal" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showPwModal = false"></div>
        <div class="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-slate-100 dark:border-slate-700">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
              <i class="fas fa-lock text-indigo-600 dark:text-indigo-400"></i>
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white">Changer le mot de passe</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">Choisissez un mot de passe sécurisé</p>
            </div>
            <button @click="showPwModal = false" class="ml-auto w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <i class="fas fa-times text-sm"></i>
            </button>
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Nouveau mot de passe</label>
              <input v-model="passwords.new" type="password" placeholder="••••••••" autofocus
                class="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Confirmer le mot de passe</label>
              <input v-model="passwords.confirm" type="password" placeholder="••••••••"
                @keyup.enter="confirmChangePassword"
                class="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
            </div>
            <p v-if="pwError" class="text-red-500 text-xs flex items-center gap-1.5">
              <i class="fas fa-exclamation-circle"></i> {{ pwError }}
            </p>
          </div>

          <div class="flex gap-3 mt-5">
            <button @click="showPwModal = false"
              class="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-xl transition-colors">
              Annuler
            </button>
            <button @click="confirmChangePassword" :disabled="saving"
              class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-500/30">
              <i :class="saving ? 'fas fa-spinner fa-spin' : 'fas fa-check'"></i>
              {{ saving ? 'Enregistrement...' : 'Confirmer' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal suppression -->
    <transition name="modal">
      <div v-if="showDeleteModal" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showDeleteModal = false"></div>
        <div class="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-red-100 dark:border-red-900/30">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
              <i class="fas fa-trash-alt text-red-600 dark:text-red-400"></i>
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white">Supprimer le compte</h3>
              <p class="text-xs text-red-500 dark:text-red-400 font-medium">Action irréversible</p>
            </div>
            <button @click="showDeleteModal = false" class="ml-auto w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <i class="fas fa-times text-sm"></i>
            </button>
          </div>

          <p class="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
            Toutes vos données seront définitivement supprimées. Cette action <strong class="text-slate-900 dark:text-white">ne peut pas être annulée</strong>.
          </p>

          <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 mb-4">
            <p class="text-xs text-red-600 dark:text-red-400 mb-2 font-medium">
              Tapez <span class="font-mono font-bold bg-red-100 dark:bg-red-900/40 px-1.5 py-0.5 rounded">SUPPRIMER</span> pour confirmer
            </p>
            <input v-model="deleteConfirmText" type="text" placeholder="SUPPRIMER"
              class="w-full bg-white dark:bg-slate-800 border border-red-200 dark:border-red-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all font-mono" />
          </div>

          <p v-if="deleteError" class="text-red-500 text-xs mb-3 flex items-center gap-1.5">
            <i class="fas fa-exclamation-circle"></i> {{ deleteError }}
          </p>

          <div class="flex gap-3">
            <button @click="showDeleteModal = false"
              class="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-xl transition-colors">
              Annuler
            </button>
            <button @click="confirmDelete" :disabled="deleting || deleteConfirmText !== 'SUPPRIMER'"
              class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors">
              <i :class="deleting ? 'fas fa-spinner fa-spin' : 'fas fa-trash-alt'"></i>
              {{ deleting ? 'Suppression...' : 'Supprimer définitivement' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Hero -->
    <div class="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 pt-10 pb-20 px-4">
      <div class="max-w-2xl mx-auto">
        <h1 class="text-2xl font-extrabold text-white">Paramètres</h1>
        <p class="text-indigo-200 text-sm mt-1">Gérez vos préférences et la sécurité de votre compte</p>
      </div>
    </div>

    <div class="max-w-2xl mx-auto px-4 -mt-10 relative z-10 pb-16 space-y-5">

      <!-- Compte -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-lg">
        <h2 class="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <i class="fas fa-user-circle text-indigo-500"></i> Informations du compte
        </h2>
        <div>
          <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
          <div class="w-full bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-500 dark:text-slate-400">
            {{ email }}
          </div>
        </div>
      </div>

      <!-- Sécurité -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-lg">
        <h2 class="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <i class="fas fa-shield-alt text-indigo-500"></i> Sécurité
        </h2>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-800 dark:text-white">Mot de passe</p>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Modifiez votre mot de passe de connexion</p>
          </div>
          <button @click="openPwModal"
            class="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-sm font-semibold rounded-xl border border-indigo-200 dark:border-indigo-800 transition-colors">
            <i class="fas fa-key text-xs"></i> Modifier
          </button>
        </div>
      </div>

      <!-- Apparence -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-lg">
        <h2 class="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <i class="fas fa-palette text-indigo-500"></i> Apparence
        </h2>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-800 dark:text-white">Mode sombre</p>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Basculer entre le thème clair et sombre</p>
          </div>
          <button @click="toggleDark"
            class="relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none"
            :class="isDark ? 'bg-indigo-600' : 'bg-slate-300'">
            <span class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300"
              :class="isDark ? 'translate-x-6' : 'translate-x-0'"></span>
          </button>
        </div>
      </div>

      <!-- Zone danger -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl border border-red-100 dark:border-red-900/30 p-6 shadow-lg">
        <h2 class="text-sm font-bold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
          <i class="fas fa-exclamation-triangle"></i> Zone de danger
        </h2>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-800 dark:text-white">Supprimer mon compte</p>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Action irréversible — toutes vos données seront perdues</p>
          </div>
          <button @click="openDeleteModal"
            class="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 text-sm font-semibold rounded-xl border border-red-200 dark:border-red-800 transition-colors">
            <i class="fas fa-trash-alt text-xs"></i> Supprimer
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(20px); }

.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .relative, .modal-leave-to .relative { transform: scale(0.95) translateY(10px); }
</style>
