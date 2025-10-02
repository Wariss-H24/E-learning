import quiz from '@/quizzes.json'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useQuizStore = defineStore('quiz' , () => {
    const quizzes = ref([...quiz.quizzes])

    function getQuizByCourseId(courseId){
        return quizzes.value.find( q => q.id === courseId)
    }

    //Suivi de la progression du quiz
    const currentQuestionIndex = ref(0)
    const userAnswers = ref([])
    const quizCompleted = ref(false)

    //Fonction de démarrage du quiz à mettre sur un bouton 
    function startQuiz(courseId){
        const quiz = getQuizByCourseId(courseId)
        currentQuestionIndex.value = 0
        userAnswers.value = []
        quizCompleted.value = false
        return quiz
    }

    function answerQuestion(answer){
        userAnswers.value[currentQuestionIndex.value] = answer
        currentQuestionIndex.value++
    }

    function completeQuiz(){
        quizCompleted.value = true
    }

    return {
    quizzes,
    getQuizByCourseId,
    currentQuestionIndex,
    userAnswers,
    quizCompleted,
    startQuiz,
    answerQuestion,
    completeQuiz
  }
})
