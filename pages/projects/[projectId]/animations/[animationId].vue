<template>
    <div class="flex items-center justify-between mb-8">
        <div class="flex  justify-center items-center gap-4">
            <NuxtLink :to="{ path: `/projects/${project.id}` }">
                <span class="pi pi-chevron-left text-gray-400 text-xl hover:text-primary" />
            </NuxtLink>
            <h1 class="text-primary font-bold text-2xl"> {{ project.name }}-{{ animation.name }}</h1>
        </div>
        <div class="flex gap-2 items-center">
            <Button class="w-24" label="Delete" severity="danger" outlined>
                <i class="pi pi-delete-left text-red-500 mr-2"></i>
                删除
            </Button>
            <Button class="w-24" size="small" severity="help" @click="send(JSON.stringify(frame))">
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
    <Button @click="randomFrame()">随机</Button>
    <hr>
    <div class="grid grid-cols-5 gap-4 justify-center items-center mt-12">
        <div v-for="device, idx in frame" class="text-left w-56 h-56 border shadow-sm rounded-xl">
            <h2 class="font-bold text-white bg-primary text-center p-2 text-xl rounded-t-xl">Device {{ idx }}</h2>
            <div class="flex flex-col ">
                <div v-for="item, index in project.config.params.output" class="p-4 flex items-center justify-between">
                    <span class="text-primary">{{ item.name }}</span>
                    <span>{{ frame[idx][item.name] }}</span>
                    <Slider v-model="frame[idx][item.name]" class="w-24 bg-primary" :max="item.restraint.max"
                        :min="item.restraint.min" />
                </div>
            </div>
            <hr>
            <div class="grid grid-cols-2 p-4 gap-6">
                <div v-for="item, index in project.config.params.input" class=" items-center justify-between ">
                    <div class="flex justify-between text-xs">
                        <h3 class="text-primary">{{ item.label }}</h3>
                        <div class="text-gray-500 ml-4">
                            <span>
                                100
                            </span>
                            <span>
                                {{ item.unit }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class=" text-xs text-gray-500 text-center" style="font-size: 14px;">
                上次更新时间：2024年7月14日 02:07:43
            </div>
        </div>
        <hr>
    </div>
    <hr>
    <div class="w-full flex gap-4 mt-8">
        <div v-for="frame, index in animation.keyFrames" class="flex flex-col gap-2" @click="deleteKeyFrame(frame)">
            <div v-for="device, idx in frame.devices" class="text-left size-14 border shadow-sm rounded-xl">
                <div class="flex flex-col gap-2 items-center justify-around py-2 h-full  ">
                    <div v-for="item, index in project.config.params.output" class="flex items-center justify-center ">
                        <Slider v-model="frame.devices[idx][item.name]" class="w-10  bg-primary" :max="item.restraint.max"
                            :min="item.restraint.min" disabled />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import { computed } from 'vue';
import { nanoid } from 'nanoid'
const confirm = useConfirm();
const toast = useToast();
const route = useRoute()
const { data: project } = await useFetch(`/api/projects/${route.params.projectId}`)
const animation = computed(() => project.value.animations.find(item => item.id === route.params.animationId))

const frame = animation.value.keyFrames.length > 0 ?
    ref(animation.value.keyFrames[animation.value.keyFrames.length - 1].devices.map(item => ({ ...item }))) : ref(Array.from({ length: 5 }, (_, index) =>
        Object.fromEntries([
            ...project.value.config.params.output.map(({ name }) => [name, 0]),
            ['id', index]
        ])
    ))

const saveFrametoKeyFrames = () => {
    const body = { project: project.value }
    animation.value.keyFrames.push({ id: nanoid(), devices: frame.value })
    $fetch(`/api/projects/${route.params.projectId}`, {
        method: 'POST',
        body
    })
}

const randomFrame = () => {
    frame.value = frame.value.map(item => {
        return Object.fromEntries([
            ...project.value.config.params.output.map(({ name, restraint }) => [name, Math.floor(Math.random() * (restraint.max - restraint.min)) + restraint.min]),
            ['id', item.id]
        ])
    })
}

const deleteKeyFrame = (frame) => {
    confirm.require({
        message: '确认删除该帧吗？',
        header: '提示',
        icon: 'pi pi-info-circle',
        rejectLabel: '取消',
        rejectProps: {
            label: '取消',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: '删除',
            severity: 'danger'
        },

        accept: () => {
            animation.value.keyFrames = animation.value.keyFrames.filter(item => item.id !== frame.id)
            $fetch(`/api/projects/${route.params.projectId}`, {
                method: 'POST',
                body: { project: project.value }
            })
            toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });
        },
        reject: () => {
            toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });

}
</script>