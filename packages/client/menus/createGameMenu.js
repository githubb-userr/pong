import BaseMenu from '/menus/baseMenu.js'
export default class CreateGameMenu extends BaseMenu {
    getEl() {
        return document.querySelector('#createGameMenu')
    }
    addTriggerListeners() {
        document.querySelector('#createGameBtn').addEventListener('click', this.open.bind(this))
    }
}