
<template>
    <div class="flex justify-center items-center h-full" v-if="!visible">
        <Button type="primary" @click="start">开始</Button>
    </div>
    <div>
        <audio src="/musics/兰亭序.mp3" ref="audio"></audio>
    </div>
    {{  status, data, send, open, close }} 
</template>

<script setup>
import { ref } from "vue";

const visible = ref(false);
const audio = ref(null);
const start = () => {
    audio.value.play();
    visible.value = true;
};

import { useWebSocket } from '@vueuse/core'
const  { status, data, send, open, close } = useWebSocket('ws://localhost:3000/api/ws', {
    autoReconnect: true,
})
</script>
