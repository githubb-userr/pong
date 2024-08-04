class GameTicker {
    constructor(game) {
        this.game = game
        this.interval = setInterval(this.onTick.bind(this),100)
    }
    onTick() {
        this.game.movePaddles()
        if(!this.game.ball) return
        this.game.ball.updatePos(0.016)
        this.game.broadcast("BallMove", {x: this.game.ball.x, y: this.game.ball.y})
    }
}
module.exports = GameTicker