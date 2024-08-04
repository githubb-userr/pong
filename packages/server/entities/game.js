const randInt = require('../helpers/randInt')
const randomCharGenerator = require('../helpers/randomCharGenerator')
const GameTicker = require("./gameTicker")
const Ball = require('./ball')
const Paddle = require('./paddle')
const config = require('../../../config.json')
class Game {
    constructor(server) {
        this.server = server
        this.id = randomCharGenerator(10)
        this.gameOwner = null
        this.players = []
        this.gameTicker = new GameTicker(this)
        this.redScore = 0
        this.blueScore = 0
    }
    start() {
        if (this.players.length != 2) return

        this.redPoints = 0;
        this.bluePoints = 0;
        this.ball = new Ball(this)

        let playerColors = randInt(0, 1)
        if (playerColors) {
            this.bluePlayer = this.players[0]
            this.players[0].color = "blue"
            this.redPlayer = this.players[1]
            this.players[1].color = "red"
        } else {
            this.redPlayer = this.players[0]
            this.players[0].color = "red"
            this.bluePlayer = this.players[1]
            this.players[1].color = "blue"
        }
        this.redPlayerPaddle = new Paddle(this, 'red')
        this.bluePlayerPaddle = new Paddle(this, 'blue')

        this.bluePlayer.socket.emit('GameStarted', { color: 'blue', blueUsername: this.bluePlayer.username, redUsername: this.redPlayer.username })
        this.redPlayer.socket.emit('GameStarted', { color: 'red', blueUsername: this.bluePlayer.username, redUsername: this.redPlayer.username })

        setTimeout(() => {
            this.ball.start()
        },3000)
    }
    addScore(color) {
        this.broadcast("Scored", {color: color})
        this[color+"Score"] += 1
        
        if(this.redScore == 5) {
            this.end("red")
        }
        if(this.blueScore == 5) {
            this.end('blue')
        }
    }
    findPlayerById(id) {
        return this.players.find((player) => player.id === id);
    }
    onPlayerLeave(player) {
        this.removePlayerById(player.id)

        if (this.players.length) {
            this.broadcast("GameForfeit", { forfeiterUsername: player.username })
        }

        this.end(null)
    }
    removePlayerById(id) {
        this.players.map((player, i) => {
            if (player.id === id) {
                this.players.splice(i, 1)
            }
        })
    }
    broadcast(event, data) {
        if (!event) return

        for (let player of this.players) {
            player.socket.emit(event, data)
        }
    }
    end(winner) {
        this.redPlayer.leaveGame(winner)
        this.bluePlayer.leaveGame(winner)
        this.server.games.map((game, index) => {
            if (game.id === this.id) {
                this.server.games.splice(index, 1)
            }
        })
        clearInterval(this.gameTicker.interval)
    }
    isGameStarted() {
        if (this.bluePlayer && this.redPlayer) return true
        return false
    }
    movePaddles() {
        this.movePlayerPaddle("red")
        this.movePlayerPaddle("blue")
    }
    movePlayerPaddle(color) {
        if (!this.isGameStarted()) return

        if (this[color + "Player"].keys.up && !this[color + "Player"].keys.down) {
            if (this[color + "PlayerPaddle"].y - config.paddle_speed <= -config.canvas_height / 2 + config.paddle_height / 2) {
                this.broadcast("PlayerMove", { playerColor: color, playerX: this[color + "PlayerPaddle"].x, playerY: -config.canvas_height / 2 + config.paddle_height / 2 })
                this.y = -config.canvas_height / 2 + config.paddle_height / 2
                return
            }
            this.broadcast("PlayerMove", { playerColor: color, playerX: this[color + "PlayerPaddle"].x, playerY: this[color + "PlayerPaddle"].y - 20 })
            this[color + "PlayerPaddle"].y -= config.paddle_speed
        }

        if (this[color + "Player"].keys.down && !this[color + "Player"].keys.up) {
            if (this[color + "PlayerPaddle"].y + config.paddle_speed >= config.canvas_height / 2 - config.paddle_height / 2) {
                this.broadcast("PlayerMove", { playerColor: color, playerX: this[color + "PlayerPaddle"].x, playerY: config.canvas_height / 2 - config.paddle_height / 2 })
                this.y = config.canvas_height / 2 - config.paddle_height / 2
                return
            }
            this.broadcast("PlayerMove", { playerColor: color, playerX: this[color + "PlayerPaddle"].x, playerY: this[color + "PlayerPaddle"].y + 20 })
            this[color + "PlayerPaddle"].y += 20
        }
    }
}
module.exports = Game