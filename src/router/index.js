import { createRouter, createWebHistory} from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import AdminView from '@/views/AdminView.vue'
import DashboardComponent from '@/components/DashboardComponent.vue'
import MailConfirm from '@/views/mailConfirmView.vue'
import AboutUsView from '@/views/AboutUsView.vue'
import { supabase } from '@/supabase'

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
      path: '/cours',
      name: 'cours',
      component: () => import('@/views/ProductsView.vue'),
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
      meta: { requiresAuth: true },
    },
    {
      path: '/confirm/:user',
      name: 'confirm',
      component: MailConfirm,
    },
    {
      path: '/auth/callback',
      name: 'auth-callback',
      component: MailConfirm,
    },
    {
      path: '/auth/callback',
      name: 'auth-callback',
      component: MailConfirm,
    },
    {
      path: '/parametres',
      name: 'parametres',
      component: () => import('@/views/ParametresView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path:'/quiz/:id',
      name:'quiz',
      component: () => import('@/views/QuizView.vue'),
      meta: { requiresAuth: true },
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
  // Ensure the page scrolls to top on navigation (and restore saved position on back/forward)
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { left: 0, top: 0 }
  }
  })
  router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession()
  const isAuthenticated = !!session
  const user = session?.user

  if (to.name === 'auth' && isAuthenticated) {
    next({ name: 'Acceuil' })
  } else if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'auth' })
  } else if (to.name === 'Admin' && user?.user_metadata?.username !== 'wariss_ia') {
    next(from)
  } else {
    next()
  }
})

router.afterEach(() => {
  window.requestAnimationFrame(() => {
    window.scrollTo({ left: 0, top: 0, behavior: 'auto' })
  })
})

export default router
