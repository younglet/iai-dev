export default defineEventHandler(async (event) => {
    const {id:animationId} = getRouterParams(event)
    const animations = await useStorage('data').getItem('animations')
    return animations.find(animation => animation.id === animationId)
})