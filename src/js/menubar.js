const {
    app,
    Menu
} = require('electron')


module.exports = class Menubar
{

    constructor (wm) {
        this.wm = wm
        const self = this
        this.menu_template = [
            {
                label: 'File',
                submenu: [
                    {
                        label: 'New Proof',
                        accelerator: 'CmdOrCtrl+N',
                        click () {
                            self.wm.createNewWindow()
                        }
                    },
                    {
                        label: 'Open...',
                        accelerator: 'CmdOrCtrl+O',
                        click () {
                            self.wm.send('open-file-data', "Unable to open files yet.")
                        }
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: "Save",
                        accelerator: 'CmdOrCtrl+S',
                        click () {
                            self.wm.send('save-file-request', "Unable to save files yet.")
                        }
                    },
                    {
                        label: "Save As...",
                        accelerator: 'Shift+CmdOrCtrl+S',
                        click () {
                            self.wm.send('save-file-request', "Unable to save files yet.")
                        }
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: "Close Window",
                        accelerator: 'CmdOrCtrl+W',
                        click () {
                            self.wm.closeWindow()
                        }
                    },
                    {
                        label: "Close All Windows",
                        accelerator: 'Shift+CmdOrCtrl+W',
                        click () {
                            while (self.wm.windows.size > 0) {
                                self.wm.closeWindow()
                            }
                        }
                    },
                ]
            },
            {
                label: 'Edit',
                submenu: [
                    {
                        role: 'undo'
                    },
                    {
                        role: 'redo'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        role: 'cut'
                    },
                    {
                        role: 'copy'
                    },
                    {
                        role: 'paste'
                    },
                    {
                        role: 'pasteandmatchstyle'
                    },
                    {
                        role: 'delete'
                    },
                    {
                        role: 'selectall'
                    }
                ]
            },
            {
                label: 'View',
                submenu: [
                    {
                        label: 'Reload',
                        click () {
                            self.wm.reload()
                        }
                    },
                    {
                        label: 'Toggle Developer Tools',
                        click () {
                            self.wm.toggleDevTools()
                        }
                    },
                    {
                        type: 'separator'
                    },
                    {
                        role: 'togglefullscreen'
                    }
                ]
            },
            {
                role: 'window',
                submenu: [
                    {
                        role: 'minimize'
                    },
                    {
                        role: 'close'
                    }
                ]
            },
            {
                role: 'help',
                submenu: [
                    {
                        label: 'Learn More',
                        click () { require('electron').shell.openExternal('http://electron.atom.io') }
                    }
                ]
            }
        ]

        if (process.platform === 'darwin') {
            this.menu_template.unshift({
                label: app.getName(),
                submenu: [
                    {
                        label: 'About ' + app.getName(),
                        click() {
                            self.wm.createAboutWindow()
                        }
                    },
                    {
                        type: 'separator'
                    },
                    {
                        role: 'services',
                        submenu: []
                    },
                    {
                        type: 'separator'
                    },
                    {
                        role: 'hide'
                    },
                    {
                        role: 'hideothers'
                    },
                    {
                        role: 'unhide'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        role: 'quit'
                    }
                ]
            })
            // Edit menu.
            this.menu_template[2].submenu.push(
                {
                    type: 'separator'
                },
                {
                    label: 'Speech',
                    submenu: [
                        {
                            role: 'startspeaking'
                        },
                        {
                            role: 'stopspeaking'
                        }
                    ]
                }
            )
            // Window menu.
            this.menu_template[4].submenu = [
                {
                    label: 'Close',
                    accelerator: 'CmdOrCtrl+W',
                    role: 'close'
                },
                {
                    label: 'Minimize',
                    accelerator: 'CmdOrCtrl+M',
                    role: 'minimize'
                },
                {
                    label: 'Zoom',
                    role: 'zoom'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Bring All to Front',
                    role: 'front'
                }
            ]
        }
    }
}
