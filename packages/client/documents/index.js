import Ball from '../entities/ball.js'
import EventHandler from '../entities/eventHandler.js'
import InputHandler from '../entities/inputHandler.js'
import Paddle from '../entities/paddle.js'
import CreateGameMenu from '../menus/createGameMenu.js'
import GameArea from '../menus/gameArea.js'
import GameWaitingMenu from '../menus/gameWaitingMenu.js'
import JoinGameMenu from '../menus/joinGameMenu.js'
import MainMenu from '../menus/mainMenu.js'

document.addEventListener('DOMContentLoaded', () => {
    class Game {
        constructor() {
            this.menus = {}
            this.menus.joinGameMenu = new JoinGameMenu(this)
            this.menus.mainMenu = new MainMenu(this)
            this.menus.createGameMenu = new CreateGameMenu(this)
            this.menus.gameWaitingMenu = new GameWaitingMenu(this)
            this.menus.gameArea = new GameArea(this)

            this.establishConnection()
            this.initializeButtons()
            this.initInputHandler()
        }
        initializeButtons() {
            document.querySelector('#createGameActionBtn').addEventListener('click', this.onCreateGameButtonClicked.bind(this))
            document.querySelector('#joinGameSubmitBtn').addEventListener('click', (this.onJoinGameButtonClicked.bind(this)))
        }
        initInputHandler() {
            this.inputHandler = new InputHandler(this)
        }
        closeAllMenus() {
            for (let menu in this.menus) {
                this.menus[menu].close()
            }
        }
        establishConnection() {
            this.socket = io()
            this.socket.on('connect', () => { console.log('Connected.') })
            this.eventHandler = new EventHandler(this)
        }
        onCreateGameButtonClicked() {
            let username = document.querySelector('#createGameUsernameInput').value
            if (username.length > 20) {
                document.querySelector('#createGameError').innerText = 'Username cannot be > 20 characters.'
                return
            }
            this.socket.emit('CreateGame', { username: username.trim() })
            document.querySelector('#createGameActionBtn').addEventListener('click', this.menus.gameWaitingMenu.open())
        }
        onJoinGameButtonClicked() {
            let username = document.querySelector('#playerName').value
            let gameId = document.querySelector('#gameCode').value
            if (username.length > 20) {
                document.querySelector('#joinGameError').innerText = 'Username cannot be > 20 characters.'
                return
            }
            if (gameId.length != 10) {
                document.querySelector('#joinGameError').innerText = 'Invalid invite code.'
                return
            }
            this.socket.emit('JoinGame', { gameId: gameId, username: username })
        }
        onLeaveGame(data) {
            this.gameId = null;
            this.game = null;
            this.container = null;
            this.ball = null;
            this.paddle = null;
            this.opponentPaddle = null;
            this.app.canvas.remove()
            this.app = null;
            document.querySelector('#canvasContainer').innerHTML = ''

            this.menus.mainMenu.open()

            if(!data.winnerColor) return
            if (data.winnerColor == this.color) {
                alert('You have won! Leaving game...')
            }
            else {
                alert("You have lost. Leaving game...")
            }
        }
        async onGameStarted(data) {
            //blue left, red right
            this.color = data.color
            let redUsername = data.redUsername
            let blueUsername = data.blueUsername
            if (this.app) delete this.app

            this.menus.gameArea.open()
            document.querySelector('#redUsername').innerText = redUsername
            document.querySelector('#blueUsername').innerText = blueUsername

            document.querySelector('#redScore').innerText = 0
            document.querySelector('#blueScore').innerText = 0

            await this.loadPixijs()
        }
        async loadPixijs() {
            this.app = new PIXI.Application()
            await this.app.init({ width: 1000, height: 700 })
            document.querySelector("#canvasContainer").appendChild(this.app.canvas)

            this.container = new PIXI.Container({
                x: this.app.screen.width / 2,
                y: this.app.screen.height / 2
            });
            this.app.stage.addChild(this.container);
            this.ball = new Ball(this)
            await this.ball.render()
            this.paddle = new Paddle(this, this.color)
            await this.paddle.render()
            this.opponentPaddle = new Paddle(this, this.color === "red" ? "blue" : "red")
            await this.opponentPaddle.render()
        }
        onPlayerMove(data) {
            let paddle;
            if (this.paddle.color === data.playerColor) paddle = this.paddle
            else paddle = this.opponentPaddle

            paddle.moveTo(data.playerX, data.playerY)
        }
    }
    window.game = new Game()
})