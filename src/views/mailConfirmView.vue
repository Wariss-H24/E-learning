<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/supabase'
import { useAuthStore } from '@/store'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

// Deux modes : 'pending' (après inscription) ou 'callback' (retour lien email)
const mode = ref('pending')
const status = ref('loading') // loading | success | error
const username = ref(route.params.user || '')

onMounted(async () => {
  // Si on est sur /auth/callback, Supabase a mis le token dans l'URL (#access_token=...)
  if (route.path === '/auth/callback' || window.location.hash.includes('access_token')) {
    mode.value = 'callback'
    // Supabase SDK récupère automatiquement la session depuis le hash
    const { data, error } = await supabase.auth.getSession()
    if (error || !data.session) {
      // Essayer d'échanger le code PKCE si présent dans l'URL
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.href)
      if (exchangeError) {
        status.value = 'error'
        return
      }
    }
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      auth.isAuthenticated = true
      auth.user = session.user
      username.value = session.user.user_metadata?.username || session.user.email
      status.value = 'success'
      setTimeout(() => router.push({ name: 'Acceuil' }), 3000)
    } else {
      status.value = 'error'
    }
  } else {
    // Mode pending : juste après l'inscription
    mode.value = 'pending'
    status.value = 'pending'
  }
})

async function resendEmail() {
  const userRaw = localStorage.getItem('pendingEmail')
  if (!userRaw) return
  await supabase.auth.resend({ type: 'signup', email: userRaw })
  resent.value = true
  setTimeout(() => resent.value = false, 5000)
}

const resent = ref(false)
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4">
    <div class="w-full max-w-md">

      <!-- Mode : en attente de confirmation -->
      <div v-if="mode === 'pending'" class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-8 text-center shadow-xl">
        <div class="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <i class="fas fa-envelope-open-text text-4xl text-indigo-600 dark:text-indigo-400"></i>
        </div>
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
          Vérifiez votre email 📧
        </h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-2">
          Un email de confirmation a été envoyé à votre adresse. Cliquez sur le lien dans l'email pour activer votre compte.
        </p>
        <p v-if="username" class="text-indigo-600 dark:text-indigo-400 font-semibold text-sm mb-6">
          Bienvenue, {{ username }} !
        </p>

        <!-- Étapes -->
        <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 mb-6 text-left space-y-3">
          <div class="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
            <div class="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-white text-xs font-bold">1</span>
            </div>
            Ouvrez votre boîte mail
          </div>
          <div class="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
            <div class="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-white text-xs font-bold">2</span>
            </div>
            Cherchez un email de <span class="font-semibold">HighFive Academy</span>
          </div>
          <div class="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
            <div class="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-white text-xs font-bold">3</span>
            </div>
            Cliquez sur le lien de confirmation
          </div>
        </div>

        <div class="flex flex-col gap-3">
          <transition name="toast">
            <p v-if="resent" class="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <i class="fas fa-check-circle mr-1"></i>Email renvoyé !
            </p>
          </transition>
          <button
            @click="resendEmail"
            class="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <i class="fas fa-redo mr-2"></i>Renvoyer l'email
          </button>
          <RouterLink to="/auth" class="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold text-center transition-colors">
            Retour à la connexion
          </RouterLink>
        </div>
      </div>

      <!-- Mode : callback — chargement -->
      <div v-else-if="mode === 'callback' && status === 'loading'" class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-8 text-center shadow-xl">
        <div class="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <i class="fas fa-spinner fa-spin text-4xl text-indigo-600 dark:text-indigo-400"></i>
        </div>
        <h1 class="text-xl font-bold text-slate-900 dark:text-white mb-2">Vérification en cours...</h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm">Activation de votre compte, veuillez patienter.</p>
      </div>

      <!-- Mode : callback — succès -->
      <div v-else-if="mode === 'callback' && status === 'success'" class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-8 text-center shadow-xl">
        <div class="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <i class="fas fa-check-circle text-4xl text-emerald-500"></i>
        </div>
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Compte activé ! 🎉</h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm mb-6">
          Votre compte est confirmé. Vous allez être redirigé automatiquement...
        </p>
        <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 mb-4">
          <div class="bg-emerald-500 h-1.5 rounded-full animate-progress"></div>
        </div>
        <RouterLink to="/" class="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors">
          <i class="fas fa-home"></i> Aller à l'accueil
        </RouterLink>
      </div>

      <!-- Mode : callback — erreur -->
      <div v-else-if="mode === 'callback' && status === 'error'" class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-8 text-center shadow-xl">
        <div class="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <i class="fas fa-times-circle text-4xl text-red-500"></i>
        </div>
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Lien invalide</h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm mb-6">
          Ce lien de confirmation est expiré ou invalide. Veuillez vous réinscrire ou demander un nouvel email.
        </p>
        <RouterLink to="/auth" class="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors">
          <i class="fas fa-arrow-left"></i> Retour à l'inscription
        </RouterLink>
      </div>

    </div>
  </div>
</template>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; }

@keyframes progress {
  from { width: 0% }
  to { width: 100% }
}
.animate-progress {
  animation: progress 3s linear forwards;
}
</style>
