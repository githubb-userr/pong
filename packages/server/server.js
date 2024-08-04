const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const config = require('../../config.json')
const Game = require('./entities/game')
const path = require('path')
const RemoteEventHandler = require('./entities/remoteEventHandler')
const Player = require('./entities/player')

class Server { //server controls everything
    constructor() {
        this.players = []
        this.games = []
        this.run()
        this.packagesPath = path.join(__dirname, '..')
    }
    run() {
        this.startServer()
    }
    addGame() {
        let game = new Game(this)
        this.games.push(game)
        return game
    }
    findGameById(id) {
        return this.games.find((game) => game.id === id);
    }
    addPlayer(socket) {
        let player = new Player(socket, this)
        this.players.push(player)
        return player;
    }
    removePlayerById(id) {
        this.players.map((player, i) => {
            if(player.id === id) {
                this.players.splice(i, 1)
            }
        })
    }
    findPlayerById(id) {
        this.player.map((player, i) => {
            if(player.id === id) return player
        })
    }
    removePlayerBySocketId(id) {
        this.players.map((player, i) => {
            if(player.socket.id === id) {
                this.players.splice(i, 1)
            }
        })
    }
    startServer() {
        this.app = express()
        this.httpServer = http.createServer(this.app)
        this.io = socketIo(this.httpServer)
        this.eventHandler = new RemoteEventHandler(this)
        this.httpServer.listen(config.server_listen_port, () => {
            console.log("server listening on port " + config.server_listen_port)
            this.setupHandlers()
        })
    }
    setupHandlers() {
        this.app.use(express.json())
        this.app.use(express.static(path.join(this.packagesPath, 'client')))
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(this.packagesPath, 'client', 'documents', 'index.html'))
        })
    }
}

module.exports = Server