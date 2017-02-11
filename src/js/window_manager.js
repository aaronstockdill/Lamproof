const {
    BrowserWindow,
    dialog
} = require('electron')
const path = require('path')
const url = require('url')


module.exports = class WindowManager
{

    constructor (ipc) {
        this.ipc = ipc
        this.window_counter = 0
        this.no_windows = true
        this.windows = new Map()
        this.about_dialog = null
        this.untitled_number = 1
        const self = this

        ipc.on('request-new-window',
            this._onRequestCreateNewWindow.bind(this));
        ipc.on('request-send-message',
            this._onRequestSendMessage.bind(this));
        ipc.on('request-get-window-ids',
            this._onRequestGetWindowIDs.bind(this));
    }

    getFocusedWindow () {
        return BrowserWindow.getFocusedWindow()
    }

    reload () {
        const win = BrowserWindow.getFocusedWindow()
        if (win) {
            win.reload()
        }
    }

    toggleDevTools () {
        const win = BrowserWindow.getFocusedWindow()
        if (win) {
          win.toggleDevTools()
        }
    }

    closeWindow () {
        const win = BrowserWindow.getFocusedWindow()
        if (win) {
            const id = win.id
            win.close()
            this.windows.delete(id)
        }
    }

    send (event_name, ...parameters) {
        const win = BrowserWindow.getFocusedWindow()
        if (win) {
            win.webContents.send(event_name, ...parameters)
        }
    }

    createNewWindow (ready_func) {
        const self = this
        const win = new BrowserWindow({
            width: 800,
            height: 600,
            titleBarStyle: 'hidden',
            minWidth: 400,
            minHeight: 400,
            resizeable: true,
            show: false
        })
        const id = win.id
        win.setSheetOffset(23)
        win.dirty = false

        win.once('ready-to-show', () => {
            if (ready_func) {
                ready_func()
            }
            win.show()
        })

        win.loadURL(url.format({
            pathname: path.join(__dirname, "../html/index.html"),
            protocol: 'file:',
            slashes: 'true'
        }) + '#' + id)

        win.on('closed', () => {
            this.windows.delete(id)
            this._notifyUpdateWindowIDs(id)
            self.window_counter -= 1
            if (self.window_counter == 0) {
                self.no_windows = true;
            }
        })

        win.on('close', (ev) => {
            if (win.dirty) {
                const choices = ["Save", "Discard", "Cancel"]
                var choice = dialog.showMessageBox(win,
                {
                    title: "Do you want to save changes to this file?",
                    message: "If you do not save the file, any changes you have made will be lost.",
                    buttons: choices,
                    defaultId: 0,
                    cancelId: 2
                });
                if(choices[choice] == "Save"){
                    ev.preventDefault();
                    win.webContents.send('save-file-request', 'save-file-data', 'save-new-file-data')
                } else if (choices[choice] == "Cancel") {
                    ev.preventDefault();
                }
            }
        })

        win.on('blur', () => {
            win.webContents.send('window-blur')
        })

        win.on('focus', () => {
            win.webContents.send('window-focus')
        })

        this.windows.set(id, win)
        this.window_counter += 1
        this.no_windows = false;

        return win
    }

    createAboutWindow () {
        if (this.about_dialog) { return; }

        const win = new BrowserWindow({
            width: 250,
            height: 300,
            resizable: false,
            alwaysOnTop: true,
            minimizable: false,
            maximizable: false,
            fullscreenable: false,
            titleBarStyle: 'hidden'
        })

        win.setMenu(null)

        win.on('closed', () => {
            this.about_dialog = null;
        })

        win.loadURL(url.format({
            pathname: path.join(__dirname, "../html/about.html"),
            protocol: 'file:',
            slashes: 'true'
        }))

        this.about_dialog = win
    }

    _notifyUpdateWindowIDs (exclude_id) {
        const window_ids = []
        for (let key of this.windows.keys()) {
            window_ids.push(key)
        }
        this.windows.forEach((win) => {
            if (win.id == exclude_id) { return; }
            win.webContents.send(
                'update-window-ids',
                window_ids
            )
        })
    }

    _onRequestCreateNewWindow (ev) {
        const created_window = this.createNewWindow()
        ev.sender.send('finish-create-new-window')
        this._notifyUpdateWindowIDs(created_window.id)
    }

    _onRequestSendMessage (ev, id, message) {
        const win = this.windows.get(id)
        if (win) {
            win.webContents.send('update-message', message)
        }
        ev.sender.send('finished-send-message')
    }

    _onRequestGetWindowIDs (ev) {
        const window_ids = Array.from(this.window.keys())
        ev.sender.send('finish-get-window-ids', window_ids)
    }
}
