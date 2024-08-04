const config = require('../../../config.json')

class Paddle {
    constructor(game, color) {
        this.game = game
        this.color = color
        this.y = 0;
        if(this.color === "red") {
            this.x = 480;
        } else {
            this.x = -480
        }
    }
    isTouchingEdgeOfCanvas() {
        if(this.y >= config.canvas_height/2-config.paddle_height/2) return
        if(this.y <= -config.canvas_height/2 + config.paddle_height / 2) return
        return
    }
}
module.exports = Paddle