export default class InputHandler {
    constructor(game) {
        this.game = game
        this.keys = {}
        document.addEventListener('keydown', this.onGlobalKeyDown.bind(this))
        document.addEventListener('keyup', this.onGlobalKeyUp.bind(this))
    }
    onGlobalKeyDown(e) {
        this.keys[e.key] = true

        if(typeof this["on"+e.key+"Press"] == "function") {
            this["on"+e.key+"Press"]()
        }
    }
    onGlobalKeyUp(e) {
        this.keys[e.key] = false

        if(typeof this["on"+e.key+"Unpress"] == "function") {
            this["on"+e.key+"Unpress"]()
        }
    }
    onArrowUpPress() {
        if(!this.game.paddle) return
        if(this.keys.up) return

        this.game.socket.emit("KeyUpEvent", {pressed: true})
    }
    onArrowUpUnpress() {
        if(!this.game.paddle) return
        if(this.keys.up) return

        this.game.socket.emit("KeyUpEvent", {pressed: false})
    }
    onArrowDownPress() {
        if(!this.game.paddle) return
        if(this.keys.down) return

        this.game.socket.emit('KeyDownEvent', {pressed: true})
    }
    onArrowDownUnpress() {
        if(!this.game.paddle) return
        if(this.keys.down) return
        this.game.socket.emit('KeyDownEvent', {pressed: false})
    }
}