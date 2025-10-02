<script setup>
const connecter = ref(localStorage.getItem("token"));
const utilisateur = ref(localStorage.getItem("user"));
const admin = ref(false);
if (utilisateur.username === "moodolion") {
    admin.value = true;
} else {
    admin.value = false;
}
// if (route.params.user){
//     connecter.value=true;
// }else{
//     connecter.value=true;
// }


</script>

<template>

</template>
