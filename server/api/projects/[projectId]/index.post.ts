export default defineEventHandler(async (event) => {
    const projectId = getRouterParams(event).projectId
    console.log(123)
    const body = await readBody(event)
    await useStorage('data').setItem(projectId, body.project)
}
)