<template>
    <div class="flex items-center justify-between mb-8">
        <div class="flex  justify-center items-center gap-4">
            <NuxtLink :to="{ path: `/` }">
                <span class="pi pi-chevron-left text-gray-400 text-xl hover:text-primary" />
            </NuxtLink>
            <h1 class="text-primary font-bold text-2xl"> {{ animation.name }}</h1>
        </div>
        <div class="flex gap-2 items-center">
            <Button class="w-32" size="small" severity="help"
                @click="send(JSON.stringify({ type: 'frontEnd', frame: frame }))">
                <i class="pi pi-send text-white mr-2"></i>
                同步状态
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

                <Slider v-model="frame[index].value" orientation="vertical" class="h-[14rem] w-2" :max="max"
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

    <div ref="floatPanel" :style="style" style="position: fixed" class="bg-white w--48 h-72 rounded-xl shadow-xl border">
        <h3 class="text-primary font-bold  text-center p-2">快速操作</h3>
        <hr>
        <div class="grid grid-cols-2 gap-2 p-4">
            <Button @click="frameToRandom()" size="small">随机</Button>
            <Button @click="frameAlignToMax()" size="small">取高对齐</Button>
            <Button @click="frameAlignToMin()" size="small">取低对齐</Button>
            <Button @click="frameAlignToAverage()" size="small">平均对齐</Button>
            <Button @click="frameToFull()" size="small">最大</Button>
            <Button @click="frameToZero()" size="small">归零</Button>
            <Button @click="frameDouble()" size="small">翻倍</Button>
            <Button @click="frameHalf()" size="small">减半</Button>
            <Button @click="frameIncrease()" size="small">+1</Button>
            <Button @click="frameDecrease()" size="small">-1</Button>

        </div>

    </div>

    
   <Dialog v-model:visible="visible" modal header="创建动画" :style="{ width: '25rem' }">
       <span class="text-surface-500 dark:text-surface-400 block mb-8"></span>
       <div class="flex items-center gap-4 mb-8">
           <InputText class="flex-auto" v-model="body.animationName" autocomplete="off" placeholder="动画名称" />
       </div>
       <div class="flex justify-end gap-2">
           <Button type="button" label="取消" severity="secondary" @click="visible = false"></Button>
           <Button type="button" label="创建" @click=" create()"></Button>
       </div>
   </Dialog>

</template>


<script setup>


const toast = useToast();
import { useWebSocket } from '@vueuse/core'

const { send } = useWebSocket('ws://192.168.11.11:3000/api/ws')



const route = useRoute()
const { data: animation } = await useFetch(`/api/animations/${route.params.id}`)

const frame =
    animation.value.keyFrames.length > min ?
        ref(animation.value.keyFrames[animation.value.keyFrames.length - 1].map(item => ({ ...item }))) :
        ref(Array.from({ length: 12 }, (_, i) => ({ id: i, value: min })));

const saveFrametoKeyFrames = async () => {
    animation.value.keyFrames.push(frame.value.map(item => ({ ...item })))
    await $fetch(`/api/animations/${route.params.id}`, {
        method: 'POST',
        body: {
            animation: animation.value
        }
    })
    toast.add({ severity: 'success', summary: '成功', detail: `你已成功保存当前关键帧`, life: 3000 });
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


const max = 180
const min = 10
const visible = ref(false)
const adjustParams = ref({
    max: max,
    min: min,
    value: 0
})
const frameToRandom = () => {
    frame.value = frame.value.map(item => ({ ...item, value: Math.floor(Math.random() * max) }))
}

const frameToZero = () => {
    frame.value = frame.value.map(item => ({ ...item, value: min }))
}   

const frameToFull = () => {
    frame.value = frame.value.map(item => ({ ...item, value: max }))
}
const frameDouble = () => {
    frame.value = frame.value.map(item => ({ ...item, value: item.value * 2 }))
    if (frame.value.every(item => item.value > max)) {
        frame.value = frame.value.map(item => ({ ...item, value: max }))
    }
}

const frameHalf = () => {
    frame.value = frame.value.map(item => ({ ...item, value: item.value / 2 }))
    if (frame.value.every(item => item.value < min)) {
        frame.value = frame.value.map(item => ({ ...item, value: min }))
    }
}

const frameIncrease = () => {
    frame.value = frame.value.map(item => ({ ...item, value: item.value + 1 }))
    if(frame.value.every(item => item.value > max)) {
        frame.value = frame.value.map(item => ({ ...item, value: max }))
    }
}

const frameDecrease = () => {
    frame.value = frame.value.map(item => ({ ...item, value: item.value - 1 }))
    if(frame.value.every(item => item.value < min)) {
        frame.value = frame.value.map(item => ({ ...item, value: min }))
    }
}

const frameAlignToMax = ()=>{
    const max = frame.value.map(item => item.value).reduce((a, b) => Math.max(a, b))
    frame.value = frame.value.map(item => ({ ...item, value: max }))
}

const frameAlignToMin = ()=>{
    const min = frame.value.map(item => item.value).reduce((a, b) => Math.min(a, b))
    frame.value = frame.value.map(item => ({ ...item, value: min }))
}

const frameAlignToAverage = ()=>{
    let average = frame.value.map(item => item.value).reduce((a, b) => a + b) / frame.value.length
    average = Math.trunc(average)
    frame.value = frame.value.map(item => ({ ...item, value: average }))
}




import { useDraggable } from '@vueuse/core'
const floatPanel = ref(null)
const { x, y, style } = useDraggable(floatPanel, {
    initialValue: { x: 800, y: 400 },
})
</script>