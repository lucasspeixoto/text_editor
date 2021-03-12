/*Em Electron, temos 2 processos, um de gerenciamento da aplicação
e outro de renderização das telas*/

// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, dialog, ipcMain, shell } = require('electron')
//const { writeFile } = require('original-fs')
const fs = require('fs')
const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null
async function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: __dirname + '/images/logo.ico',
    webPreferences: {
      nodeIntegration: true
    }

  })

  // Load the index.html of the app.
  await mainWindow.loadFile('src/pages/editor/index.html')

  //Open devtools content
  //mainWindow.webContents.openDevTools() 

  createNewFile() //Ja abrir com o nome do arquivo

  ipcMain.on('update-content', function (event, data) {
    file.content = data
  })

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

//Salvar o arquivo no disco
function writeFile(filePath) {
  try {
    fs.writeFile(filePath, file.content, function (error) {
      //Erro
      if (error) throw error

      //Arquivo Salvo
      file.path = filePath;
      file.saved = true;
      file.name = path.basename(filePath)
      /*Para receber o content, vamos usar o ipcRenderer para enviar
      o conteudo, igual usamos para receber
      */

      mainWindow.webContents.send('set-file', file)
    })
  } catch (e) {
    console.log(e)
  }
}


// Save As
async function saveFileAs() {

  //Dialog
  let dialogFile = await dialog.showSaveDialog({
    defaultPath: file.path
  });

  //Verificar Cancelamento
  if (dialogFile.canceled) {
    return false
  }

  writeFile(dialogFile.filePath)
}

//Save
function saveFile() {
  //save
  if (file.saved) {
    return writeFile(file.path)
  
    //save as
  } else {
    return saveFileAs(file.path)
  }

}

//Read file
function readFile(filePath){
  try {
    return fs.readFileSync(filePath, 'utf-8')
  } catch (e) {
    console.log(e)
    return ''
  }
}

//Open file
async function openFile(){
  //dialog
  let dialogFile = await dialog.showOpenDialog({
    defaultPath: file.path
  })

  //Verificar cancelamento
  if (dialogFile.canceled) return false

  //Abrir
  file = {
    name: path.basename(dialogFile.filePaths[0]),
    content: readFile(dialogFile.filePaths[0]),
    saved: true,
    path: dialogFile.filePaths[0]
  }

  //Emitir o evento (Abrir o arquivo no projeto)
  mainWindow.webContents.send('set-file', file)
}

//Template Menu
const templateMenu = [
  {
    label: 'Arquivo',
    submenu: [
      {
        label: 'Novo',
        accelerator: 'CmdOrCtrl+N',
        click() {
          createNewFile()
        }
      },
      {
        label: 'Abrir',
        accelerator: 'CmdOrCtrl+O',
        click() {
          openFile()
        }
      },
      {
        label: 'Salvar',
        accelerator: 'CmdOrCtrl+S',
        click() {
          saveFile()
        }
      },
      {
        label: 'Salvar como',
        accelerator: 'CmdOrCtrl+Shift+N',
        click() {
          saveFileAs()
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Sair',
        accelerator: 'CmdOrCtrl+Q',
        role: process.platform === 'darwin' ? 'close' : 'quit' //darwin: mac
      }
    ]

  },
  {
    label:'Editar',
    submenu:[
      {
        label:'Desfazer',
        role:'undo'
      },
      {
        label: 'Refazer',
        role: 'redo'
      },

      {
        type: 'separator'
      },


      {
        label: 'Copiar',
        role: 'copy'
      },
      {
        label: 'Cortar',
        role: 'cut'
      },
      {
        label: 'Colar',
        role: 'paste'
      }
    ]
  },
  {
    label:'Ajuda',
    submenu:[
      {
        label: 'Electron',
        click(){
          shell.openExternal('https://www.electronjs.org/')
        }
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
