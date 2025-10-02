import { defineStore } from 'pinia'
import data from '@/newCourses.json'
import { ref } from 'vue'
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
    isAuthenticated: !!localStorage.getItem('token'),
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  }),
  actions: {
    login(token, user) {
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      this.isAuthenticated = true
      this.user = user
    },
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.isAuthenticated = false
      this.user = null
    },
    refresh() {
      this.isAuthenticated = !!localStorage.getItem('token')
      this.user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
    }
  }
})