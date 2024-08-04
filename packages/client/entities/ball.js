import timeout from "../helpers/timeout.js";

export default class Ball {
    constructor(game) {
        this.game = game
        this.container = game.container
    }
    async render() {
        this.texture = await PIXI.Assets.load("images/ball.png");
        this.sprite = new PIXI.Sprite(this.texture);

        this.container.addChild(this.sprite);
        this.sprite.anchor.set(0.5, 0.5)
    }
    async moveFromPointToPoint(x1, y1, x2, y2) {
        this.sprite.x = x1;
        this.sprite.y = y1;
        const startX = x1;
        const startY = y1;
        const deltaX = x2 - x1;
        const deltaY = y2 - y1;
        const duration = 100; // 100ms
        const framesPerSecond = 60;
        const totalFrames = (duration / 1000) * framesPerSecond;
        const msPerFrame = duration / totalFrames;
    
        for (let frame = 0; frame <= totalFrames; frame++) {
            const progress = frame / totalFrames;
    
            this.sprite.x = startX + deltaX * progress;
            this.sprite.y = startY + deltaY * progress;
    
            await timeout(msPerFrame);
        }
    
        this.sprite.x = x2;
        this.sprite.y = y2;
    }
    
    
    async move(x, y) {
        await this.moveFromPointToPoint(this.sprite.x, this.sprite.y, x, y)
    }
    isTouchingEdgeOfCanvas() {
        if(this.sprite.x >= this.game.app.canvas.width/2 - this.sprite.width/2 || this.sprite.y >= this.game.app.canvas.height/2 - this.sprite.height/2) {
            return true
        }
        if(this.sprite.x <= - this.game.app.canvas.width/2 + this.sprite.width/2 || this.sprite.y <= - this.game.app.canvas.height/2 + this.sprite.height/2) {
            return true
        }
        return false
    }
}