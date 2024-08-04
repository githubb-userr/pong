export default class BaseMenu {
    constructor(game) {
        this.game = game
        this.addTriggerListeners ? this.addTriggerListeners():1
    }
    getEl() {
        throw new Error('Must implement getEl()')
    }
    open() {
        this.game.closeAllMenus()
        this.getEl().className = 'menu'
        this.onOpen()
    }
    close() {
        this.getEl().className = 'hidden'
        this.onClose()
    }
    onOpen() { }
    onClose() { }
}