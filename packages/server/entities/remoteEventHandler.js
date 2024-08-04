const Player = require("./player")

class RemoteEventHandler {
    constructor(server) {
        this.server = server
        this.io = server.io
        this.io.on('connection', (socket) => {
            this.registerEvents(socket)
            this.io.emit('PlayerCount', { count: this.io.engine.clientsCount })
            this.keys = {}

            socket.data.player = server.addPlayer(socket)
        })
    }
    registerEvents(socket) {
        let events = []
        events.push("disconnect")
        events.push("CreateGame")
        events.push("JoinGame")
        events.push('KeyUpEvent')
        events.push('KeyDownEvent')
        //add more like so ^

        for (let event of events) {
            socket.on(event, (data) => {
                this["on" + event](data, socket)
            })
        }
    }
    ondisconnect(data, socket) {
        this.io.emit('PlayerCount', { count: this.io.engine.clientsCount })
        if (socket.data.player.game) socket.data.player.game.onPlayerLeave(socket.data.player)
        this.server.removePlayerBySocketId(socket.id)
    }
    onCreateGame(data, socket) {
        let game = this.server.addGame(socket.data.player)
        socket.data.player.joinGame(data.username, game)
        socket.data.player.isOwnerOfGame = true;
    }
    onJoinGame(data, socket) {
        let player = socket.data.player
        let game = server.findGameById(data.gameId)
        if (!game) return

        player.joinGame(data.username, game)
    }
    onKeyUpEvent(data, socket) {//data = {pressed:boolean}
        if (data.pressed) {
            socket.data.player.keys.up = true
        }
        if (!data.pressed) {
            socket.data.player.keys.up = false
        }
    }
    onKeyDownEvent(data, socket) { //data = {pressed:boolean}
        if (data.pressed) {
            socket.data.player.keys.down = true
        }
        else {
            socket.data.player.keys.down = false
        }
    }
}
module.exports = RemoteEventHandler