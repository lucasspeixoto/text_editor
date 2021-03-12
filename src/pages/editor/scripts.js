
const { ipcRenderer } = require("electron")
//Por padrão o electron não traz as integrações com o node liberadas, precisamos informar
//(Adicionar em mainWindone o WebPreferences) 

//Elementos
const textarea = document.getElementById('text')
const title = document.getElementById('title')

//Chamar o set-file
ipcRenderer.on('set-file', function(event, data){
    textarea.value = data.content
    title.innerHTML = data.name + ' - Bloco de Notas (Te amo <3)'
}) 

//Update textarea
function handleChangeText(){
    ipcRenderer.send('update-content', textarea.value) //Enviando o conteudo da textarea para o main
}
