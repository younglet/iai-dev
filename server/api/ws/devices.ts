let frontEnds = []

export default defineWebSocketHandler({
    open(peer) {
        console.log("[web] open", peer);
        frontEnds.push(peer)
    },
    async message(peer, message) {
        console.log("[web] open", peer);
        const devicesInfo = await useStorage('data').getItem('devices')
        await useStorage('data').setItem('devices', devicesInfo)
        frontEnds.forEach(frontEnd => { frontEnd.send(devicesInfo) })
    },

    close(peer, event) {
        console.log("[ws] close", peer, event);
        frontEnds = frontEnds.filter(frontEnd => frontEnd !== peer)
    },

    error(peer, error) {
        console.log("[ws] error", peer, error);
    },
})