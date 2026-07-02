<script setup>
import { ref, watch, nextTick } from 'vue'
import coursesData from '@/newCourses.json'

const isOpen = ref(false)
const input = ref('')
const messages = ref(JSON.parse(localStorage.getItem('chat-history')) || [])
const loading = ref(false)
const messagesEnd = ref(null)

const OPENROUTERAPI = import.meta.env.VITE_OPENROUTER_API_KEY
const systemMessage = {
  role: 'system',
  content: `Tu es l'assistant IA de HighFive Academy, une application e-learning. Tu réponds uniquement aux questions liées à cette application, aux cours, aux technologies et aux fonctionnalités de HighFive Academy. Si l'utilisateur pose une question qui n'a pas de rapport avec cette application, réponds brièvement que tu ne peux répondre qu'aux sujets liés à HighFive Academy.`
}

watch(messages, (val) => {
  localStorage.setItem('chat-history', JSON.stringify(val))
  nextTick(() => messagesEnd.value?.scrollIntoView({ behavior: 'smooth' }))
}, { deep: true })

function toggleChat() { isOpen.value = !isOpen.value }

// Rendu markdown minimal : gras, code inline, listes
function renderText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded text-xs font-mono">$1</code>')
    .replace(/^[-•]\s(.+)/gm, '<li class="ml-3 list-disc">$1</li>')
    .replace(/\n/g, '<br/>')
}

async function send() {
  if (!input.value.trim() || loading.value) return
  const userMsg = input.value.trim()
  messages.value.push({ role: 'user', text: userMsg })
  input.value = ''
  loading.value = true

  const courseSummary = coursesData.courses.slice(0, 20).map((c) => ({
    titre: c.title, formateur: c.instructor, prix: c.price,
    durée: c.duration, nbLeçons: c.lessons?.length || 0,
  }))

  try {
    const apiMessages = [
      systemMessage,
      {
        role: 'system',
        content: `Voici les cours disponibles : ${JSON.stringify(courseSummary)}`
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
        model: 'deepseek/deepseek-r1',
        messages: apiMessages,
      }),
    })

    if (!response.ok) throw new Error(await response.text())
    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || "Je n'ai pas compris votre question."
    messages.value.push({ role: 'ai', text: reply })
  } catch (err) {
    const msg = err?.message || 'Erreur inconnue'
    messages.value.push({ role: 'ai', text: `❌ ${msg}` })
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
      @click="toggleChat"
      class="fixed bottom-6 right-6 flex items-center gap-2.5 pl-3 pr-4 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-xl shadow-indigo-500/50 hover:shadow-indigo-500/70 hover:scale-105 active:scale-95 transition-all duration-200 z-50 group"
    >
      <!-- Badge pulsant -->
      <span v-if="!isOpen" class="absolute -top-1 -right-1 w-3.5 h-3.5">
        <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
        <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
      </span>
      <div class="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
        <i v-if="isOpen" class="fas fa-times text-white text-base"></i>
        <img v-else src="/chatbot_14263197.png" alt="" class="w-6 h-6 object-contain" />
      </div>
      <div class="text-left" v-if="!isOpen">
        <p class="text-white font-bold text-sm leading-tight">Assistant IA</p>
        <p class="text-indigo-200 text-xs leading-tight">Posez vos questions</p>
      </div>
      <span v-else class="text-white font-semibold text-sm">Fermer</span>
    </button>

    <!-- Fenêtre de chat -->
    <transition name="chat">
      <div
        v-if="isOpen"
        class="fixed bottom-28 right-6 w-[340px] h-[520px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl shadow-indigo-500/20 flex flex-col z-50 border-2 border-indigo-100 dark:border-indigo-900/50 overflow-hidden sm:w-[95vw] sm:right-2 sm:bottom-24"
      >
        <!-- Header -->
        <div class="flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 flex-shrink-0">
          <div class="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <i class="fas fa-robot text-white text-sm"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-white font-semibold text-sm leading-tight">Assistant IA</p>
            <p class="text-indigo-200 text-xs">HighFive Academy</p>
          </div>
          <button
            @click="newChat"
            class="flex items-center gap-1.5 px-2.5 py-1 bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-medium rounded-lg transition-colors"
            title="Nouvelle discussion"
          >
            <i class="fas fa-plus text-xs"></i> Nouveau
          </button>
          <button @click="toggleChat" class="w-7 h-7 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition-colors ml-1">
            <i class="fas fa-times text-sm"></i>
          </button>
        </div>

        <!-- Messages -->
        <div class="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50 dark:bg-slate-900/50">

          <!-- Message de bienvenue si vide -->
          <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full text-center px-4">
            <div class="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center mb-3">
              <i class="fas fa-robot text-2xl text-indigo-500"></i>
            </div>
            <p class="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Bonjour ! 👋</p>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Je suis votre assistant IA. Posez-moi des questions sur les cours, les technologies ou votre apprentissage.</p>
            <div class="mt-4 space-y-2 w-full">
              <button
                v-for="suggestion in ['Quels cours sont disponibles ?', 'Recommande-moi un cours pour débuter', 'Quel cours choisir pour apprendre Vue.js ?']"
                :key="suggestion"
                @click="input = suggestion; send()"
                class="w-full text-left px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-600 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {{ suggestion }}
              </button>
            </div>
          </div>

          <!-- Messages -->
          <div
            v-for="(msg, i) in messages"
            :key="i"
            class="flex"
            :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
          >
            <!-- Avatar IA -->
            <div v-if="msg.role === 'ai'" class="w-6 h-6 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center flex-shrink-0 mr-2 mt-0.5 shadow-sm">
              <i class="fas fa-robot text-white text-xs"></i>
            </div>

            <div
              class="max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
              :class="msg.role === 'user'
                ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-tr-sm shadow-md shadow-indigo-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-sm border border-slate-100 dark:border-slate-700 shadow-sm'"
              v-html="msg.role === 'ai' ? renderText(msg.text) : msg.text"
            ></div>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="flex justify-start items-end gap-2">
            <div class="w-6 h-6 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
              <i class="fas fa-robot text-white text-xs"></i>
            </div>
            <div class="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style="animation-delay:0s"></span>
              <span class="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style="animation-delay:0.15s"></span>
              <span class="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style="animation-delay:0.3s"></span>
            </div>
          </div>

          <div ref="messagesEnd"></div>
        </div>

        <!-- Input -->
        <div class="px-4 py-3 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex-shrink-0">
          <div class="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 focus-within:border-indigo-400 dark:focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
            <input
              v-model="input"
              placeholder="Posez votre question..."
              class="flex-1 bg-transparent outline-none text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
              @keyup.enter="send"
              :disabled="loading"
            />
            <button
              @click="send"
              :disabled="loading || !input.trim()"
              class="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors flex-shrink-0"
            >
              <i class="fas fa-paper-plane text-xs"></i>
            </button>
          </div>
          <p class="text-center text-xs text-slate-400 dark:text-slate-500 mt-2">Propulsé par DeepSeek via OpenRouter</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.chat-enter-active, .chat-leave-active { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
.chat-enter-from, .chat-leave-to { opacity: 0; transform: translateY(16px) scale(0.97); }
</style>
