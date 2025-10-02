<script setup>
import { ref } from 'vue';

const props = defineProps({
  comments: {
    type: Array,
    required: true
  },
  courseId: {
    type: [String, Number],
    required: true
  }
});

const emit = defineEmits(['update:comments']);


const currentUser = ref({
  id: 1, // Test avec Alice
  name: 'Alice',
  avatar: 'https://i.pravatar.cc/150?u=alice'
});

const localComments = ref(JSON.parse(JSON.stringify(props.comments)));
const newCommentText = ref('');

const addComment = () => {
  if (newCommentText.value.trim() === '') return;

  const newComment = {
    id: Date.now(), // Simple unique ID
    authorId: currentUser.value.id,
    author: currentUser.value.name,
    avatar: currentUser.value.avatar,
    date: new Date().toISOString().split('T')[0],
    text: newCommentText.value
  };

  localComments.value.push(newComment);
  emit('update:comments', localComments.value);
  newCommentText.value = '';
};

const deleteComment = (commentId) => {
  localComments.value = localComments.value.filter(comment => comment.id !== commentId);
  emit('update:comments', localComments.value);
};
</script>

<template>
  <div class="bg-white dark:bg-[#23272f] shadow-md rounded-lg mt-8 px-[5px] transition-colors duration-300">
    <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100 p-4 border-b border-gray-300 dark:border-gray-700">Commentaires</h3>

    <!-- Add Comment Form -->
    <div class="p-4 border-b dark:border-gray-700">
      <div class="flex items-start space-x-4">
        <img :src="currentUser.avatar" alt="Votre avatar" class="w-10 h-10 rounded-full">
        <div class="flex-1">
          <textarea
            v-model="newCommentText"
            rows="3"
            class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-[#2c3140] dark:text-gray-100"
            placeholder="Ajoutez votre commentaire..."
          ></textarea>
          <button
            @click="addComment"
            class="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Commenter
          </button>
        </div>
      </div>
    </div>

    <!-- Comments List -->
    <ul v-if="localComments.length > 0" class="divide-y divide-gray-200 dark:divide-gray-700">
      <li v-for="comment in localComments" :key="comment.id" class="p-4">
        <div class="flex items-start space-x-4">
          <img :src="comment.avatar" :alt="comment.author" class="w-10 h-10 rounded-full">
          <div class="flex-1">
            <div class="flex justify-between items-center">
              <div>
                <span class="font-semibold text-gray-900">{{ comment.author }}</span>
                <span class="text-sm text-gray-500 ml-2">{{ comment.date }}</span>
              </div>
              <button
                v-if="comment.authorId === currentUser.id"
                @click="deleteComment(comment.id)"
                class="text-gray-400 hover:text-red-500"
                aria-label="Supprimer le commentaire"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
            <p class="mt-1 text-gray-700">{{ comment.text }}</p>
          </div>
        </div>
      </li>
    </ul>
    <div v-else class="p-4 text-center text-gray-500">
      Soyez le premier à commenter !
    </div>
  </div>
</template>