<template>
    <div class="flex items-end justify-between mb-8">
        <h1 class="text-primary font-bold text-4xl">{{ config.title }}-{{ project.id }}</h1>
        <span class="pi pi-cog hover:text-primary"></span>
    </div>

    <hr>

    <div class="mt-8 grid grid-cols-3 gap-4">
        <NuxtLink v-for="(animation, index) in project.animations" :key="index"
            :to="{ path: `/projects/${project.id}/animations/${animation.id}` }">
            <div
                class="flex  border px-8  items-center group justify-between gap-4 p-4 rounded-xl border-1 border-surface-200 dark:border-surface-600 hover:bg-primary hover:text-white">
                <i class="pi pi-slack text-primary group-hover:text-white group-hover:border-0"></i>
                <div class="flex-1 flex items-start group-hover:text-white group-hover:border-0">
                    {{ animation.name }}
                </div>
            </div>
        </NuxtLink>

        <div @click="show"
            class="text-primary border-primary hover:bg-primary hover:text-white flex flex-col border  items-center justify-center gap-4 p-4 rounded-xl border-1 dark:border-surface-600">
            添加动画
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
const route = useRoute();
console.log(route.params.projectId)
console.log(route)
const { data: config } = await useFetch('/api/config')
const { data: project, execute: updatePage } = await useFetch(`/api/projects/${route.params.projectId}`, {
    query: { projectId: 'projectId' }
})

const visible = ref(false);

const body = ref({ animationName: null })
const show = () => {
    visible.value = true;
}

const create = () => {
    postAnimationData()
    if (error.value) {
        toast.add({ severity: 'error', summary: '创建失败', detail: data.value, life: 3000 });
        return
    }
    toast.add({ severity: 'success', summary: '创建成功', detail: error, life: 3000 });
    visible.value = false;
    data.animationName = null;
    updatePage()
}

const { data, error, execute: postAnimationData } = await useFetch(`/api/projects/${route.params.projectId}/animations`, {
    method: 'POST',
    body,
    immediate: false,
    watch: false,
})
</script>