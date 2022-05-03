import Dialog from './dialog'

const element = document.querySelector('#my-dialog') as HTMLElement
const dialog = new Dialog(element)

const button = document.querySelector('#toggle-dialog')
button.addEventListener('click', dialog.show)
