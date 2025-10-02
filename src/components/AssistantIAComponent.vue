<script setup>
import { ref, watch } from 'vue'
import coursesData from '@/newCourses.json'

const isOpen = ref(false)
const input = ref('')
const messages = ref(JSON.parse(localStorage.getItem('chat-history')) || [])
const loading = ref(false)
const error = ref('')

const OPENROUTERAPI = import.meta.env.VITE_OPENROUTER_API_KEY

watch(
  messages,
  (val) => {
    localStorage.setItem('chat-history', JSON.stringify(val))
  },
  { deep: true },
)

function toggleChat() {
  isOpen.value = !isOpen.value
}

async function send() {
  if (!input.value.trim()) return
  const userMsg = input.value.trim()

  // Ajouter le message utilisateur dans l'historique
  messages.value.push({ role: 'user', text: userMsg })
  input.value = ''
  loading.value = true
  error.value = ''

  // Préparer un résumé des cours
  const courseSummary = coursesData.courses.slice(0, 20).map((c) => ({
    titre: c.title,
    formateur: c.instructor,
    prix: c.price,
    durée: c.duration,
    nbLeçons: c.lessons?.length || 0,
  }))

  try {
    // Construire le tableau messages pour l'API
    const apiMessages = [
      {
        // expliquer le contexte a l'ia
        // limiter la porter des reponses(ethique, texte long)
        role: 'system',
        content: `Voici un résumé de cours disponibles : ${JSON.stringify(courseSummary, null, 2)}`
      },
      ...messages.value.map((m) => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.text,
      })),
    ]

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTERAPI}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1-0528-qwen3-8b:free',
        messages: apiMessages,
      }),
    })

    if (!response.ok) {
      const errMsg = await response.text()
      throw new Error('Erreur API: ' + errMsg)
    }

    const data = await response.json()
    console.log(data);
    
    const reply =
      data.choices?.[0]?.message?.content || "Je n'ai pas compris votre question."
    messages.value.push({ role: 'ai', text: reply })
  } catch (err) {
    error.value = "❌ Erreur lors de la connexion à l'IA."
    messages.value.push({
      role: 'ai',
      text: '❌ Erreur lors de la génération de la réponse.',
    })
  } finally {
    loading.value = false
  }
}

function newChat() {
  localStorage.removeItem('chat-history')
  messages.value = []
}
</script>

<template>
  <div>
    <!-- Bouton flottant -->
    <button
      class="fixed bottom-20 right-6 w-16 h-16 sm:w-14 sm:h-14 xs:w-12 xs:h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-neutral-100 via-blue-100 to-blue-300 dark:from-[#23272f] dark:via-blue-900 dark:to-blue-700 shadow-2xl hover:bg-neutral-500 dark:hover:bg-blue-900 transition-colors duration-200 z-50"
      @click="toggleChat"
    >
      <img src="/chatbot_14263197.png" alt="" width="60"/>
    </button>

    <!-- Fenêtre de chat -->
    <div
      v-if="isOpen"
      class="fixed bottom-28 right-6 w-[370px] max-w-[500px] h-[520px] bg-white dark:bg-[#23272f] rounded-2xl shadow-2xl flex flex-col z-50 border border-neutral-200 dark:border-gray-700
      md:w-[340px] md:h-[480px] sm:w-[95vw] sm:right-2 sm:bottom-20 sm:h-[70vh] xs:w-[98vw] xs:right-1 xs:bottom-16 xs:h-[65vh]"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-gray-700 rounded-t-2xl"
      >
        <span class="font-semibold text-lg text-neutral-900 dark:text-gray-100 tracking-tight">Assistant IA</span>
        <div class="flex items-center gap-2">
          <button
            @click="newChat"
            class="text-blue-500 hover:text-blue-600 text-sm font-medium px-3 py-1 rounded transition-colors border border-blue-100 bg-blue-50"
            aria-label="Nouvelle discussion"
            title="Nouvelle discussion"
          >
            New chat
          </button>
          <button
            @click="toggleChat"
            class="text-neutral-400 hover:text-neutral-700 text-2xl leading-none ml-2"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>
      </div>

      <!-- Messages -->
  <div class="flex-1 overflow-y-auto px-5 py-4 bg-neutral-50 dark:bg-[#2c3140] space-y-4">
        <div v-if="error" class="text-red-600 text-sm text-center mb-2">{{ error }}</div>
        <div
          v-for="(msg, i) in messages"
          :key="i"
          class="flex"
          :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
        >
          <div
            :class="[
              'max-w-[80%] px-4 py-3 rounded-2xl text-base',
              msg.role === 'user'
                ? 'bg-blue-400 text-white rounded-br-md'
                : 'bg-neutral-200 dark:bg-[#23272f] text-neutral-900 dark:text-gray-100 rounded-bl-md',
            ]"
          >
            {{ msg.text }}
          </div>
        </div>
        <!-- Loading -->
        <div v-if="loading" class="flex justify-start">
          <div
            class="bg-neutral-200 dark:bg-[#23272f] text-neutral-900 dark:text-gray-100 px-4 py-3 rounded-2xl rounded-bl-md text-base flex items-center gap-2"
          >
            <span>Assistant IA</span>
            <span class="inline-flex loading-dots"><span>.</span><span>.</span><span>.</span></span>
          </div>
        </div>
      </div>

      <!-- Input -->
      <div
        class="px-5 py-4 border-t border-neutral-100 dark:border-gray-700 bg-white dark:bg-[#23272f] rounded-b-2xl flex items-center gap-3"
      >
        <input
          v-model="input"
          placeholder="Écrivez votre question..."
          class="flex-1 px-4 py-2 rounded-xl border border-neutral-200 dark:border-gray-700 bg-neutral-50 dark:bg-[#2c3140] text-base text-neutral-900 dark:text-gray-100 focus:outline-none focus:border-neutral-400 dark:focus:border-blue-500 transition"
          @keyup.enter="send"
          :disabled="loading"
        />
        <button
          @click="send"
          class="w-11 h-11 flex items-center justify-center rounded-full bg-neutral-900 dark:bg-blue-700 hover:bg-neutral-800 dark:hover:bg-blue-800 transition-colors text-white disabled:bg-neutral-300 disabled:cursor-not-allowed"
          :disabled="loading || !input.trim()"
          aria-label="Envoyer"
        >
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
            <path d="M3 21l18-9L3 3v7l12 2-12 2v7z" fill="#fff" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading-dots span {
  animation: blink 1.4s infinite both;
  font-weight: bold;
  font-size: 1.2em;
}
.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}
.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}
@keyframes blink {
  0%,
  80%,
  100% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
}
</style>
