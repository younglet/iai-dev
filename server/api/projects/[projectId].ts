export default defineEventHandler(async (event) => {
    const projectId =getQuery(event).projectId
    const project = await useStorage('data').getItem(projectId)
    return project
}
)