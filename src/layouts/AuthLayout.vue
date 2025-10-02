<script setup>
import { ref, computed, provide } from "vue";
import { useAuthStore } from '@/store';
import { useRouter } from 'vue-router';

import bd from "../../Users.json";
import mailConfirm from "../views/mailConfirmView.vue"


// initialise EmailJS avec ta clé publique
emailjs.init("DVu2Au30trEgw5z2u");

let baseDD = ref([]);

function loadUsers() {
  const stored = localStorage.getItem('base');
  if (stored) {
    try {
      baseDD.value = JSON.parse(stored);
    } catch (e) {
      console.error("❌ Erreur JSON.parse :", e);
      // réinitialise si jamais c’est corrompu
      localStorage.removeItem('base');
      baseDD.value = bd.Users;
      localStorage.setItem('base', JSON.stringify(baseDD.value));
    }
  } else {
    baseDD.value= bd.Users;
    localStorage.setItem('base', JSON.stringify(baseDD.value));
  }
}

loadUsers();

const code=ref(''); // cet variable va contenir le code générer et sera envoyer par props au composant de vérification
const route=useRouter();
const pseudo=ref();
const mdp=ref();
let formState=ref('connect');
const cnid=ref('');
const Insid=ref('');

//variables d'inscription
const pseudoI=ref();
const entireName=ref();
const mail=ref();
const mdp1=ref();
const mdp2=ref();
//variable de notification
const showBadgeNotification=ref('oui')

// localStorage.removeItem('token', true)
function login() {
    loadUsers(); // Recharger les utilisateurs pour avoir les dernières infos
    const index=baseDD.value.findIndex((e)=>e.name===pseudo.value && e.mot===mdp.value);
    const auth = useAuthStore();
    if (index<=-1) {
        showBadgeNotification.value='j'
        let set=setTimeout(() => {
          showBadgeNotification.value='oui'
        },3000);
    } else {
        showBadgeNotification.value='r'
        let set=setTimeout(() => {
          showBadgeNotification.value='oui';
          auth.login(true, { username: pseudo.value })
          route.push({
              name:'Acceuil',
              params:{user:pseudo.value}
          })
        },3000);
    }
}


function authState() {
  const status=JSON.parse(localStorage.getItem('state'));
  if (status==='true') {
    
  }
}

//fonction d'inscription
function inscription(){
        loadUsers(); // Recharger les utilisateurs pour s'assurer que la vérification est à jour
        if ((pseudoI.value!=="") && (entireName.value!=="") && (mail.value!=="") && (mdp1.value!=="") && (mdp2.value!=="")) {
            if (mdp1.value===mdp2.value) {
                const existingPseudo=baseDD.value.findIndex((e)=>e.name===pseudoI.value);
                const existingMail=baseDD.value.findIndex((e)=>e.email===mail.value);
                if (existingPseudo!== -1) {
                    showBadgeNotification.value='p'
                    let set=setTimeout(() => {
                      showBadgeNotification.value='oui'
                    },3000);
                }else if(existingMail!== -1){
                  showBadgeNotification.value='mail'
                  let set=setTimeout(() => {
                    showBadgeNotification.value='oui'
                  },3000);
                }else{ 
                    const newUser={
                        name:pseudoI.value,
                        mot:mdp1.value,
                        nomEntier:entireName.value,
                        email:mail.value,
                    }
                    baseDD.value.push(newUser);
                    localStorage.setItem("base", JSON.stringify(baseDD.value));
                    console.log("base après inscription :", JSON.parse(localStorage.getItem('base')));
                    
                    // formState.value='connect'; ici on revient au formulaire de connexion si inscription réussie
                    showBadgeNotification.value='ir'
                    let set=setTimeout(() => {
                      showBadgeNotification.value='oui'
                      route.push({
                          name:'confirm',
                          params:{user:pseudoI.value}
                      })
                    },3000);
                }
                
            } else {
                  showBadgeNotification.value='ie'
                  let set=setTimeout(() => {
                    showBadgeNotification.value='oui'
                  },3000);
            }
        } else {
            showBadgeNotification.value='ch'
                  let set=setTimeout(() => {
                    showBadgeNotification.value='oui'
                  },3000);
        }
    const newUser={}
}


// export const confirm = defineStore('val', () => {
  
//   const courses = ref([...data.courses])
//   let idNew = 200;


//   //Fonction pour ajouter un cours
//   function addCourse(course){
//     const courseToAdd = {...course , id:idNew++}
//     courses.value.unshift(courseToAdd)
//   }
  
//   //Fonction pour modifier un cours
//   function updateCourse(course){
//     courses.value = courses.value.map(c => c.id === course.id ? {...course} : c)
//   }

//   //Fonction  pour 
//   function removeCourse(id) {
//     courses.value = courses.value.filter(c => c.id !== id)
//   }

//   return { courses, addCourse, updateCourse, removeCourse }
// })

</script>

<template>


<!-- Notification -->
  <Transition name="slide-fade">
      <div v-if="showBadgeNotification==='r'"
        class="fixed top-20 right-5 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 flex items-center">
        <svg class="w-8 h-8 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.33 14.414l-3.535-3.536 1.414-1.414L10.67 13.586l5.657-5.657 1.414 1.414-7.07 7.071z">
          </path>
        </svg>
        <div>
          <p class="font-bold">🤩Félicitations !</p>
          <p>Connexion réussi</p>
        </div>
      </div>
    </Transition>

    <!-- Notification élément existant -->
  <Transition name="slide-fade">
      <div v-if="showBadgeNotification==='j'"
        class="fixed top-20 right-5 bg-yellow-500 text-white p-4 rounded-lg shadow-lg z-50 flex items-center">
        <svg class="w-8 h-8 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.33 14.414l-3.535-3.536 1.414-1.414L10.67 13.586l5.657-5.657 1.414 1.414-7.07 7.071z">
          </path>
        </svg>
        <div>
          <p class="font-bold">Aie Aie😓😓 !</p>
          <p>Compte inexistant!! inscrivez-vous ou vérifiez vos informations</p>
        </div>
      </div>
    </Transition>





    <!-- Notification Pseudo déjà prit -->
  <Transition name="slide-fade">
      <div v-if="showBadgeNotification==='p'"
        class="fixed top-20 right-5 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50 flex items-center">
        <svg class="w-8 h-8 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.33 14.414l-3.535-3.536 1.414-1.414L10.67 13.586l5.657-5.657 1.414 1.414-7.07 7.071z">
          </path>
        </svg>
        <div>
          <p class="font-bold">Désolé😓 !</p>
          <p>Nom d'utilisateur déjà prit</p>
        </div>
      </div>
    </Transition>


    <!-- Notification Mail déjà prit-->
  <Transition name="slide-fade">
      <div v-if="showBadgeNotification==='mail'"
        class="fixed top-20 right-5 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50 flex items-center">
        <svg class="w-8 h-8 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.33 14.414l-3.535-3.536 1.414-1.414L10.67 13.586l5.657-5.657 1.414 1.414-7.07 7.071z">
          </path>
        </svg>
        <div>
          <p class="font-bold">Désolé😓 !</p>
          <p>Mail déjà utilisé</p>
        </div>
      </div>
    </Transition>



  <!-- Notification inscription réussi -->
  <Transition name="slide-fade">
      <div v-if="showBadgeNotification==='ir'"
        class="fixed top-20 right-5 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 flex items-center">
        <svg class="w-8 h-8 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.33 14.414l-3.535-3.536 1.414-1.414L10.67 13.586l5.657-5.657 1.414 1.414-7.07 7.071z">
          </path>
        </svg>
        <div>
          <p class="font-bold">Bravo 😎‼</p>
          <p>Inscription Réussie {{pseudoI.value}}</p>
        </div>
      </div>
    </Transition>


  <!-- Notification inscription Echoué -->
  <Transition name="slide-fade">
      <div v-if="showBadgeNotification==='ie'"
        class="fixed top-20 right-5 bg-orange-500 text-white p-4 rounded-lg shadow-lg z-50 flex items-center">
        <svg class="w-8 h-8 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.33 14.414l-3.535-3.536 1.414-1.414L10.67 13.586l5.657-5.657 1.414 1.414-7.07 7.071z">
          </path>
        </svg>
        <div>
          <p class="font-bold">Ewoo boss 😎‼</p>
          <p>Mot de passe non conforme</p>
        </div>
      </div>
    </Transition>


  <!-- Notification inscription Echoué -->
  <Transition name="slide-fade">
      <div v-if="showBadgeNotification==='ch'"
        class="fixed top-20 right-5 bg-orange-500 text-white p-4 rounded-lg shadow-lg z-50 flex items-center">
        <svg class="w-8 h-8 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.33 14.414l-3.535-3.536 1.414-1.414L10.67 13.586l5.657-5.657 1.414 1.414-7.07 7.071z">
          </path>
        </svg>
        <div>
          <p class="font-bold">Pardon Boss 😥‼</p>
          <p>Faut remplir tout les champs</p>
        </div>
      </div>
    </Transition>



  <div class="fixed inset-0 flex items-center justify-center bg-[#f7f8fa] dark:bg-[#23272f]">
    <div class="flex flex-row items-center justify-center w-full max-w-3xl mx-auto">
      <div class="flex-shrink-0 flex items-center justify-center h-full">
        <img src="../assets/image/aunthentication/st1removebg-preview.png" alt="" style="max-width:220px; height:auto;" />
      </div>
      <div class="para flex items-center justify-center mx-4">
        <transition name="para">
          <div class="flex justify-center items-center rounded-4xl bg-[#eaeaeeaf]">
            <div class="form">
              <div
                class="flex h-[50px] w-[50px] text-center text-2xl p-[60px] bg-blue-500 dark:bg-blue-600 text-white rounded-b-3xl shadow-[1px_5px_50px_rgba(0,0,0,0.25)]">
              </div>
<!-- Formulaire de connexion -->
                <transition name="slide-fadeI">
                      <div class="duration-[1s]" v-if="formState === 'connect'">
                      <form  @submit.prevent="login">
                        <div>
                          <input class="bg-bgColor " v-model="pseudo" name="pseudo" type="text" placeholder="Nom d'utilisateur"
                            required>
                        </div>
                        <div>
                          <input class="bg-bgColor " v-model="mdp" name="mdp" type="password" placeholder="Mot de passe" required>
                        </div>
                        <div style="display:flex; justify-content: space-between;">
                          <p><a>Mot de passe oublié</a></p>
                          <div @click="formState = 'disconnect'" class="text-blue-500 dark:text-blue-600">S'inscrire?</div>
                        </div>
                        <button type="submit" class="bg-blue-500 dark:bg-blue-600">Se connecter</button>
                      </form>
                    </div>
                </transition>
<!--fin Formulaire de connexion -->

<!-- Formulaire d'inscription -->
                <transition name="slide-fade">
                    <div class="duration-[1s]" v-if="formState === 'disconnect'">
                    <form @submit.prevent="inscription">
                      <div>
                        <input class="bg-bgColor " v-model="pseudoI" name="pseudo" type="text" placeholder="Nom d'utilisateur"
                          required>
                      </div>
                      <div>
                        <input class="bg-bgColor " v-model="entireName" name="name" type="text" placeholder="Nom complet"
                          required>
                      </div>
                      <div>
                        <input class="bg-bgColor " v-model="mail" name="mdp" type="email" placeholder="Mail" required>
                      </div>
                      <div>
                        <input class="bg-bgColor " v-model="mdp1" name="mdp" type="password" placeholder="Mot de passe" required>
                      </div>
                      <div>
                        <input class="bg-bgColor " v-model="mdp2" name="mdp2" type="password"
                          placeholder="Confirmez le mot de passe" required>
                      </div>
                      <div @click="formState = 'connect'" class="self-end mr-[50px] text-blue-500 dark:text-blue-400" :id="Insid">Connexion</div>
                      <button type="submit"  class="bg-blue-500 dark:bg-blue-600">Inscription</button>
                    </form>
                  </div>
                </transition>
<!--fin Formulaire d'inscription -->

              </div>
            </div>
          </transition>
          </div>
      </div>
      <div class="flex-shrink-0 flex items-center justify-center h-full">
        <img src="../assets/image/aunthentication/st2removebg-preview.png" alt="" style="max-width:200px; height:auto;" />
      </div>
    </div>

</template>



<style scoped>
.para-active{
  transition: all 0.5s;
}
/* transition formulaire de connexion */
.slide-fadeI-enter-active {
  /* transition-delay: 0.5s; */
  transition: all 2s;
}

.slide-fadeI-leave-active {
  transition: all 0s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fadeI-enter-from,
.slide-fadeI-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

/* transition formulaire d'inscription */

.slide-fade-enter-active {
  transition: all 2s;
  /* transition-delay: 0.5s; */
}

.slide-fade-leave-active {
  transition: all 0s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

/* .page{
  height: 100vh;
  width: 100vw;
} */
.page>div {
  display: flex;
  align-items: center;
  justify-content: center;
}

.para {
  min-width: 350px;
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
}

.layout {
  display: flex;
  justify-content: center;
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(97, 81, 81, 0.541);
}

form {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 350px;
  padding: 20px;
}

form input {
  font-size: 1.5rem;
  height: 60px;
  width: 100%;
  border-radius: 15px;
  padding: 12px;
  z-index: 2;
  outline: none;
}

form label {
  font-size: 1.5rem;
  padding: 12px;
}

button {
  font-size: 1.8rem;
  position: relative;
  color: white;
  left: 15%;
  top: 50px;
  width: 70%;

  height: 50px;
  border-bottom-left-radius: 250px;
  border-bottom-right-radius: 250px;
  box-shadow: inset 0 -10px 20px 1px rgba(97, 81, 81, 0.541);
}
</style>
