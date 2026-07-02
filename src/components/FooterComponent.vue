<script setup></script>

<template>
  <footer class="bg-slate-900 dark:bg-slate-950 text-slate-300 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

        <!-- Brand -->
        <div class="lg:col-span-1">
          <div class="flex items-center gap-2.5 mb-4">
            <div class="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
              <i class="fas fa-graduation-cap text-white text-sm"></i>
            </div>
            <span class="text-lg font-bold text-white">HighFive<span class="text-indigo-400">Academy</span></span>
          </div>
          <p class="text-sm text-slate-400 leading-relaxed mb-4">
            La plateforme d'apprentissage en ligne pour développer vos compétences et booster votre carrière.
          </p>
          <div class="flex gap-3">
            <a href="#" class="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all duration-200 text-sm"><i class="fab fa-twitter"></i></a>
            <a href="#" class="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all duration-200 text-sm"><i class="fab fa-linkedin-in"></i></a>
            <a href="#" class="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all duration-200 text-sm"><i class="fab fa-github"></i></a>
            <a href="#" class="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all duration-200 text-sm"><i class="fab fa-youtube"></i></a>
          </div>
        </div>

        <!-- Apprendre -->
        <div>
          <h4 class="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Apprendre</h4>
          <ul class="space-y-2.5">
            <li><RouterLink to="/" class="text-sm text-slate-400 hover:text-indigo-400 transition-colors duration-200">Tous les cours</RouterLink></li>
            <li><RouterLink to="/quiz-section" class="text-sm text-slate-400 hover:text-indigo-400 transition-colors duration-200">Quiz & Évaluations</RouterLink></li>
            <li><a href="#" class="text-sm text-slate-400 hover:text-indigo-400 transition-colors duration-200">Certifications</a></li>
            <li><a href="#" class="text-sm text-slate-400 hover:text-indigo-400 transition-colors duration-200">Parcours guidés</a></li>
          </ul>
        </div>

        <!-- Ressources -->
        <div>
          <h4 class="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Ressources</h4>
          <ul class="space-y-2.5">
            <li><RouterLink to="/a-propos" class="text-sm text-slate-400 hover:text-indigo-400 transition-colors duration-200">À propos</RouterLink></li>
            <li><a href="#" class="text-sm text-slate-400 hover:text-indigo-400 transition-colors duration-200">Blog</a></li>
            <li><a href="#" class="text-sm text-slate-400 hover:text-indigo-400 transition-colors duration-200">Formateurs</a></li>
            <li><a href="#" class="text-sm text-slate-400 hover:text-indigo-400 transition-colors duration-200">Aide & Support</a></li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div>
          <h4 class="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Newsletter</h4>
          <p class="text-sm text-slate-400 mb-3">Recevez les nouveaux cours et offres en avant-première.</p>
          <div class="flex gap-2">
            <input
              type="email"
              placeholder="votre@email.com"
              class="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
            />
            <button class="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-xs text-slate-500">© {{ new Date().getFullYear() }} HighFive Academy. Tous droits réservés.</p>
        <div class="flex gap-5">
          <a href="#" class="text-xs text-slate-500 hover:text-slate-300 transition-colors">Confidentialité</a>
          <a href="#" class="text-xs text-slate-500 hover:text-slate-300 transition-colors">CGU</a>
          <a href="#" class="text-xs text-slate-500 hover:text-slate-300 transition-colors">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
</template>
