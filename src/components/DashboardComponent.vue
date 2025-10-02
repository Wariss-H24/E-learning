<script setup>
import ImageDashboard from '@/assets/image/Dasboard/profil.jpg'
import HistoryWatch from './HistoryWatch.vue'
import BadgesComponent from './BadgesComponent.vue';
import { ref, onMounted, computed } from 'vue';
import allCourses from '@/newCourses.json';
import { useRoute } from 'vue-router';
//image reactive avec une ilage par defaut
const profileImag = ref("https://cdn-icons-png.flaticon.com/512/1946/1946429.png")

const Apear = ref(false)
const DisApear = ref(true)
/**Functin pour afficher le formulaire de modification */
function DisApeared() {
    DisApear.value = false
    Apear.value = true
}

const saveuser = ref(null);
const modifiedUser = ref(null);

onMounted(() => {
  const storedUser = localStorage.getItem('base');
  const currentUser = JSON.parse(localStorage.getItem('user'));
  console.log(currentUser);
  
  if (storedUser && currentUser) {
    try {
      const users = JSON.parse(storedUser); // tableau d'utilisateurs
      const foundUser = users.find(e => e.name === currentUser.username);
      //veri
      if (foundUser) {
        saveuser.value = { ...foundUser };
        modifiedUser.value = { ...foundUser }; // Initialise les données pour la modification
      }

      // prend le premier utilisateur
    } catch (a) {
      console.error("Erreur de parsing JSON", a);
    }
  }
});



/** Fonction pour enregistrer les modifications du profil */
function saveProfile() {
  const storedUsers = localStorage.getItem('base');
  if (storedUsers && saveuser.value) {
    try {
      let users = JSON.parse(storedUsers);
      const userIndex = users.findIndex(u => u.name === saveuser.value.name);

      if (userIndex !== -1) {
        // Mettre à jour les informations de l'utilisateur
        users[userIndex] = { ...users[userIndex], ...modifiedUser.value };
        localStorage.setItem('base', JSON.stringify(users));
        saveuser.value = { ...modifiedUser.value }; // Mettre à jour l'affichage

        // Cacher le formulaire après la sauvegarde
        Apear.value = false;
        DisApear.value = true;
      }
    } catch (e) {
      console.error("Erreur lors de la sauvegarde du profil :", e);
    }
  }
}
// const previewImage = (event) => {
//   const file = event.target.files[0];
//   if (file) {
//     const imageUrl = URL.createObjectURL(file);
//     profileImag.value = imageUrl;
 // image choisie dans le local
//     localStorage.setItem("image", imageUrl);
//   }
// };

// Fonction pour choisir l'image et l'enregistrer de façon permanente
const previewImage = (event) => {
  const file = event.target.files[0];
  console.log(file);
  /**restreindre le fichier selectioner */
  if (file && (file.type==="image/png" || file.type==="image/jpg" || file.type==="image/jpeg" || file.type==="image/gif" || file.type==="image/webp" || file.type==="image/svg" || file.type==="image/tiff")) {
    const reader = new FileReader();
    reader.onload = (e) => {
      profileImag.value = e.target.result;
    //    Base64 de l'image
      localStorage.setItem("image", e.target.result); 
    //   Sauvegarde permanente
    };
    reader.readAsDataURL(file); 
    // Conversion du fichier en base64
  }
};
 
 
onMounted(() => {
  const savedImage = localStorage.getItem("image");
  if (savedImage) {
    profileImag.value = savedImage;
  }
  
});


// onMounted(() => {
//   const savedImage = localStorage.getItem("image");
//   if (savedImage) {
//     profileImag.value = savedImage;
//   }
// });

const gadgesDiv = ref("gadgesDiv")

const courseHistory = ref([]);

onMounted(() => {
    const history = JSON.parse(localStorage.getItem('courseHistory') || '{}');
    courseHistory.value = Object.values(history);
});

const completedCoursesCount = computed(() => {
    return courseHistory.value.filter(c => c.statut === 'Terminé').length;
});

const badgeDefinitions = {
    'Développement Web': {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M323-160q-11 0-20.5-5.5T288-181l-78-139h58l40 80h92v-40h-68l-40-80H188l-57-100q-2-5-3.5-10t-1.5-10q0-4 5-20l57-100h104l40-80h68v-40h-92l-40 80h-58l78-139q5-10 14.5-15.5T323-800h97q17 0 28.5 11.5T460-760v160h-60l-40 40h100v120h-88l-40-80h-92l-40 40h108l40 80h112v200q0 17-11.5 28.5T420-160h-97Zm217 0q-17 0-28.5-11.5T500-200v-200h112l40-80h108l-40-40h-92l-40 80h-88v-120h100l-40-40h-60v-160q0-17 11.5-28.5T540-800h97q11 0 20.5 5.5T672-779l78 139h-58l-40-80h-92v40h68l40 80h104l57 100q2 5 3.5 10t1.5 10q0 4-5 20l-57 100H668l-40 80h-68v40h92l40-80h58l-78 139q-5 10-14.5 15.5T637-160h-97Z"/></svg>`,
        levels: [
            { required: 5, name: 'Maître du Code', description: 'Vous aviez Terminez 5+ cours de Développement Web' },
            { required: 3, name: 'Artisan du Web', description: 'Vous aviez Terminez 3 cours de Développement Web' },
            { required: 2, name: 'Apprenti du Web', description: 'Vous aviez Terminez 2 cours de Développement Web' }
        ]
    },
    'Programmation': {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M800-80H560q-17 0-28.5-11.5T520-120v-240q0-17 11.5-28.5T560-400h240q17 0 28.5 11.5T840-360v80l80-80v240l-80-80v80q0 17-11.5 28.5T800-80ZM480-480Zm2-140q-58 0-99 41t-41 99q0 48 27 84t71 50v-90q-8-8-13-20.5t-5-23.5q0-25 17.5-42.5T482-540q25 0 42 17.5t17 42.5h81q0-58-41-99t-99-41ZM370-80l-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v13.5h-80q-1-19-3-33.5t-6-27.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q24 25 54 42t65 22v184h-70Z"/></svg>`,
        levels: [
            { required: 5, name: 'Architecte Logiciel', description: 'Vous aviez Terminez 5+ cours de Programmation' },
            { required: 3, name: 'Développeur Confirmé', description: 'Vous aviez Terminez 3 cours de Programmation' },
            { required: 2, name: 'Apprenti Développeur', description: 'Vous aviez Terminez 2 cours de Programmation' }
        ]
    },
    'Data & IA': {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480v320q0 33-23.5 56.5T800-80H480Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 23 3 45t9 43l148-148 132 111 131-131h-63v-80h200v200h-80v-63L456-320 325-432 207-314q42 69 113.5 111.5T480-160Zm300 20q17 0 28.5-11.5T820-180q0-17-11.5-28.5T780-220q-17 0-28.5 11.5T740-180q0 17 11.5 28.5T780-140ZM455-480Z"/></svg>`,
        levels: [
            { required: 5, name: 'Star de l\'IA', description: 'Vous aviez Terminez 5+ cours de Data & IA' },
            { required: 3, name: 'Analyste de Données', description: 'Vous aviez Terminez 3 cours de Data & IA' },
            { required: 2, name: 'Explorateur de Données', description: 'Vous aviez Terminez 2 cours de Data & IA' }
        ]
    },
    'Design': {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-160q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740v484q51-32 107-48t113-16q36 0 70.5 6t69.5 18v-480q15 5 29.5 10.5T898-752q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59Zm80-200v-380l200-200v400L560-360Zm-160 65v-396q-33-14-68.5-21.5T260-720q-37 0-72 7t-68 21v397q35-13 69.5-19t70.5-6q36 0 70.5 6t69.5 19Zm0 0v-396 396Z"/></svg>`,
        levels: [
            { required: 5, name: 'Maître du Design', description: 'Vous aviez Terminez 5+ cours de Design' },
            { required: 3, name: 'Designer Aguerri', description: 'Vous aviez Terminez 3 cours de Design' },
            { required: 2, name: 'Créatif en Herbe', description: 'Vous aviez Terminez 2 cours de Design' }
        ]
    },
};

const earnedBadges = computed(() => {
    const badges = [];
    const completedCourses = courseHistory.value
        .filter(c => c.statut === 'Terminé')
        .map(historyCourse => allCourses.courses.find(c => c.id === historyCourse.id))
        .filter(Boolean);

    const categoryCounts = completedCourses.reduce((acc, course) => {
        acc[course.category] = (acc[course.category] || 0) + 1;
        return acc;
    }, {});

    for (const category in categoryCounts) {
        if (badgeDefinitions[category]) {
            const count = categoryCounts[category];
            const definition = badgeDefinitions[category];
            // Trouve le plus haut niveau de badge atteint pour cette catégorie
            const earnedLevel = definition.levels.find(level => count >= level.required);
            if (earnedLevel) {
                badges.push({
                    ...earnedLevel,
                    category: category,
                    icon: definition.icon
                });
            }
        }
    }
    return badges;
});

const totalLearningHours = computed(() => {
    let totalMinutes = 0;
    courseHistory.value.forEach(historyCourse => {
        const courseDetails = allCourses.courses.find(c => c.id === historyCourse.id);
        if (courseDetails && courseDetails.duration) {
            const durationStr = courseDetails.duration;
            let courseMinutes = 0;
            if (durationStr.includes('h')) {
                const parts = durationStr.split('h');
                courseMinutes += parseInt(parts[0], 10) * 60;
                if (parts[1] && parts[1].includes('min')) {
                    courseMinutes += parseInt(parts[1].replace('min', '').trim(), 10);
                }
            } else if (durationStr.includes('min')) {
                courseMinutes += parseInt(durationStr.replace('min', '').trim(), 10);
            }
            totalMinutes += courseMinutes;
        }
    });
    return Math.floor(totalMinutes / 60);
});

</script>

<template>
    <div class="px-4 sm:px-6 lg:px-8 m-auto max-w-7xl bg-white dark:bg-[#23272f] transition-colors duration-300">

        <div>
            <h1 class="font-bold text-2xl sm:text-3xl pt-5 dark:text-blue-100">Mon profil</h1>
            <div class="flex flex-col md:flex-row gap-6 items-center px-4 sm:px-6 md:px-10 my-10 border-para1Color/opacity-20 py-4 shadow rounded-[20px] bg-white dark:bg-[#65676b80] transition-colors duration-300">
                <div class="flex-shrink-0">
                    <div class="w-28 h-28">
                        <!-- input file caché -->
                        <input id="upload" type="file" accept="image/jpg,image/jpeg,image/png" class="hidden" @change="previewImage" />

                        <!-- image cliquable -->
                        <label for="upload" class="cursor-pointer relative">
                            <img :src="profileImag" class="w-full h-full rounded-full object-cover" alt="Image de profil" />
                            <div class="absolute bottom-8 right-[-10px]">
                                <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill=""><path d="M440-440ZM120-120q-33 0-56.5-23.5T40-200v-480q0-33 23.5-56.5T120-760h126l74-80h240v80H355l-73 80H120v480h640v-360h80v360q0 33-23.5 56.5T760-120H120Zm640-560v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80ZM440-260q75 0 127.5-52.5T620-440q0-75-52.5-127.5T440-620q-75 0-127.5 52.5T260-440q0 75 52.5 127.5T440-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Z"/></svg>
                            </div>
                        </label>
                    </div>
                </div>
                <div class="flex-grow w-full " >
                    <div v-if="saveuser">


                        <p class="font-semibold"> {{ saveuser.name }}</p>
                        <h2   class="font-bold text-[20px] mb-1 dark:text-blue-100">{{ saveuser.nomEntier }} </h2>
                        <div>
                            <small class="text-para1Color dark:text-gray-400">{{ saveuser.email }}{{ saveuser.username }}</small>
                        </div>
                    </div>
                    <button
                        class="border-[1px] border-[#DEE1E6FF] dark:border-[#3a4152] font-medium text-[12px] px-[15px] py-[8px] my-[5px] rounded-[5px] mt-[10px] cursor-pointer dark:bg-[#23272f] dark:text-blue-100"
                        v-if="DisApear" @click="DisApeared">Modifier le profil</button>
                    <form class="w-full max-w-sm grid gap-4 my-4" v-if="Apear" @submit.prevent="saveProfile">
                        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <label for="name" class="font-medium mb-1 sm:mb-0 dark:text-blue-100">Nom Complet :</label>
                            <input
                                class="border-[1px] w-full sm:w-[230px] outline-none rounded border-gray/10 px-2 py-1 border-para1Color/20 dark:bg-[#23272f] dark:text-blue-100 dark:border-[#3a4152]"
                                type="text" name="name" id="name" v-model="modifiedUser.nomEntier">
                        </div>
                        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <label for="prenom" class="font-medium mb-1 sm:mb-0 dark:text-blue-100">Profile D'utilisateur:</label>
                            <input
                                class="border-[1px] w-full sm:w-[230px] border-para1Color/20 rounded outline-none px-2 py-1 items-center dark:bg-[#23272f] dark:text-blue-100 dark:border-[#3a4152]"
                                type="text" name="prenom" id="prenom" v-model="modifiedUser.name" readonly >
                        </div>
                        <div class="flex justify-end">
                            <button type="submit" class="text-white dark:text-blue-100 text-center font-medium px-4 py-2 bg-blue-500/80 dark:bg-blue-700 rounded-lg shadow hover:bg-blue-600 dark:hover:bg-blue-800 transition">
                                Enregistrer les modifications
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div>
                <!-- Statistiques -->
                <h2 class="font-bold text-[20px] my-5 dark:text-blue-100">Statistiques d'apprentissage</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-center">
                    <div class="p-4 hover:scale-95 transition duration-3000 ease-in-out rounded-lg bg-white dark:bg-[#2c3140] shadow-[0_0_5px_rgba(0,0,0,0.3)] flex flex-col justify-center items-center h-[152px]">
                        <div class="flex justify-center items-center ">
                            <svg class="text-blueColor text-center" fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                                <path
                                    d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q8 0 15 1.5t14 4.5l-74 74H200v560h560v-266l80-80v346q0 33-23.5 56.5T760-120H200Zm261-160L235-506l56-56 170 170 367-367 57 55-424 424Z" />
                            </svg>
                        </div>
                        <span class="text-blueColor dark:text-blue-300">{{ completedCoursesCount }}</span>
                        <span class="text-para1Color dark:text-gray-400 text-xs uppercase font-medium">COURS TERMINÉS</span>
                    </div>
                    <div class="p-4 hover:scale-110 transition duration-3000 ease-in-out rounded-lg bg-white dark:bg-[#2c3140] shadow-[0_0_5px_rgba(0,0,0,0.3)] flex flex-col justify-center items-center h-[152px]">
                        <div class="flex justify-center items-center ">
                            <svg class="text-blueColor flex-col" xmlns="http://www.w3.org/2000/svg" height="24px"
                                viewBox="0 -960 960 960" width="24px" fill="currentColor">
                                <path
                                    d="M320-160h320v-120q0-66-47-113t-113-47q-66 0-113 47t-47 113v120Zm160-360q66 0 113-47t47-113v-120H320v120q0 66 47 113t113 47ZM160-80v-80h80v-120q0-61 28.5-114.5T348-480q-51-32-79.5-85.5T240-680v-120h-80v-80h640v80h-80v120q0 61-28.5 114.5T612-480q51 32 79.5 85.5T720-280v120h80v80H160Z" />
                            </svg>
                        </div>
                        <span class="text-blueColor dark:text-blue-300">{{ totalLearningHours }}</span>
                        <span class="text-para1Color dark:text-gray-400 text-xs uppercase font-medium">Heures d'apprentissage</span>
                    </div>
                    <div class="p-4 hover:scale-101 duration-3000 rounded-lg bg-white dark:bg-[#2c3140] shadow-[0_0_5px_rgba(0,0,0,0.3)] flex flex-col justify-center items-center h-[152px]">
                        <div class="flex justify-center items-center ">
                            <svg class="text-blueColor" xmlns="http://www.w3.org/2000/svg" height="24px"
                                viewBox="0 -960 960 960" width="24px" fill="currentColor">
                                <path
                                    d="M480-440q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35ZM240-40v-309q-38-42-59-96t-21-115q0-134 93-227t227-93q134 0 227 93t93 227q0 61-21 115t-59 96v309l-240-80-240 80Zm240-280q100 0 170-70t70-170q0-100-70-170t-170-70q-100 0-170 70t-70 170q0 100 70 170t170 70ZM320-159l160-41 160 41v-124q-35 20-75.5 31.5T480-240q-44 0-84.5-11.5T320-283v124Zm160-62Z" />
                            </svg>
                        </div>
                        <span class="text-blueColor dark:text-blue-300">{{ earnedBadges.length }}</span>
                        <span class="text-para1Color dark:text-gray-400 text-xs uppercase font-medium">Badges obtenus</span>
                    </div>
                </div>
            </div>

            <!-- Bade -->
            <BadgesComponent :earned-badges="earnedBadges" />
                <HistoryWatch />
        </div>
    </div>
</template>

<style scoped>
.gadgesDiv h2 {

    font-weight: 600;
}

.gadgesDiv {
    flex-wrap: wrap;
}

.gadgesDiv p {
    color: #565D6DFF;
    font-size: 14px;

}

span:first-of-type {
    font-weight: 700;
    font-size: 35px;
    display: block;
}

.inputImg {
    position: absolute;

}
</style>
