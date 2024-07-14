let peers = []

export default defineWebSocketHandler({
    open(peer) {
        console.log("[ws] open", peer);
        peers.push(peer)
    },
    async message(peer, message) {
        message = { ...JSON.parse(message.text()), updateTime: new Date().getTime() }
        console.log(`[${message.type}  message]`, message);
        const devicesInfo = await useStorage('data').getItem('devices')
        const index = devicesInfo.devices.findIndex(device => device.id === message.id);
        if (index !== -1) {
            // 设备已存在，更新状态
            devicesInfo.devices[index] = message;
        } else {
            // 设备不存在，创建并添加
            devicesInfo.devices.push(message);
        }
        await useStorage('data').setItem('devices', devicesInfo)
        peers.forEach(peer => { peer.send(message) })

    },

    close(peer, event) {
        console.log("[ws] close", peer, event);
        peers = peers.filter(p => p !== peer)
    },

    error(peer, error) {
        console.log("[ws] error", peer, error);
    },
})