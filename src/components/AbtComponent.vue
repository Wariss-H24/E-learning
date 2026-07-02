<script setup>
import { ref, onMounted } from 'vue'
import coursesData from '@/newCourses.json'

const instructors = ref([])

onMounted(() => {
  const map = new Map()
  coursesData.courses.forEach((course) => {
    if (!map.has(course.instructor)) {
      map.set(course.instructor, {
        name: course.instructor,
        courses: [course.title],
        experience: Math.floor(Math.random() * 8) + 3,
        contact: `${course.instructor.toLowerCase().replace(/ /g, '.')}@highfive.fr`,
      })
    } else {
      map.get(course.instructor).courses.push(course.title)
    }
  })
  instructors.value = Array.from(map.values())
})

const stats = [
  { value: '50+', label: 'Cours disponibles', icon: 'fas fa-book-open' },
  { value: '1 200+', label: 'Étudiants inscrits', icon: 'fas fa-users' },
  { value: '4.8★', label: 'Note moyenne', icon: 'fas fa-star' },
  { value: '100%', label: 'En ligne & gratuit', icon: 'fas fa-globe' },
]

const values = [
  { icon: 'fas fa-rocket', title: 'Accessibilité', desc: 'Apprenez à votre rythme, depuis n\'importe quel appareil, partout dans le monde.' },
  { icon: 'fas fa-medal', title: 'Qualité', desc: 'Des cours créés par des experts du secteur avec des contenus régulièrement mis à jour.' },
  { icon: 'fas fa-certificate', title: 'Certification', desc: 'Obtenez des badges et certificats reconnus pour valoriser vos compétences.' },
]
</script>

<template>
  <div class="bg-slate-50 dark:bg-slate-900 min-h-screen">

    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 py-20 px-4">
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full"></div>
        <div class="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full"></div>
        <div class="absolute top-1/2 right-1/4 w-48 h-48 bg-white/5 rounded-full"></div>
      </div>
      <div class="relative z-10 max-w-4xl mx-auto text-center">
        <span class="inline-flex items-center gap-2 bg-white/15 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm border border-white/20">
          <i class="fas fa-graduation-cap"></i> À propos de HighFive Academy
        </span>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
          Apprenez. Progressez.<br/>
          <span class="text-indigo-200">Réussissez.</span>
        </h1>
        <p class="text-lg sm:text-xl text-indigo-100 max-w-2xl mx-auto leading-relaxed">
          Notre plateforme E-Learning vise à rendre l'apprentissage accessible à tous, partout et à tout moment. Découvrez des cours variés, suivez votre progression et apprenez avec les meilleurs formateurs.
        </p>
      </div>
    </section>

    <!-- Stats -->
    <section class="max-w-5xl mx-auto px-4 -mt-8 relative z-10 mb-16">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="stat in stats" :key="stat.label" class="bg-white dark:bg-slate-800 rounded-2xl p-5 text-center shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700">
          <div class="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
            <i :class="stat.icon" class="text-indigo-600 dark:text-indigo-400"></i>
          </div>
          <p class="text-2xl font-extrabold text-slate-900 dark:text-white">{{ stat.value }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{{ stat.label }}</p>
        </div>
      </div>
    </section>

    <!-- Nos valeurs -->
    <section class="max-w-5xl mx-auto px-4 mb-20">
      <div class="text-center mb-10">
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Nos valeurs</h2>
        <p class="text-slate-500 dark:text-slate-400">Ce qui nous guide au quotidien</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div v-for="val in values" :key="val.title" class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:-translate-y-1 transition-all duration-300">
          <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
            <i :class="val.icon" class="text-white text-lg"></i>
          </div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white mb-2">{{ val.title }}</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{{ val.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Formateurs -->
    <section class="max-w-7xl mx-auto px-4 mb-20">
      <div class="text-center mb-10">
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Nos formateurs</h2>
        <p class="text-slate-500 dark:text-slate-400">Des experts passionnés qui partagent leur savoir</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <div
          v-for="instructor in instructors"
          :key="instructor.name"
          class="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:-translate-y-1 transition-all duration-300"
        >
          <!-- Avatar -->
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0">
              {{ instructor.name.split(' ').map(n => n[0]).join('').slice(0, 2) }}
            </div>
            <div class="min-w-0">
              <p class="font-bold text-sm text-slate-900 dark:text-white truncate">{{ instructor.name }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                <i class="fas fa-briefcase mr-1 text-indigo-400"></i>{{ instructor.experience }} ans d'expérience
              </p>
            </div>
          </div>

          <!-- Cours -->
          <div class="mb-3">
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Cours enseignés</p>
            <ul class="space-y-1">
              <li v-for="course in instructor.courses.slice(0, 2)" :key="course" class="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                <i class="fas fa-play-circle text-indigo-400 mt-0.5 flex-shrink-0"></i>
                <span class="line-clamp-1">{{ course }}</span>
              </li>
              <li v-if="instructor.courses.length > 2" class="text-xs text-indigo-500 dark:text-indigo-400 font-medium pl-4">
                +{{ instructor.courses.length - 2 }} autre(s)
              </li>
            </ul>
          </div>

          <!-- Contact -->
          <a :href="`mailto:${instructor.contact}`" class="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline truncate">
            <i class="fas fa-envelope flex-shrink-0"></i>
            <span class="truncate">{{ instructor.contact }}</span>
          </a>
        </div>
      </div>
    </section>

    <!-- Promo banner -->
    <section class="max-w-5xl mx-auto px-4 mb-16">
      <div class="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-violet-700 rounded-3xl p-8 sm:p-12 text-center">
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div class="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full"></div>
          <div class="absolute -bottom-10 -left-10 w-64 h-64 bg-white/10 rounded-full"></div>
        </div>
        <div class="relative z-10">
          <span class="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-4 animate-pulse">
            <i class="fas fa-tag"></i> Offres à venir
          </span>
          <h3 class="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Promotions & Réductions bientôt disponibles !
          </h3>
          <p class="text-indigo-100 text-base sm:text-lg max-w-xl mx-auto mb-6">
            Jusqu'à <span class="font-bold text-white bg-white/20 px-2 py-0.5 rounded-lg">-80%</span> sur les nouveautés, des packs exclusifs et des badges bonus pour les premiers inscrits.
          </p>
          <RouterLink to="/auth" class="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg">
            <i class="fas fa-bell"></i> Être notifié en premier
          </RouterLink>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
