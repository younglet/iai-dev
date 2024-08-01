export default defineEventHandler(async (event) => {
    const {id:animationId} = getRouterParams(event)
    let animations = await useStorage('data').getItem('animations')
    const{ animation }= await readBody(event)
    animations = animations.filter(item => item.id !== animationId)
    animations.push(animation)
    console.log(animations)
    await useStorage('data').setItem('animations', animations)
    return {animations}

    
})