export default defineEventHandler(async (event) => {
    console.log(1111)
    const projectId = getRouterParams(event).projectId
    const body = await readBody(event)
    await useStorage('data').setItem(projectId, body.project)
    return {'data':'成功'}
}
)