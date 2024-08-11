let status = { id: null, triggered: false }
export default defineWebSocketHandler({
    open(peer: WebSocket) {
        console.log("[ws] open", peer);
    },
    async message(peer, message) {
        message = JSON.parse(message.text())
        console.log(`[${message.type}  message]`, message);
        if (message.type === 'device') {
            if (message.triggered) {
                console.log(status);
                status.id = message.id
                status.triggered = true
            }
        }
        if (message.type === 'frontEnd') {
            console.log(status);
            peer.send(JSON.stringify(status))
            status = { id: null, triggered: false }
        }
    },

    close(peer, event) {
        console.log("[ws] close", peer, event);
    },
    error(peer, error) {
        console.log("[ws] error", peer, error);
    },
})