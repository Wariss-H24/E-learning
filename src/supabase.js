import { createClient } from '@supabase/supabase-js'
import { setCookie, getCookie, removeCookie } from '@/cookies'

const SUPABASE_URL = 'https://ckzcpmvxkcdmhmfquvbo.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNremNwbXZ4a2NkbWhtZnF1dmJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5ODA2MjMsImV4cCI6MjA5ODU1NjYyM30.xhbOYr6I_197rNOt6Yrzv7lpDLSADq0TiAlliQk9nis'

// Adaptateur cookie pour que Supabase stocke la session en cookie (SameSite=Strict, 7 jours)
// au lieu de localStorage
const cookieStorage = {
  getItem: (key) => getCookie(key),
  setItem: (key, value) => setCookie(key, value, 7),
  removeItem: (key) => removeCookie(key),
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: cookieStorage,
    persistSession: true,
    detectSessionInUrl: true,
  }
})
