export default defineEventHandler(async (event) => {
    const animations = await useStorage('data').getItem('animations')
    if (animations) {
        return animations
    } else {
        await useStorage('data').setItem('animations', [])
        return []
    }
}
)