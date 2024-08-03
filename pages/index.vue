<template>
   <div class="mt-8 grid grid-cols-4 gap-4">
       <NuxtLink v-for="(animation, index) in animations" :key="index" :to="`./animations/${animation.id}`">
           <div
               class="flex  border px-8  items-center group justify-between gap-4 p-4 rounded-xl border-1 border-primary dark:border-surface-600 hover:bg-primary hover:text-white">
               <i class="pi pi-slack text-primary text-3xl group-hover:text-white group-hover:border-0"></i>
               
               <div class="flex-1 flex flex-col items-start group-hover:text-white  pl-10 border-l-2 group-hover:border-l-white  group-hover:border-0">
                   <h3 class="text-primary text-xl font-bold group-hover:text-white">{{ animation.name }}</h3>
                   <span class=" text-slate-500 hover:text-white" style="font-size: 16px;">动画帧数{{ animation.keyFrames.length }}</span>
               </div>
               <span class="pi pi-delete-left  group-hover:text-white"
                   @click.prevent="deleteAnimation(animation)" />
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
const confirm = useConfirm();

const { data:animations, refresh: updatePage } = await useFetch(`./api/animations`)

const visible = ref(false);

const body = ref({ animationName: null })
const show = () => {
   visible.value = true;
}

const create = async() => {
   await postAnimationData()
   if (error.value) {
       toast.add({ severity: 'error', summary: '存在同名动画，创建失败', detail: data.value, life: 3000 });
       return
   }
   toast.add({ severity: 'success', summary: '动画创建成功', detail: error, life: 3000 });
   visible.value = false;
   data.animationName = null;   
   updatePage()
}

const { data, error, execute: postAnimationData } = await useFetch(`./api/animations`, {
   method: 'POST',
   body,
   immediate: false,
   watch: false,
})

const deleteAnimation = (animation) => {
   confirm.require({
       message: `确认删除动画【${animation.name}】吗？`,
       header: '提示',
       icon: 'pi pi-info-circle',
       rejectLabel: '取消',
       rejectProps: {
           label: '取消',
           severity: 'secondary',
           outlined: true
       },
       acceptLabel: '删除',
       acceptProps: {
           label: '删除',
           severity: 'danger'
       },

       accept: () => {

           $fetch(`./api/animations`, {
               method: 'DELETE',
               body: { id:animation.id }
           })
           toast.add({ severity: 'success', summary: '成功删除', detail: `你已经成功删除动画【${animation.name}】了`, life: 3000 });
           updatePage()
       },
       reject: () => {
           toast.add({ severity: 'info', summary: '取消删除', detail: '你已经取消删除', life: 3000 });
       }
   });
   return

}
</script>
