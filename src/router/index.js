import { createRouter, createWebHistory} from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import AdminView from '@/views/AdminView.vue'
import DashboardComponent from '@/components/DashboardComponent.vue'
import MailConfirm from '@/views/mailConfirmView.vue'

import AboutUsView from '@/views/AboutUsView.vue'

const routes= [
  {
    path: '/',
      name: 'Acceuil',
      component: MainLayout,
    },
     {
      path: '/lessons/:id',
      name: 'lessons',
      component: () => import('@/views/ProductLessonsViews.vue')
    },
     {
      path: '/lessons/:id/:user',
      name: 'lesson',
      component: () => import('@/views/ProductLessonsViews.vue')
    },
    {
     path:'/product/:id/:user',
      name:'products',
      component: () => import('@/views/ProductDetailView.vue')
    },
    {
      path: '/a-propos',
      name: 'About',
      component: AboutUsView,
    },
    {
      path: '/admin',
      name: 'Admin',
      component: AdminView,
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../layouts/AuthLayout.vue'),
    },
    // {
    //   path: '/',
    //   name: '',
    //   // component: () => import('../views/AboutView.vue'),
    // },
    {
      path: '/profil',
      name: 'profil',
      component: DashboardComponent,
    },
    {
      path: '/confirm/:user',
      name: 'confirm',
      component: MailConfirm,
    },
    {
      path:'/quiz/:id',
      name:'quiz',
      component: () => import('@/views/QuizView.vue')
    },
    
    {
      path:'/quiz-section',
      name:'quiz-section',
      component: () => import('@/views/QuizSectionView.vue')
    },
    {
      path:'/admin-quiz-manager',
      name:'admin-quiz-manager',
      component: () => import('@/views/AdminQuizManager.vue')
    }
  ]
  
  const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkActiveClass : "lien-actif", //spécifie la classe CSS a appliquer aux liens actifs dans la barre de navigation.Lorsqu’un lien est actif, il recevra cette classe CSS.
  })
  router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || "null")
  // console.log(rout.params);
  
  const isAuthenticated = token === 'true' && user !== null
  // Si l'utilisateur est déjà connecté, inutile d'aller sur la page Auth
  if (to.name === 'auth' && isAuthenticated) {
    next(false) // redirige par exemple vers la page d'accueil
  }else if(to.name==='Admin' && user.username!=='moodolion'){
    next(from)
  } else {
    next()
  }
})



export default router
