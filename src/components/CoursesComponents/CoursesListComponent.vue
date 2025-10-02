<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useAuthStore, useAlertesStore } from '@/store';
const auth = useAuthStore()
const props = defineProps({
    tabCourses: Array
});

const router = useRouter();
const emit = defineEmits(['show-details']);

const connecter = ref(false);
const utilisateur = ref(null);
const admin = ref(false);

function updateAuthState() {
    connecter.value = !!localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    utilisateur.value = userStr ? JSON.parse(userStr) : null;
    admin.value = utilisateur.value?.username === "moodolion";
}

// Initialisation au montage
onMounted(() => {
    updateAuthState();
    window.addEventListener('storage', updateAuthState);
});
// Nettoyage à la destruction
onUnmounted(() => {
    window.removeEventListener('storage', updateAuthState);
});



// function redirection() {
//     router.push("/auth");
// }

const store = useAlertesStore()
const filteredCourses = computed(() => {
    if (!store.searchTerm) return props.tabCourses

    return props.tabCourses.filter(course =>
        course.title.toLowerCase().includes(store.searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(store.searchTerm.toLowerCase()) ||
        course.level.toLowerCase().includes(store.searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(store.searchTerm.toLowerCase())
    )
})
</script>

<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 w-full" v-if="filteredCourses.length > 0">
        <div v-for="cours in filteredCourses" :key="cours.id"
            class="rounded-lg shadow-sm hover:shadow-md transition w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
            <img :src="cours.thumbnail" alt="Image cours"
                class="rounded-lg object-cover w-full h-48 sm:h-56 md:h-64 lg:h-72 max-w-full" />

            <div class="p-4 space-y-2">
                <span
                    class="inline-block bg-pink-600 dark:bg-pink-700 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    {{ cours.category }}
                </span>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ cours.title }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-300"><span class="font-semibold">Niveau :</span> {{
                    cours.level }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Auteur :</span> {{
                    cours.instructor }}</p>
                <div class="flex flex-col sm:flex-row gap-3 sm:gap-5">
                    <button @click="emit('show-details', cours.id)" type="button"
                        class="mt-3 text-center border border-blue-500 dark:border-pink-700 text-indigo-600 dark:text-pink-300 rounded-md p-2 text-sm font-medium hover:bg-pink-200 dark:hover:bg-pink-700 hover:border-pink-200 dark:hover:border-pink-700 hover:text-white transition">
                        Détails du cours
                    </button>
                    <router-link v-if="auth.isAuthenticated" :to="`/lessons/${cours.id}`"
                        class="mt-3 text-center border border-indigo-600 dark:border-blue-400 text-indigo-600 dark:text-blue-300 rounded-md p-2 text-sm font-medium hover:bg-blue-500 dark:hover:bg-blue-400 hover:text-white transition">
                        Commencer
                    </router-link>
                    <router-link v-else :to="{ name: 'auth' }"
                        class="mt-3 text-center border border-indigo-600 dark:border-blue-400 text-indigo-600 dark:text-blue-300 rounded-md p-2 text-sm font-medium hover:bg-blue-500 dark:hover:bg-blue-400 hover:text-white transition">
                        Commencer
                    </router-link>
                </div>
            </div>
        </div>
    </div>
    <div v-else
        class="flex justify-center items-center h-64 text-center text-2xl font-bold text-gray-700 dark:text-gray-300 w-[100%]">
        Aucun cours trouvé
    </div>

</template>

<style scoped></style>