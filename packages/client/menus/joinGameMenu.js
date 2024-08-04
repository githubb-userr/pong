import BaseMenu from '/menus/baseMenu.js'
export default class JoinGameMenu extends BaseMenu {
    getEl() {
        return document.querySelector('#joinGameMenu')
    }
    addTriggerListeners() {
        document.querySelector('#joinGameBtn').addEventListener('click', this.open.bind(this))
    }
}