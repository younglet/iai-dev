import { nanoid } from 'nanoid';

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const projectId = getRouterParams(event).projectId
    const project = await useStorage('data').getItem(projectId)
    
    if (!project.animations.find(animation => animation.name === body.animationName)) {
        project.animations.push({
            name: body.animationName,
            id:nanoid(),
            keyFrames: []
        })
        await useStorage('data').setItem('projectId', project)
        return `动画${body.animationName}已成功创建`
    }
    return Error(`动画${body.animationName}已存在`)
}
)