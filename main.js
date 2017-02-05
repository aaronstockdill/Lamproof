const {
    app,
    BrowserWindow,
    globalShortcut,
    Menu,
    ipcMain
} = require('electron')
const path = require('path')
const url = require('url')
const Menubar = require('./src/js/menubar')
const WindowManager = require('./src/js/window_manager')

const wm = new WindowManager(ipcMain)
const menubar = new Menubar(wm)

ipcMain.on('ready-to-show', (ev) => {
    ev.sender.send('set-title',
                   "Untitled " + wm.untitled_number)
    wm.untitled_number += 1
})

app.on('ready', () => {
    const menu = Menu.buildFromTemplate(menubar.menu_template)
    Menu.setApplicationMenu(menu)
    wm.createNewWindow()
})

app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (wm.no_windows) {
    wm.createNewWindow()
  }
})
