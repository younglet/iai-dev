<template>
    <div class="flex items-center justify-between mb-8">
        <div class="flex  justify-center items-center gap-4">
            <NuxtLink :to="{ path: `/` }">
                <span class="pi pi-chevron-left text-gray-400 text-xl hover:text-primary" />
            </NuxtLink>
            <h1 class="text-primary font-bold text-2xl"> {{ animation.name }}</h1>
        </div>
        <div class="flex gap-2 items-center">
            <Button class="w-24" size="small" severity="help"
                @click="send(JSON.stringify({ type: 'frontEnd', frame: frame }))">
                <i class="pi pi-send text-white mr-2"></i>
                测试
            </Button>
            <Button class="w-32" size="small" @click="saveFrametoKeyFrames()">
                <i class="pi pi-camera text-white mr-2"></i>
                添加关键帧
            </Button>
            <span class="pi pi-cog hover:text-primary text-2xl"></span>
        </div>
    </div>

    <hr>

    <div class="grid grid-cols-6 gap-8 p-4 px-24">
        <div v-for="item, index in frame" class="bg-white rounded-md shadow-md border-b-4 border-primary">
            <div class="flex p-4 justify-around">

                <Slider v-model="frame[index].value" orientation="vertical" class="h-[14rem] w-2" :max="180"
                    :key="item.id" />
                <div class="flex flex-col items-center justify-around">
                    <Button class="w-12" size="small" severity="secondary" @click="frame[index].value++">
                        <i class="pi pi-chevron-up mr-2"></i>
                    </Button>
                    <span>{{ frame[index].value }}</span>
                    <Button class="w-12" size="small" severity="secondary" @click="frame[index].value--">
                        <i class="pi pi-chevron-down mr-2"></i>
                    </Button>
                </div>
            </div>
            <div class="text-primary text-center text-sm font-bold">设备{{ index + 1 }}</div>
        </div>
    </div>

    <hr>
    <div class="flex gap-4">

        <div class="flex flex-row gap-4 p-6 ">
            <div class="grid  grid-cols-6 w-11/12" v-for="keyFrame, index in animation.keyFrames">
                <div class="grid grid-cols-6 gap-4 p-4 w-28 hover:scale-110   border-b-4 shadow-md border-primary">
                    <Slider v-model="keyFrame[index].value" orientation="vertical" class="h-[3rem]"
                        v-for="item, index in keyFrame" :key="item.id" disabled />
                </div>
            </div>
        </div>
        <div>
            <Button @click="playAnimation()">播放</Button>
        </div>
    </div>

</template>


<script setup>
import { useWebSocket } from '@vueuse/core'

const { send } = useWebSocket('ws://192.168.11.11:3000/api/ws')



const route = useRoute()
const { data: animation } = await useFetch(`/api/animations/${route.params.id}`)

const frame =
    animation.value.keyFrames.length > 0 ?
        ref(animation.value.keyFrames[animation.value.keyFrames.length - 1].map(item => ({ ...item }))) :
        ref(Array.from({ length: 12 }, (_, i) => ({ id: i, value: 0 })));

const saveFrametoKeyFrames = () => {
    animation.value.keyFrames.push(frame.value.map(item => ({ ...item })))
    $fetch(`/api/animations/${route.params.id}`, {
        method: 'POST',
        body: {
            animation: animation.value
        }
    })
}
const playAnimation = () => {
    let index = 1;
    let frame = animation.value.keyFrames[0]
    send(JSON.stringify(frame))
    const intervalId = setInterval(() => {
        if (index < animation.value.keyFrames.length) {
            let frame = animation.value.keyFrames[index]
            send(JSON.stringify(frame))
            index++;
        } else {
            clearInterval(intervalId);
            index = 0;
        }
    }, 1000);

}

import { useDraggable } from '@vueuse/core'
const floatPanel = ref(null)
const { x, y, style } = useDraggable(floatPanel, {
    initialValue: { x: 800, y: 400 },
})
</script>