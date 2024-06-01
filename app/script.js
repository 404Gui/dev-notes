const notesContainer = document.querySelector("#notes-container")
const noteInput = document.querySelector("#note-content")
const addBotao = document.querySelector(".add-note")

const procuraInput = document.querySelector("#search-input").addEventListener('keyup', (e) => {    
    const procura = e.target.value;
    buscarPorNotas(procura)
})

/// Funcoes
function addNota() { 

     const notas = pegarNotas()

        const noteObj = {
            id: gerarId(),
            conteudo: noteInput.value,
            fixed: false
        };    

    const elementoNota = criarElementos(noteObj.id, noteObj.conteudo)

    notesContainer.appendChild(elementoNota)

    notas.push(noteObj)

    salvarNotas(notas)

    noteInput.value = ''
}

function buscarPorNotas(procura) {
    const resultadoBusca = pegarNotas().filter((nota) => 
        nota.conteudo.includes(procura)
    );

    console.log(resultadoBusca);

    if(procura !== "") {
        limparNotas()
        resultadoBusca.forEach((nota) => {
            const elementoNota = criarElementos(nota.id, nota.conteudo)
            notesContainer.appendChild(elementoNota)
        });
        return;
    }   
    limparNotas()
    mostrarNotas()     
        
}

function limparNotas() {
    notesContainer.replaceChildren([])
}

function mostrarNotas() {
    limparNotas()
    pegarNotas().forEach((nota) => {
        const elementoNota = criarElementos(nota.id, nota.conteudo, nota.fixed)

        notesContainer.appendChild(elementoNota)
    })
}

// Localstorage

function salvarNotas(notas){
    localStorage.setItem("notas", JSON.stringify(notas))
}


function pegarNotas() {
    const notas = JSON.parse(localStorage.getItem("notas") || "[]")

    const ordemDasNotas = notas.sort((a, b) => a.fixed > b.fixed ? -1 : 1)

    return ordemDasNotas
}

function criarElementos(id, conteudo, fixed) {

    const elemento = document.createElement("div")
    elemento.classList.add("note")
    
    const textArea = document.createElement("textarea")
    textArea.value = conteudo
    textArea.placeholder = "Busque por um texto"
    
    elemento.appendChild(textArea)
    
    const pinIcon = document.createElement("i")
    pinIcon.classList.add(...['bi', 'bi-pin'])
    elemento.appendChild(pinIcon)

    const deletarIcon = document.createElement("i")
    deletarIcon.classList.add(...['bi', 'bi-x-lg'])
    elemento.appendChild(deletarIcon)

    const duplicarIcon = document.createElement("i")
    duplicarIcon.classList.add(...['bi', 'bi-file-earmark-plus'])
    elemento.appendChild(duplicarIcon)
    
    if(fixed) {
        elemento.classList.add('fixed')
    }
    

    // Events desse elemento
    elemento.querySelector('textArea').addEventListener('keyup', (e) => {
        const novConteudo = e.target.value

        atualizarCampo(id, novConteudo)
        
    })

    elemento.querySelector('.bi-pin').addEventListener('click', () => {
        mudarFixado(id)
    })   

    elemento.querySelector('.bi-x-lg').addEventListener('click', () => {
        deletarNota(id, elemento)
    })   

    elemento.querySelector('.bi-file-earmark-plus').addEventListener('click', () => {
        copiarNota(id)
    })     
    
       
    return elemento;
}


function atualizarCampo(id, novoConteudo) {
    const notas = pegarNotas()

    const notaAlvo = notas.filter((nota) => nota.id === id)[0]

    notaAlvo.conteudo = novoConteudo

    salvarNotas(notas)
}

function copiarNota(id) {
    const notas = pegarNotas()

    const notaAlvo = notas.filter((note) => note.id === id)[0]

    const noteObj = {
        id: gerarId(),
        conteudo: notaAlvo.conteudo,
        fixed: false
    };  

    const elementoNota = criarElementos(noteObj.id, noteObj.conteudo, noteObj.fixed)

    notesContainer.appendChild(elementoNota)

    notas.push(noteObj)

    salvarNotas(notas)

}


function deletarNota(id, elemento){
    const notes = pegarNotas().filter((note) => note.id !== id)

    salvarNotas(notes)
    notesContainer.removeChild(elemento)
}

function mudarFixado(id) {
    const notas = pegarNotas()

    const notaAlvo = notas.filter((note) => note.id === id)[0]

    notaAlvo.fixed = !notaAlvo.fixed

    salvarNotas(notas)
    mostrarNotas()
}

function gerarId(){
    return Math.floor(Math.random() * 5000)

}

// Eventos
addBotao.addEventListener('click', () => addNota())

noteInput.addEventListener('keydown', (e) => {
    if(e.key === "Enter") {
        addNota()
    }
})



// Inicialização

mostrarNotas()
