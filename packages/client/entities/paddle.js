import timeout from "/helpers/timeout.js";

export default class Paddle {
    constructor(game, color) {
        this.game = game
        this.container = game.container
        this.color = color
    }
    async render() {
        if (!this.color) throw new Error("Cannot render without a color")
        this.texture = await PIXI.Assets.load("images/slider.png");
        this.sprite = new PIXI.Sprite(this.texture)
        this.container.addChild(this.sprite)

        this.sprite.anchor.set(0.5, 0.5);

        switch (this.color) {
            case "blue":
                this.sprite.x = - this.game.app.canvas.width / 2 + 20;
                this.sprite.tint = 0x0000ff
                break;
            case "red":
                this.sprite.x = this.game.app.canvas.width / 2 - 20
                this.sprite.tint = 0xff0000
        }
    }
    isTouchingEdgeOfCanvas() {
        if (this.sprite.y >= this.game.app.canvas.height / 2 - this.sprite.height / 2) return true
        if (this.sprite.y <= -this.game.app.canvas.height / 2 + this.sprite.height / 2) return true
        return false
    }
    moveTo(x, y) {
        let startx = this.sprite.x;
        let starty = this.sprite.y;

        let distanceX = x - startx;
        let distanceY = y - starty;

        let duration = 100; // Duration of the animation in milliseconds
        let startTime = null;

        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            let elapsedTime = currentTime - startTime;
            let t = elapsedTime / duration;

            if (t < 1) {
                this.sprite.x = startx + distanceX * t;
                this.sprite.y = starty + distanceY * t;
                requestAnimationFrame(animate);
            } else {
                this.sprite.x = x;
                this.sprite.y = y;
            }
        };

        requestAnimationFrame(animate);
    }

}