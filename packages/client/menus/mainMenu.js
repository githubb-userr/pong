import BaseMenu from '/menus/baseMenu.js'
export default class MainMenu extends BaseMenu {
    getEl() {
        return document.querySelector('#mainMenu')
    }
    addTriggerListeners() {
        document.querySelector('#joinGameCancelBtn').addEventListener('click', this.open.bind(this))
        document.querySelector('#createGameCancelBtn').addEventListener('click', this.open.bind(this))
    }
}