<template>
    <div class="flex items-center justify-between mb-2">
        <div class="flex  justify-center items-center gap-4">
            <NuxtLink :to="{ path: `/` }">
                <span class="pi pi-chevron-left text-gray-400 text-xl hover:text-primary" />
            </NuxtLink>
            <h1 class="text-primary font-bold text-2xl"> {{ animation.name }}</h1>
        </div>
        <div class="flex gap-2 items-center">
            <Button class="w-32" size="small" severity="info" @click="playAnimation()">
                <i class="pi pi-slack text-white mr-2"></i>
                播放动画
            </Button>
            <Button class="w-32" size="small" severity="help"
                @click="send(JSON.stringify({ type: 'setup', frame: frame }))">
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


    <div class="grid grid-cols-6 gap-4 p-4 px-24">
        <div v-for="item, index in frame" class="bg-white rounded-md shadow-md border-b-4 border-primary">
            <div class="flex p-2 justify-around">

                <Slider v-model="frame[index].value" orientation="vertical" class="h-[10rem] w-2" :max="max"
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
            <div class="text-primary text-center text-sm font-bold">设备{{ index  }}</div>
        </div>
    </div>

    <div class=" px-24 border-t-4 pt-4 h-48 overflow-y-auto">
        <div class="grid grid-cols-8 gap-4">
            <ConfirmPopup></ConfirmPopup>
            <div class="grid  grid-cols-6 w-11/12" v-for="keyFrame, index in animation.keyFrames"
                @click="deleteFromKeyFrames($event, keyFrame)">
                <div class="grid grid-cols-6 gap-4 p-4 w-28 hover:scale-110   border-b-4 shadow-md border-primary">
                    <Slider v-model="item.value" orientation="vertical" class="h-[3rem]"
                        v-for="item, index in keyFrame.data" :key="item.id" disabled />
                </div>
            </div>
        </div>
    </div>

    <div ref="floatPanel" :style="style" style="position: fixed" class="bg-white w-56 h-96 rounded-xl shadow-xl border">
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
        <hr>
        <div class="px-4 flex flex-col gap-2 mt-2">
            <div class="flex gap-2 items-center">
                <Button @click="frameTimesParamsValue" size="small" class="w-24">乘系数</Button>
                <input type="number" v-model="adjustParams.value" max="2" min="0.1" step="0.1"
                    class="w-10 h-6 border text-center" />
            </div>
            <div class="flex gap-2  items-center" id="range">
                <Button @click="frameRangeRandom" size="small" class="w-18">范围随机</Button>
                <input type="number" v-model="adjustParams.range[0]" max="2" min="0.1" step="0.1"
                    class="w-10 h-6 border text-center" />

                <input type="number" v-model="adjustParams.range[1]" max="2" min="0.1" step="0.1"
                    class="w-10 h-6 border text-center" />
            </div>
        </div>

    </div>




</template>


<script setup>


import { useWebSocket } from '@vueuse/core'
const { send } = useWebSocket('ws://192.168.11.11:3000/api/ws')
const toast = useToast();
const confirm = useConfirm()


const route = useRoute()
const { data: animation } = await useFetch(`/api/animations/${route.params.id}`)

const frame =
    animation.value.keyFrames.length > 0 ?
        ref(animation.value.keyFrames[animation.value.keyFrames.length - 1].data.map(item => ({ ...item }))) :
        ref(Array.from({ length: 12 }, (_, i) => ({ id: i, value: min })));

const saveFrametoKeyFrames = async () => {
    animation.value.keyFrames.push({ id: nanoid(), data: frame.value.map(item => ({ ...item })) })
    await $fetch(`/api/animations/${route.params.id}`, {
        method: 'POST',
        body: {
            animation: animation.value
        }
    })
    toast.add({ severity: 'success', summary: '成功', detail: `你已成功保存当前关键帧`, life: 1000 });
}

const deleteFromKeyFrames = async (event, keyFrame) => {
    confirm.require({
        target: event.currentTarget,
        message: '确定要删除当前关键帧吗？',
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: '取消',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: '确认删除'
        },
        accept:async () => {
            animation.value.keyFrames = animation.value.keyFrames.filter(item => item.id !== keyFrame.id)
            await $fetch(`/api/animations/${route.params.id}`, {
                method: 'POST',
                body: {
                    animation: animation.value
                }
            })
            toast.add({ severity: 'success', summary: '成功', detail: `你已成功删除当前关键帧`, life: 1000 });
        },
        reject: () => {
            toast.add({ severity: 'info', summary: '取消', detail: '你已经取消了删除操作', life: 3000 });
        }
    });


}
const playAnimation = () => {
    let index = 1;
    let frame = animation.value.keyFrames[0]
    send(JSON.stringify({frame:frame.data, type:'setup'}))
    const intervalId = setInterval(() => {
        if (index < animation.value.keyFrames.length) {
            let frame = animation.value.keyFrames[index]
            send(JSON.stringify({frame:frame.data, type:'setup'}))
            index++;
        } else {
            clearInterval(intervalId);
            index = 0;
        }
    }, 1000);

}


const max = 180
const min = 10
const adjustParams = ref({
    range: [min, min + 20],
    value: 1.2
})

watch(
    () => adjustParams.value.range,
    (newRange) => {
        if (newRange[0] > newRange[1]) {
            adjustParams.value.range = [newRange[1], newRange[0]];
        }
    },
    { deep: true }
);
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
    frame.value = frame.value.map(item => ({ ...item, value: Math.trunc(item.value / 2) }))
    if (frame.value.every(item => item.value < min)) {
        frame.value = frame.value.map(item => ({ ...item, value: min }))
    }
}

const frameIncrease = () => {
    frame.value = frame.value.map(item => ({ ...item, value: item.value + 1 }))
    if (frame.value.every(item => item.value > max)) {
        frame.value = frame.value.map(item => ({ ...item, value: max }))
    }
}

const frameDecrease = () => {
    frame.value = frame.value.map(item => ({ ...item, value: item.value - 1 }))
    if (frame.value.every(item => item.value < min)) {
        frame.value = frame.value.map(item => ({ ...item, value: min }))
    }
}

const frameAlignToMax = () => {
    const max = frame.value.map(item => item.value).reduce((a, b) => Math.max(a, b))
    frame.value = frame.value.map(item => ({ ...item, value: max }))
}

const frameAlignToMin = () => {
    const min = frame.value.map(item => item.value).reduce((a, b) => Math.min(a, b))
    frame.value = frame.value.map(item => ({ ...item, value: min }))
}

const frameAlignToAverage = () => {
    let average = frame.value.map(item => item.value).reduce((a, b) => a + b) / frame.value.length
    average = Math.trunc(average)
    frame.value = frame.value.map(item => ({ ...item, value: average }))
}

const frameTimesParamsValue = () => {
    frame.value = frame.value.map(item => ({ ...item, value: Math.trunc(item.value * adjustParams.value.value) }))
    frame.value = frame.value.map(item => ({ ...item, value: item.value > max ? max : item.value }))
    if (frame.value.every(item => item.value < min)) {
        frame.value = frame.value.map(item => ({ ...item, value: min }))
    }
    if (frame.value.every(item => item.value > max)) {
        frame.value = frame.value.map(item => ({ ...item, value: max }))
    }

}

const frameRangeRandom = () => {
    if (adjustParams.value.range[0] < min) {
        adjustParams.value.range[0] = min
    }
    if (adjustParams.value.range[1] > max) {
        adjustParams.value.range[1] = max
    }
    frame.value = frame.value.map(item => ({ ...item, value: Math.floor(Math.random() * (adjustParams.value.range[1] - adjustParams.value.range[0] + 1)) + adjustParams.value.range[0] }))
}


import { useDraggable } from '@vueuse/core'
import { nanoid } from 'nanoid';
const floatPanel = ref(null)
const { x, y, style } = useDraggable(floatPanel, {
    initialValue: { x: 1300, y: 300 },
})
</script>

<style>
#range input[type="number"]::-webkit-inner-spin-button,
#range input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>