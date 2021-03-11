/*Em Electron, temos 2 processos, um de gerenciamento da aplicação
e outro de renderização das telas*/

// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu } = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null
async function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }

  })

  // Load the index.html of the app.
  await mainWindow.loadFile('src/pages/editor/index.html')
  
  //Open devtools content
  mainWindow.webContents.openDevTools() 
  }

  //File
  var file = {}

  //Create new file
  function createNewFile() {
    file = {
      name: 'novo_arquivo.txt',
      content: '',
      saved: false,
      path: app.getPath('documents') + '/novo_arquivo.txt'
    }

    //Send message to the renderer process (index receive)
    mainWindow.webContents.send('set-file', file)
    //In the main we can use send, but in the renderer, the ipc
    
  }

  //Template Menu
  const templateMenu = [
    {
      label: 'Arquivo',
      submenu: [
        {
          label: 'Novo',
          click() {
            createNewFile()
          }
        },
        {
          label: 'Abrir'
        },
        {
          label: 'Salvar'
        },
        {
          label: 'Salvar como'
        },
        {
          label: 'Sair',
          role: process.platform === 'darwin' ? 'close' : 'quit' //darwin: mac
        }
      ]

    }
  ]

  //Menu
  const menu = Menu.buildFromTemplate(templateMenu)
  Menu.setApplicationMenu(menu)

  //On Ready
  app.on('ready', createWindow)
  
  //Activate
  app.on('activate', function () {
    if (mainWindow === null) {
      createWindow()
    }
  })

  












  /*
  //file 
  var file = {}

  //Create new file
  function createNewFile() {
    file = {
      name: 'novo-arquivo.txt',
      content: '',
      saved: false,
      path: app.getPath('documents') + '/novo-arquivo.txt'
    };
    //Enviando mensagem para nosso processo renderizador
    mainWindow.webContents.send('set-file', file)
  }

  //Template Menu
  const templateMenu = [
    {
      label: 'Arquivo',
      submenu: [
        {
          label: 'Novo',
          click() {
            createNewFile()
          }
        },
        {
          label: 'Abrir'
        },
        {
          label: 'Salvar'
        },
        {
          label: 'Salvar como'
        },
        {
          label: 'Sair',
          role: process.platform === 'darwin' ? 'close' : 'quit' //darwin: mac
        }
      ]

    }
  ]

  //Menu
  const menu = Menu.buildFromTemplate(templateMenu)
  Menu.setApplicationMenu(menu)


  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
//}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


*/