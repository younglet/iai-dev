<template>
    <div class="flex items-center justify-between mb-8">
        <div class="flex  justify-center items-center gap-4">
            <NuxtLink :to="{ path: `/projects/${project.id}` }">
                <span class="pi pi-chevron-left text-gray-400 text-xl hover:text-primary" />
            </NuxtLink>
            <h1 class="text-primary font-bold text-2xl"> {{ project.name }}-{{ animation.name }}</h1>
        </div>
        <span class="pi pi-cog hover:text-primary"></span>
    </div>
    <hr>
</template>


<script setup>
const route = useRoute()
const { data: project } = await useFetch(`/api/projects/${route.params.projectId}`)
const animation = project.value.animations.find(item => item.id === route.params.animationId)


</script>