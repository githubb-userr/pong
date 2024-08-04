import BaseMenu from '/menus/baseMenu.js'
export default class GameWaitingMenu extends BaseMenu {
    getEl() {
        return document.querySelector('#gameWaitingMenu')
    }
    addTriggerListeners() {
    }
}