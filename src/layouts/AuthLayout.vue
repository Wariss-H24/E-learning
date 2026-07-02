<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/store'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const formState = ref('connect')
const showPassword = ref(false)

// Connexion
const email = ref('')
const password = ref('')

// Inscription
const pseudoI = ref('')
const fullName = ref('')
const emailI = ref('')
const mdp1 = ref('')
const mdp2 = ref('')

const notification = ref('')

function notify(type) {
  notification.value = type
  setTimeout(() => notification.value = '', 4000)
}

async function login() {
  if (!email.value || !password.value) return notify('empty')
  const ok = await auth.login(email.value, password.value)
  if (ok) {
    notify('success')
    setTimeout(() => router.push({ name: 'Acceuil' }), 1500)
  } else {
    notify('error')
  }
}

async function inscription() {
  if (!pseudoI.value || !fullName.value || !emailI.value || !mdp1.value || !mdp2.value) return notify('empty')
  if (mdp1.value !== mdp2.value) return notify('password')
  if (mdp1.value.length < 6) return notify('weakpassword')

  const ok = await auth.register(emailI.value, mdp1.value, pseudoI.value, fullName.value)
  if (ok) {
    localStorage.setItem('pendingEmail', emailI.value)
    notify('registered')
    setTimeout(() => router.push({ name: 'confirm', params: { user: pseudoI.value } }), 1500)
  } else {
    // auth.error contient le message Supabase (ex: "User already registered")
    if (auth.error?.includes('already registered') || auth.error?.includes('already been registered')) {
      notify('emailexists')
    } else {
      notify('registererror')
    }
  }
}

const notifications = {
  success:       { icon: 'fa-check-circle',       color: 'bg-emerald-500', text: 'Connexion réussie ! Redirection...' },
  error:         { icon: 'fa-times-circle',       color: 'bg-red-500',     text: 'Email ou mot de passe incorrect.' },
  registered:    { icon: 'fa-check-circle',       color: 'bg-emerald-500', text: 'Compte créé ! Vérifiez votre email 📧' },
  emailexists:   { icon: 'fa-exclamation-circle', color: 'bg-amber-500',   text: 'Cet email est déjà utilisé.' },
  registererror: { icon: 'fa-times-circle',       color: 'bg-red-500',     text: auth.error || 'Erreur lors de l\'inscription.' },
  password:      { icon: 'fa-exclamation-circle', color: 'bg-orange-500',  text: 'Les mots de passe ne correspondent pas.' },
  weakpassword:  { icon: 'fa-exclamation-circle', color: 'bg-orange-500',  text: 'Le mot de passe doit faire au moins 6 caractères.' },
  empty:         { icon: 'fa-exclamation-circle', color: 'bg-orange-500',  text: 'Veuillez remplir tous les champs.' },
}
</script>

<template>
  <!-- Toast -->
  <transition name="toast">
    <div v-if="notification" :class="notifications[notification]?.color" class="fixed top-20 right-5 z-[9999] flex items-center gap-3 px-4 py-3 rounded-xl text-white shadow-xl text-sm font-medium max-w-sm">
      <i :class="['fas', notifications[notification]?.icon, 'text-lg flex-shrink-0']"></i>
      <span>{{ notifications[notification]?.text }}</span>
    </div>
  </transition>

  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 flex">

    <!-- Left panel branding -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 flex-col justify-between p-12 relative overflow-hidden">
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full"></div>
        <div class="absolute -bottom-20 -left-20 w-96 h-96 bg-white/5 rounded-full"></div>
      </div>
      <div class="relative z-10">
        <div class="flex items-center gap-3 mb-12">
          <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <i class="fas fa-graduation-cap text-white text-lg"></i>
          </div>
          <span class="text-xl font-bold text-white">HighFive<span class="text-indigo-200">Academy</span></span>
        </div>
        <h1 class="text-4xl font-extrabold text-white leading-tight mb-4">Apprenez à votre<br/>rythme, partout.</h1>
        <p class="text-indigo-200 text-lg leading-relaxed">Des centaines de cours créés par des experts pour vous aider à progresser dans votre carrière.</p>
      </div>
      <div class="relative z-10 grid grid-cols-3 gap-4">
        <div class="bg-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
          <p class="text-2xl font-bold text-white">50+</p>
          <p class="text-xs text-indigo-200 mt-1">Cours</p>
        </div>
        <div class="bg-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
          <p class="text-2xl font-bold text-white">1k+</p>
          <p class="text-xs text-indigo-200 mt-1">Étudiants</p>
        </div>
        <div class="bg-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
          <p class="text-2xl font-bold text-white">4.8★</p>
          <p class="text-xs text-indigo-200 mt-1">Note moyenne</p>
        </div>
      </div>
    </div>

    <!-- Right panel form -->
    <div class="flex-1 flex items-center justify-center p-6 sm:p-10">
      <div class="w-full max-w-md">

        <!-- Mobile logo -->
        <div class="flex items-center gap-2 mb-8 lg:hidden">
          <div class="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
            <i class="fas fa-graduation-cap text-white text-sm"></i>
          </div>
          <span class="text-lg font-bold text-slate-900 dark:text-white">HighFive<span class="text-indigo-500">Academy</span></span>
        </div>

        <!-- Tabs -->
        <div class="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 mb-8">
          <button
            @click="formState = 'connect'"
            :class="formState === 'connect' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'"
            class="flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200"
          >Connexion</button>
          <button
            @click="formState = 'disconnect'"
            :class="formState === 'disconnect' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'"
            class="flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200"
          >Inscription</button>
        </div>

        <!-- Login -->
        <transition name="form-slide" mode="out-in">
          <div v-if="formState === 'connect'" key="login">
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-1">Bon retour ! 👋</h2>
            <p class="text-slate-500 dark:text-slate-400 text-sm mb-6">Connectez-vous pour accéder à vos cours.</p>
            <form @submit.prevent="login" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                <div class="relative">
                  <i class="fas fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                  <input v-model="email" type="email" placeholder="vous@email.com" required class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 pl-10 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Mot de passe</label>
                <div class="relative">
                  <i class="fas fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                  <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••" required class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 pl-10 pr-10 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
                  <button type="button" @click="showPassword = !showPassword" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" class="text-sm"></i>
                  </button>
                </div>
              </div>
              <button
                type="submit"
                :disabled="auth.loading"
                class="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
              >
                <i v-if="auth.loading" class="fas fa-spinner fa-spin"></i>
                {{ auth.loading ? 'Connexion...' : 'Se connecter' }}
              </button>
            </form>
          </div>

          <!-- Register -->
          <div v-else key="register">
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-1">Créer un compte 🚀</h2>
            <p class="text-slate-500 dark:text-slate-400 text-sm mb-6">Rejoignez des milliers d'apprenants.</p>
            <form @submit.prevent="inscription" class="space-y-4">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Pseudo</label>
                  <input v-model="pseudoI" type="text" placeholder="pseudo" required class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nom complet</label>
                  <input v-model="fullName" type="text" placeholder="Jean Dupont" required class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                <div class="relative">
                  <i class="fas fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                  <input v-model="emailI" type="email" placeholder="vous@email.com" required class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 pl-10 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Mot de passe <span class="text-slate-400 font-normal">(min. 6 caractères)</span></label>
                <input v-model="mdp1" type="password" placeholder="••••••••" required class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirmer le mot de passe</label>
                <input v-model="mdp2" type="password" placeholder="••••••••" required class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
              </div>
              <button
                type="submit"
                :disabled="auth.loading"
                class="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
              >
                <i v-if="auth.loading" class="fas fa-spinner fa-spin"></i>
                {{ auth.loading ? 'Création...' : 'Créer mon compte' }}
              </button>
              <p class="text-xs text-slate-400 text-center">
                En vous inscrivant, vous acceptez nos <a href="#" class="text-indigo-500 hover:underline">CGU</a> et notre <a href="#" class="text-indigo-500 hover:underline">politique de confidentialité</a>.
              </p>
            </form>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(20px); }
.form-slide-enter-active, .form-slide-leave-active { transition: all 0.2s ease; }
.form-slide-enter-from { opacity: 0; transform: translateX(15px); }
.form-slide-leave-to { opacity: 0; transform: translateX(-15px); }
</style>
