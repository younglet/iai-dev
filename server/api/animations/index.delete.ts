export default defineEventHandler({
    async handler(event) {
        const {id:animationId} = await readBody(event)
        console.log(animationId)
        const animations = await useStorage('data').getItem('animations')
        const newAnimations = animations.filter(animation => animation.id !== animationId)
        await useStorage('data').setItem('animations', newAnimations)
        return {animations: newAnimations}
    }
})