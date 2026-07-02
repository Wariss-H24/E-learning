import { defineStore } from 'pinia'
import data from '@/newCourses.json'
import { ref } from 'vue'
import { supabase } from '@/supabase'

export const useAlertesStore = defineStore('courses', () => {
  const courses = ref([...data.courses])
  let idNew = 200

  const isOpen = ref(false)

  const searchTerm = ref('')

  //Fonction pour ouvrir et fermer le menu
  function toggleMenu() {
    isOpen.value = !isOpen.value
  }

  //Fonction pour ajouter un cours
  function addCourse(course) {
    const courseToAdd = { ...course, id: idNew++ }
    courses.value.unshift(courseToAdd)
  }

  //Fonction pour modifier un cours
  function updateCourse(course) {
    courses.value = courses.value.map((c) => (c.id === course.id ? { ...course } : c))
  }

  //Fonction  pour
  function removeCourse(id) {
    courses.value = courses.value.filter((c) => c.id !== id)
  }
  //Fonction pour filtrer automatiquement les cours 
  function setSearchTerm(term){
    searchTerm.value = term
  }


  return { courses, addCourse, updateCourse, removeCourse, isOpen, toggleMenu,searchTerm,setSearchTerm }
})


export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
  }),
  actions: {
    // appelé au démarrage de l'app pour récupérer la session Supabase
    async init() {
      const { data: { session } } = await supabase.auth.getSession()
      this.isAuthenticated = !!session
      this.user = session?.user ?? null
    },
    async login(email, password) {
      this.loading = true
      this.error = null
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        this.error = error.message
        this.loading = false
        return false
      }
      this.isAuthenticated = true
      this.user = data.user
      this.loading = false
      return true
    },
    async register(email, password, username, fullName) {
      this.loading = true
      this.error = null
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username, full_name: fullName } }
      })
      if (error) {
        this.error = error.message
        this.loading = false
        return false
      }
      this.loading = false
      return true
    },
    async logout() {
      await supabase.auth.signOut()
      this.isAuthenticated = false
      this.user = null
    },
  }
})