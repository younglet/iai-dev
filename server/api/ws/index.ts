let devices = {}
let devicePeers = {} 


export default defineWebSocketHandler({ 
    open(peer) {
        console.log("[ws] open", peer);
    },
    async message(peer, message) {
        message = JSON.parse(message.text())
        console.log(`[${message.type}  message]`, message);
        if (message.type === 'device') {
            devices[message.id] = { ...message, updateTime: new Date().getTime() }
            devicePeers[message.id] = peer 
        }
        if (message.type === 'getDevices') {
            peer.send(JSON.stringify({ type: 'devices', devices }))
        }
        if (message.type === 'setup') {
            let frame = message.frame
            console.log(frame)
            frame.forEach(d => {
                if (!devices[d.id]) {
                    return
                }
                devicePeers[d.id].send(JSON.stringify({ type: 'setup', ...d }))
            })
        }
    },

    close(peer, event) {
        console.log("[ws] close", peer, event);
    },

    error(peer, error) {
        console.log("[ws] error", peer, error);
    },
})