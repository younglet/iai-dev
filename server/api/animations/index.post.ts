import { nanoid } from 'nanoid';

export default defineEventHandler(async (event) => {
    const { animationName } = await readBody(event)
    console.log(animationName)
    const animations = await useStorage('data').getItem('animations')
    if (animations.filter(animation => animation.name === animationName).length === 0) {
        console.log(1)
        animations.push({
            name: animationName,
            id: nanoid(),
            keyFrames: []
        })
        await useStorage('data').setItem('animations', animations)
        return `动画${animationName}已成功创建`
    }
    return createError({ statusCode: 500, message: '动画名重复' })
}
)