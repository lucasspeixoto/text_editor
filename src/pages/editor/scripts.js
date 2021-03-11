
const { ipcRenderer } = require("electron")
//Por padrão o electron não traz as integrações com o node liberadas, precisamos informar
//(Adicionar em mainWindone o WebPreferences) 

//Chamar o set-file
ipcRenderer.on('set-file', function(event, data){
    console.log(data)
}) 

