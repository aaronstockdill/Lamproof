const {
    app,
    BrowserWindow,
    globalShortcut,
    Menu,
    ipcMain,
    dialog
} = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs');
const Menubar = require('./src/js/menubar')
const WindowManager = require('./src/js/window_manager')

const wm = new WindowManager(ipcMain)
const menubar = new Menubar(wm)

ipcMain.on('ready-to-show', (ev) => {
    ev.sender.send('set-title',
                   "Untitled " + wm.untitled_number,
                   false)
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

ipcMain.on('save-file-data', (ev, thm, prfs) => {
    win = wm.getFocusedWindow()
    var output = ""
    output += "Theorem:\n"
    output += "\t" + thm
    output += "\n\n"
    output += "Proof:\n"
    output += prfs
    fs.writeFile(win.filename, output, function (err) {
        if(err){
            dialog.showErrorBox("Failed to save " + path.basename(filename),
                    "The file could not be saved: " + err.message)
        }

        console.log("The file has been succesfully saved")
        win.webContents.send('set-title',
                             path.basename(win.filename,
                                           path.extname(win.filename)),
                             true)
    })
})

ipcMain.on('save-new-file-data', (ev, basename, thm, prfs) => {
    const win = wm.getFocusedWindow()
    dialog.showSaveDialog(win, {
        filters:[
            { name: 'Proof', extensions: ['proof'] },
            { name: 'Plain', extensions: ['txt']}
        ],
        defaultPath: basename,
    }, (filename) => {
        if (filename === undefined){
            console.log("You didn't save the file")
            return;
        }
        var output = ""
        output += "Theorem:\n"
        output += "\t" + thm
        output += "\n\n"
        output += "Proof:\n"
        output += prfs
        fs.writeFile(filename, output, function (err) {
            if(err){
                console.log(err)
                dialog.showErrorBox("Failed to save " + path.basename(filename),
                                    "The file could not be saved: " + err.message)
            }

            console.log("The file has been succesfully saved")
            win.webContents.send('set-title',
                                 path.basename(filename,
                                               path.extname(filename)),
                                 true)
            win.filename = filename
        });
    })
})

ipcMain.on('set-dirty', (ev, id, value) => {
    var win = wm.windows.get(id)
    if (win == undefined) {
        win = wm.getFocusedWindow()
    }
    win.dirty = value
})
