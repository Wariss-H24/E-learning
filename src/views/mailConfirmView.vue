<script setup>
import { ref, inject } from "vue";
import { useRouter, useRoute } from "vue-router"
import * as emailjs from '@emailjs/browser';
emailjs.init("DVu2Au30trEgw5z2u");
const code = ref('')
const route = useRouter();
const maRoute = useRoute();
console.log(maRoute.params.user);
console.log(JSON.parse(localStorage.getItem('base')));

const baseDd = ref([]);
baseDd.value = JSON.parse(localStorage.getItem('base'));

const user = baseDd.value.find((e) => e.name === maRoute.params.user)
console.log(user);


const codege = ref(''); // cet variable va contenir le code générer et sera envoyer par props au composant de vérification
// fonction qui génère le code de vérification
function generateCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

// fonction d'envois de mail
function sendVerificationMail() {
  codege.value = generateCode()
  const templateParams = {
    to_email: user.email,            // remplit {{to_email}}
    userName: user.name,             // remplit {{userName}}
    confirmation_code: codege.value     // remplit {{confirmation_code}}
  };

  emailjs.send("service_w6g1alp", "template_gjdh2dp", templateParams)
    .then(function (response) {
      alert("✅ Email envoyé à " + user.email);
      console.log("SUCCESS", response.status, response.text);
    }, function (error) {
      alert("❌ Erreur lors de l'envoi");
      console.error("FAILED", error);
    });
  return codege
}

function verification() {
  if (codege.value === code.value) {
    alert('cooooooool')
    route.push({
      name: 'auth'
    })
  } else {
    alert('Mauvais code')
  }
}
if (user) sendVerificationMail();
</script>

<template>
  <!-- <div class="p-4">
    <h1 class="bg-blueColor">Salut</h1>
    <div class="bg-bgColor text-white p-4">Couleur brand</div>
    <div class="bg-redColor text-blueColor p-4">Couleur brand light</div>
    <div class="bg-[#FAFAFBFF]">Couleur brand dark</div>
  </div> -->
  <div class="fixed inset-0 flex justify-center items-center w-full h-full overflow-hidden bg-[#f7f8fa] dark:bg-[#23272f]">
    <div class="relative left-[120px] top-[-20px] z-[2] rotate-[25deg]">
      <img src="./assets/image/aunthentication/pocha-removebg-preview.png" alt="">
    </div>
  </div>
  <div class="para absolute inset-0 flex justify-center items-center overflow-hidden">
    <transition name="para">
      <div class="min-w-[400px] bg-[#eaeaeeaf] rounded-2xl p-[15px]">
        <div class="form">

          <!-- Formulaire d'inscription -->
          <transition name="slide-fade">
            <div class="duration-[1s]">
              <h1 class="text-3xl text-gray-800 ">
                **
                Vous y êtes presque
              </h1>
              <form class="py-[30px]">
                <div>
                  <p class="text-xl text-gray-500 ">
                    Veuillez entrer le code de vérification contenu dans le mail que nous avons envoyez à:<br>
                    *******************@gmail.com
                  </p>
                </div>
                <div>
                  <input v-model="code" class="bg-bgColor " type="text" placeholder="Tapez le code ici..." required>
                </div>
                <button @click.prevent="verification" class="bg-blueColor">Vérifier</button>
              </form>
            </div>
          </transition>
          <!--fin Formulaire d'inscription -->

        </div>
      </div>
    </transition>
  </div>
</template>



<style scoped>
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

.page {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 20px;
}

.page>div {
  display: flex;
  align-items: center;
  justify-content: center;
}

.para {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
}

.layout {
  display: flex;
  justify-content: center;
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(97, 81, 81, 0.541);
}

.form {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 400px;
}

h1 {
  padding-block: 30px;
}

form input {
  font-size: 1.5rem;
  height: 60px;
  width: 100%;
  border-radius: 15px;
  padding: 12px;
  outline: none;
  margin-block: 20px;
}

button {
  font-size: 1.8rem;
  color: white;
  width: 70%;
  height: 50px;
  border-radius: 40px;
  box-shadow: inset 0 -10px 20px 1px rgba(97, 81, 81, 0.541);
}
</style>
