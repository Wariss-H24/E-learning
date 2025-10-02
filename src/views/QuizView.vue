<script setup>
import { useQuizStore } from '@/quizStore';
import { computed, ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { RouterLink } from 'vue-router';
import coursesData from '@/newCourses.json';



const route = useRoute()
const courseIdd = ref(route.params.id);


const courseData = coursesData.courses.find(c => c.id == courseIdd.value);
// On utilise ref() pour créer une copie réactive et modifiable du cours.
const course = ref(courseData ? JSON.parse(JSON.stringify(courseData)) : null);



const courseId = Number(route.params.id)
const quizStore = useQuizStore()
const quiz = quizStore.getQuizByCourseId(courseId)
const currentQuestionIndex = quizStore.currentQuestionIndex
console.log(quiz);
console.log(currentQuestionIndex);


const currentQuestion = computed(() => quiz?.questions[quizStore.currentQuestionIndex] || null)
const userAnswer = ref(null)

function submitAnswer() {
    quizStore.answerQuestion(userAnswer.value)
    userAnswer.value = null
    if (quizStore.currentQuestionIndex >= quiz.questions.length) {
        quizStore.completeQuiz()
    }
}

function getScore() {
    return quiz.questions.reduce((score, q, i) => score + (quizStore.userAnswers[i] === q.correct_answer ? 1 : 0), 0)
}

const passed = computed(() => getScore() >= quiz.minimum_score)

function restartQuiz() {
  quizStore.startQuiz(courseId)
  userAnswer.value = null
}

onMounted(() => {
    quizStore.startQuiz(courseId)
    userAnswer.value = null
})

watch(() => route.params.id, (newId) => {
    quizStore.startQuiz(Number(newId))
    userAnswer.value = null
})

</script>


<template>
    <div class=" text-center mt-5 ">
        <h2 class=" text-5xl">Bienvenue dans ce quiz de fin cours</h2>

    </div>
    <div class="flex justify-center items-center">
        <div v-if="quiz" class=" w-[fit-content] p-5 my-[100px] shadow-lg rounded-lg">
            <h1 class="text-2xl font-bold mb-6 text-blue-500">{{ quiz.title }}</h1>
            <div v-if="!quizStore.quizCompleted">
                <div v-if="currentQuestion">
                    <h2 class="text-lg mb-4">{{ currentQuestion.question }}</h2>
                    <div v-for="(choice, idx) in currentQuestion.choices" :key="idx"
                        class="mb-2 border border-gray-300 p-2 rounded-lg ">
                        <label :for="`choice-${idx}`" class="flex items-center gap-2">
                            <input type="radio" v-model="userAnswer" :value="choice" class="cursor-pointer"
                                :id="`choice-${idx}`"> {{ choice }}
                        </label>
                    </div>
                    <button @click="submitAnswer" :disabled="userAnswer === null"
                        class="mt-4 bg-blue-500 text-white px-4 py-2 rounded font-semibold">Suivant

                    </button>
                </div>
            </div>
            <div v-else>
                <h2 class="text-lg font-bold mb-4">Votre score : {{ getScore() }} / {{ quiz.questions.length }}</h2>
                <p v-if="passed">{{ quiz.success_message }}</p>
                <p v-else>{{ quiz.failure_message }}</p>
                
                <div class="my-5 flex flex-col items-center gap-3">
                    <router-link :to="`/lessons/${courseId}`" class="p-2 text-white font-semibold rounded-lg bg-blue-500">
                        Retour au cours
                    </router-link>
                    <button @click="restartQuiz" class="p-2 text-white font-semibold rounded-lg bg-green-500 hover:bg-blue-600 transition-all duration-300">
                        Recommencer le quiz
                    </button>
                </div>
                
                
            </div>
        </div>
        <div v-else>
            <p>Quiz non disponible pour ce cours.</p>
        </div>
    </div>


</template>


<style scoped></style>