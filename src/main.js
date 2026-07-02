import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { supabase } from '@/supabase'
import { useAuthStore } from '@/store'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialiser la session Supabase avant de monter l'app
const auth = useAuthStore()
auth.init().then(() => {
  app.mount('#app')
})

// Écouter les changements de session en temps réel (login/logout/expiration)
supabase.auth.onAuthStateChange((event, session) => {
  auth.isAuthenticated = !!session
  auth.user = session?.user ?? null
})
