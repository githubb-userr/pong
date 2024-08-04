export default class EventHandler {
    constructor(game) {
        this.socket = game.socket
        this.game = game
        this.registerEvents()
    }
    handleEvent(eventName, data) {
        this["on"+eventName](data)
    }
    registerEvents() {
        let events = []
        events.push('PlayerCount')
        events.push('PlayerData')
        events.push('GameData')
        events.push('GameStarted')
        events.push('GameForfeit')
        events.push('InvalidInviteCode')
        events.push('Scored')
        events.push('BallMove')
        events.push('PlayerMove')
        events.push('LeaveGame')
        //add more events here ^

        for(let event of events) {
            this.socket.on(event, data => {
                this.handleEvent(event, data)
            })
        }
    }
    onScored(data) {
        let el = document.querySelector("#"+data.color + "Score")
        el.innerText = Number(el.innerText) + 1
    }
    onPlayerCount(data) {
        document.querySelectorAll('#playersOnlineIndicator').forEach(el => {
            el.innerText = `Players online: ${data.count}`
        })
    }
    onLeaveGame(data) {
        this.game.onLeaveGame()
    }
    onPlayerData(data) {
        this.game.playerId = data.id
    }
    onGameData(data) {
        this.gameId = data.id

        document.querySelector('#gameIdContainer').innerText = this.gameId
    }
    onGameStarted(data) {
        this.game.onGameStarted(data)
    }
    onGameForfeit(data) {
        alert(`You have won, as ${data.forfeiterUsername} has forfeited.`)
        this.game.onLeaveGame()
    }
    onInvalidInviteCode() {
        document.querySelector('#joinGameError').innerText = 'Invalid invite code.'
    }
    onBallMove(data) {
        this.game.ball.move(data.x, data.y)
    }
    onPlayerMove(data) {//data = {color: "red"/"blue", playerX: int, playerY: int}
        this.game.onPlayerMove(data)
    }
}