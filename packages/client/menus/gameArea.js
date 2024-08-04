import BaseMenu from '/menus/baseMenu.js'
export default class GameArea extends BaseMenu {
    getEl() {
        return document.querySelector('#gameArea')
    }
}