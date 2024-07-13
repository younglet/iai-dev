export default defineEventHandler(async (event) => {
    const { projectId, animationId } = getRouterParams(event)
    const project = await useStorage('data').getItem(projectId)
    return project
}
)