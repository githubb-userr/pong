const randomCharGenerator = require('../helpers/randomCharGenerator')
const Game = require('./game')
class Player {
    constructor(socket, server) {
        this.id = randomCharGenerator(30)
        this.socket = socket
        this.server = server
        this.isInGame = false
        this.username = null
        this.game = null
        this.isOwnerOfGame = null
        this.gameId = null
        this.color = null
        this.keys = {}

        this.socket.emit('PlayerData', {id: this.id})
    }
    joinGame(username, game) {
        if(typeof game != 'object') throw new Error("Cannot join an undefined game")
        if(game.players.length == 2) return //game already full
        if(!username) username = this.id
        username = username.slice(0, 20)
        this.username = username
        this.gameId = game.id
        this.isInGame = true
        this.game = game
        game.players.push(this)

        if(game.players.length == 2) {
            game.start()
        }

        this.socket.emit("GameData", {id:this.gameId})
    }
    leaveGame(winner=null) {
        this.socket.emit('LeaveGame', {winnerColor: winner})


        if(!this.game) return
        if(this.game.players.length == 1) {
            this.server.findGameById(this.game.id)
        }
        this.game = null
        this.gameId = null
        this.color = null
        this.isInGame = false
        this.isOwnerOfGame = null
        this.keys = {}

    }
}
module.exports = Player