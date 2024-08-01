let peers = []

export default defineWebSocketHandler({
    open(peer) {
        console.log("[ws] open", peer);
        peers.push(peer)
    },
    async message(peer, message) {
        message = { ...JSON.parse(message.text()), updateTime: new Date().getTime() }
        console.log(`[${message.type}  message]`, message);
        if (message.type === 'device') {
            'todo'
        }
        if (message.type === 'frontEnd') {
            peers.forEach(peer => { peer.send(message) })
        }

    },

    close(peer, event) {
        console.log("[ws] close", peer, event);
        peers = peers.filter(p => p !== peer)
    },

    error(peer, error) {
        console.log("[ws] error", peer, error);
    },
})