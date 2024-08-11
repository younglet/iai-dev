
<template>
    <div class="flex justify-center items-center h-full" v-if="!visible">
        <Button type="primary" @click="start">开始</Button>
    </div>
    <audio src="/musics/music.mp3" ref="audio"></audio>
    <div v-if="visible" v class="flex justify-center items-center h-full">
        <div class="grid grid-cols-3 gap-4">
            <div v-for="num in 6" class="size-32 border flex items-center justify-center text-4xl text-white bg-gray-500" 
            :class="{'bg-primary-500': triggeredId === num - 1}">
                <span>{{ num - 1 }}</span>
            </div>
        </div>
    </div>
    {{ triggeredId }}
</template>

<script setup>
const visible = ref(false);
const audio = ref(null);
const isPlaying = ref(false);
const triggeredId = ref(null)
const start = () => {
    visible.value = true;
    watch(data, (data) => {
        data = JSON.parse(data)
        if (data.triggered && !isPlaying.value) {
            isPlaying.value = true
            triggeredId.value = data.id
            play()
            setTimeout(() => {
                triggeredId.value = null
                stop()
            }, 3000)
            setTimeout(() => {
                isPlaying.value = false
            }, 5000)
        }
    })
};
const play = () => {
    audio.value.currentTime = 0;
    audio.value.play();
};
const stop = () => {
    audio.value.pause();
};

import { useWebSocket } from '@vueuse/core'
const { status, data, send, open, close } = useWebSocket('ws://localhost:3000/api/ws', {
    autoReconnect: true,
})

onMounted(() => {
    setInterval(() => {
        send(JSON.stringify({ 'type': 'frontEnd' }))
    }, 1000)
})
</script>
