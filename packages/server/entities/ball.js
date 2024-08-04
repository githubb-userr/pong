let config = require('../../../config.json')
const randInt = require('../helpers/randInt')

class Ball {
    constructor(game) {
        this.game = game
        this.x = 0
        this.y = 0

        this.speed = 2000

        this.dx = null
        this.dy = null
        this.angle = null
    }
    start() {
        this.isMoving = true
        this.angle = Math.random() * Math.PI * 2
        this.dx = Math.cos(this.angle) * this.speed
        this.dy = Math.sin(this.angle) * this.speed
    }

    updatePos(delta) {
        this.x += this.dx * delta
        this.y += this.dy * delta

        this.changeDirectionIfTouchingEdge()
        this.changeDirectionIfTouchingPaddle()
    }
    changeDirectionIfTouchingPaddle() {
        const redPaddle = this.game.redPlayerPaddle;
        const bluePaddle = this.game.bluePlayerPaddle;
        //blue
        if (this.y >= bluePaddle.y - config.paddle_height / 2 &&
            this.y <= bluePaddle.y + config.paddle_height / 2 &&
            this.x <= bluePaddle.x + config.ball_width + config.paddle_width / 2 &&
            this.x >= bluePaddle.x + config.ball_width - config.paddle_width / 2) {
            this.dx *= -1
        }
        //red
        if (this.y >= redPaddle.y - config.paddle_height / 2 &&
            this.y <= redPaddle.y + config.paddle_height / 2 &&
            this.x + config.ball_width >= redPaddle.x + config.paddle_width / 2) {
                this.dx *= -1
            }
    }
    changeDirectionIfTouchingEdge() {
        if (this.x >= config.canvas_width / 2 - config.ball_width / 2) {
            this.dx *= -1
            this.game.addScore("blue")
        }
        if(this.x <= - config.canvas_width / 2 + config.ball_width / 2) {
            this.dx *= -1
            this.game.addScore("red")
        }
        if (this.y >= config.canvas_height / 2 - config.ball_height / 2 || this.y <= - config.canvas_height / 2 + config.ball_height / 2) {
            this.dy *= -1
        }
    }
    isTouchingEdgeOfCanvas() {
        if (this.x >= config.canvas_width / 2 - config.ball_width / 2 || this.y >= config.canvas_height / 2 - config.ball_height / 2) {
            return true
        }
        if (this.x <= - config.canvas_width / 2 + config.ball_width / 2 || this.y <= - config.canvas_height / 2 + config.ball_height / 2) {
            return true
        }
        return false
    }
    getRandomPositionOnEdgeOfCanvas() {
        let sideTouching = randInt(0, 3)
        let x, y
        //0: top, 1: right, 2: bottom, 3:left
        if (sideTouching == 0) { //top
            y = config.canvas_height / 2 - config.ball_width
            x = randInt(-config.canvas_width / 2, config.canvas_width / 2 - config.ball_width)
        }
        if (sideTouching == 1) { //right
            x = config.canvas_width / 2 - config.ball_width
            y = randInt(- config.canvas_height / 2, (config.canvas_height / 2) - config.ball_height)
        }
        if (sideTouching == 2) { //bottom
            y = (config.canvas_height / 2) - config.ball_height
            x = randInt(- config.canvas_width, config.canvas_width - config.ball_width)
        }
        if (sideTouching == 3) {//left
            x = - config.canvas_width / 2
            y = randInt(-(config.canvas_height / 2) - config.ball_height)
        }
        return { x: x, y: y }
    }
    
}
module.exports = Ball