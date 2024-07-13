export default defineEventHandler(async (event) => {
    const projectId =getRouterParams(event).projectId
    const project = await useStorage('data').getItem(projectId)
    return project
}
)