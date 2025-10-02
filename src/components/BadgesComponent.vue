<script setup>

const props = defineProps({
  earnedBadges: {
    type: Array,
    required: true
  }
});

const gadgesDiv = "gadgesDiv";
</script>

<template>
    <div>
        <h2 class="font-bold text-[22px] my-5 dark:text-gray-100">Badges obtenus</h2>
        <div v-if="props.earnedBadges.length > 0" class="flex gap-4 items-center text-center" :class="gadgesDiv">
            <div v-for="badge in props.earnedBadges" :key="badge.name"
                class="bg-bgColor dark:bg-[#23272f] px-5 py-3 rounded-[10px] shadow-xs shadow-black/15 w-[258px] h-[144px] flex flex-col justify-center items-center border border-gray-100 dark:border-gray-700">
                <div class="text-redColor" v-html="badge.icon"></div>
                <h2 class="dark:text-blue-200">{{ badge.name }}</h2>
                <p class="dark:text-gray-300">{{ badge.description }}</p>
            </div>
        </div>
        <div v-else class="text-center p-10 text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-[#65676b80] rounded-lg">
            <p>Vous n'avez pas encore obtenu de badges. Terminez des cours pour en débloquer !</p>
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
</style>