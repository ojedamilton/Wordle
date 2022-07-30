window.onload= function() {

    /// DECLARACION DE CONSTANTES /////////// 
    const enviar = document.querySelector('#play');
    const respuesta=[];
    const wordWin=[];
    const guessGrid = document.querySelector("[data-guess-grid]") // obtengo la grilla
    const WORD_LENGTH = 5
    const SEARCH_TOTAL = 100
    ////// LLAMADA A LA API /////////////////
    fetch(`https://api.datamuse.com/words?sp=?????&v=es&max=${SEARCH_TOTAL}`)
        .then(res=>res.json())
        .then(data=> data.map((actual)=> {return {word:eliminarTildes(actual.word)}},[]))
        .then(fin=>this.respuesta =[...fin])
    ////// Funciones aplicadas a la Api
    function eliminarTildes(texto)
    {
        return texto.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
    }
    function obtenerRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    enviar.addEventListener('click',()=>console.log( this.wordWin=this.respuesta[obtenerRandomInt(SEARCH_TOTAL)]))

    ////////// FUNCIONES GENERALES ///////////////////////
    //Inicializo capturando los eventos de CLICK y TECLA
    startInteraction();

    function startInteraction() 
    {
        document.addEventListener("click", handleMouseClick)
        document.addEventListener("keydown", handleKeyPress)
    }
    ///// Manejador Eventos Click &  Keydown ////

    function handleMouseClick(e) 
    {
        
        if (e.target.matches("[data-key]")) {
            // le envio el valor(letra) que tengo guardado en el data-key
            pressKey(e.target.dataset.key)
            return
        }

        if (e.target.matches("[data-delete]")) {
            deleteKey()
            return
        } 
    }
  
    function handleKeyPress(e) 
    {

        if (e.key === "Backspace" || e.key === "Delete") {
            deleteKey()
            return
        } 

        if (e.key.match(/^[a-z]$/)) {
            pressKey(e.key)
            return
        }
    }

    /// Funciones llamadas desde el Manejador 

    function pressKey(key) 
    {
        
        // div tabla
        const activeTiles = getActiveTiles() // cero la primera vez , va incrementando
       
        
        if (activeTiles.length >= WORD_LENGTH) return // retorno temprano si hay mas de 5 activos
        const nextTile = guessGrid.querySelector(":not([data-letter])") //1ra vez inexistente y devuelve el 1er cuadrante
        nextTile.dataset.letter = key.toLowerCase() // seteo el data-letter con la key
        nextTile.style.color='blue'        
        nextTile.textContent = key // le pongo valor
        nextTile.dataset.state = "active"  // aca lo activo por 1ra vez
    }
    function getActiveTiles() 
    {
        // obtengo un Nodelist de los div activos  
        return guessGrid.querySelectorAll('[data-state="active"]')
    }
    function deleteKey() 
    {
        const activeTiles = getActiveTiles()
        const lastTile = activeTiles[activeTiles.length - 1]
        if (lastTile == null) return
        lastTile.textContent = ""
        delete lastTile.dataset.state
        delete lastTile.dataset.letter
    }





}