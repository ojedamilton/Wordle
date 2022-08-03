//import saludar from "./anidado";

window.onload= function() {


    /// DECLARACION DE CONSTANTES /////////// 
    const enviar = document.querySelector('#play');
    const wordsArray=[];
    const wordWin=[];
    const keyboard = document.querySelector("[data-keyboard]")
    const guessGrid = document.querySelector("[data-guess-grid]") // obtengo la grilla
    const alertContainer = document.querySelector("[data-alert-container]") // contenedor alert msg
    const WORD_LENGTH = 5
    const SEARCH_TOTAL = 100
    const FLIP_ANIMATION_DURATION = 500
    const DANCE_ANIMATION_DURATION = 500
    ////// LLAMADA A LA API /////////////////
    fetch(`https://api.datamuse.com/words?sp=?????&v=es&max=${SEARCH_TOTAL}`)
        .then(res=>res.json())
        .then(data=> data.map((actual)=> {return eliminarTildes(actual.word)},[]))
        .then(fin=>this.wordsArray =[...fin])
    ////// Funciones aplicadas a la Api
    const eliminarTildes   = texto => texto.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
    const obtenerRandomInt = max   =>  Math.floor(Math.random() * max);
    enviar.addEventListener('click',()=> this.wordWin=this.wordsArray[obtenerRandomInt(SEARCH_TOTAL)])
    
    /////////////////////////////// HANDLERS //////////////////////////////////////////////////////
  //  saludar('milton');
    const handleMouseClick=(e)=>{
                                if (e.target.matches("[data-key]")) {
                                    // le envio el valor(letra) que tengo guardado en el data-key
                                    pressKey(e.target.dataset.key)
                                    return
                                }
                                if (e.target.matches("[data-enter]")) {
                                    // envio el palabra 
                                    submitGuess()
                                    return
                                }
                                if (e.target.matches("[data-delete]")) {
                                    deleteKey()
                                    return
                                } 
                            }
    const handleKeyPress=(e)=> 
                            {
                                if (e.key === "Enter") {
                                    submitGuess()
                                    return
                                }
                                if (e.key === "Backspace" || e.key === "Delete") {
                                    deleteKey()
                                    return
                                } 
                        
                                if (e.key.match(/^[a-z]$/)) {
                                    pressKey(e.key)
                                    return
                                }
                            }                        

    /////////////////////////////////// FUNCIONES GENERALES ////////////////////////////////
    // Voy agregando clases y atributos a los cuadrantes.
    const startInteraction = ()=>{ document.addEventListener("click", handleMouseClick) 
                                   document.addEventListener("keydown", handleKeyPress)}
    // Hago inversa , se los remuevo.
    const stopInteraction = ()=> { document.removeEventListener("click", handleMouseClick)
                                   document.removeEventListener("keydown", handleKeyPress)}                  

    //Inicializo capturando los eventos de CLICK y TECLADO
    startInteraction();
    /// FUNCIONES LLAMADAS DESDE EL NAVEGADOR

    // obtengo un Nodelist de los div activos  
    const getActiveDiv =()=>guessGrid.querySelectorAll('[data-state="active"]');

    const deleteKey =()=> 
                        {
                            const activeTilesDiv = getActiveDiv()
                            const lastTile = activeTilesDiv[activeTilesDiv.length - 1]
                            if (lastTile == null) return
                            lastTile.textContent = ""
                            delete lastTile.dataset.state
                            delete lastTile.dataset.letter
                        }

    const pressKey=(key)=>{
                            // div tabla
                            const activeTilesDiv = getActiveDiv() // cero la primera vez , va incrementando
                            if (activeTilesDiv.length >= WORD_LENGTH) return // retorno temprano si hay mas de 5 activos
                            const nextTile = guessGrid.querySelector(":not([data-letter])") //1ra vez inexistente y devuelve el 1er cuadrante
                            nextTile.dataset.letter = key.toLowerCase() // seteo el data-letter con la key
                            //nextTile.style.color='blue'        
                            nextTile.textContent = key // le pongo valor
                            nextTile.dataset.state = "active"  // aca lo activo por 1ra vez
                        } 

    function submitGuess() 
                        {
                            const activeTilesDiv = [...getActiveDiv()] //clono elementos (1er nivel) y lo meto en un array
                            //console.log([...getActiveDiv()])
                            if (activeTilesDiv.length !== WORD_LENGTH) { // si es distinto de 5 
                                showAlert("No Hay Suficientes letras")
                                shakeTiles(activeTilesDiv)
                                return
                            }
                            // Uno las letras de la fila y obtengo la palabra
                            // reduce (accum,val,ind,arr)
                            const palabra = activeTilesDiv.reduce((wordAcum, divCurrent) => {
                                return wordAcum + divCurrent.dataset.letter
                            }, "")
                            // chequeo que exista esa palabra en mi array
                            if (!this.wordsArray.includes(palabra)) {
                                showAlert("No Esta esa Palabra")
                                shakeTiles(activeTilesDiv)
                                return
                            }
                        
                            stopInteraction();
                            //forEach(currentValue,index, array)
                            activeTilesDiv.forEach((...params) => flipTile(...params, palabra))
                        
                        }
    function flipTile(div, index, array, guess) 
    {
        const letter = div.dataset.letter
        const key = keyboard.querySelector(`[data-key="${letter}"i]`)
        setTimeout(() => {
        div.classList.add("flip")
        }, (index * FLIP_ANIMATION_DURATION) / 2)
    
        div.addEventListener("transitionend",() => {
                                                div.classList.remove("flip")
                                                if (this.wordWin[index] === letter) {
                                                div.dataset.state = "correct"
                                                key.classList.add("correct")
                                                } else if (this.wordWin.includes(letter)) {
                                                div.dataset.state = "wrong-location"
                                                key.classList.add("wrong-location")
                                                } else {
                                                div.dataset.state = "wrong"
                                                key.classList.add("wrong")
                                                }
                                        
                                                if (index === array.length - 1) {
                                                    div.addEventListener("transitionend",() => {startInteraction()
                                                                                                checkWinLose(guess, array)
                                                                                                }, { once: true }
                                                                    )
                                                }
                                            },{ once: true }
                            )
    }                    
     
    function checkWinLose(guess, tiles) 
    {
        if (guess === this.wordWin) {
            showAlert("You Win", 5000)
            danceTiles(tiles)
            stopInteraction()
            return
        }
    
        const remainingTiles = guessGrid.querySelectorAll(":not([data-letter])")
        if (remainingTiles.length === 0) {
            showAlert(this.wordWin.toUpperCase(), null)
            stopInteraction()
        }
    }
    function danceTiles(tiles) 
    {
        tiles.forEach((tile, index) => {
            setTimeout(() => {
            tile.classList.add("dance")
            tile.addEventListener(
                "animationend",
                () => {
                tile.classList.remove("dance")
                },
                { once: true }
            )
            }, (index * DANCE_ANIMATION_DURATION) / 5)
        })
    }
    function showAlert(message, duration = 1000) 
    {
        const alertDiv = document.createElement("div")
        alertDiv.textContent = message
        alertDiv.classList.add("alert")
        alertContainer.prepend(alertDiv)
        if (duration == null) return
        // muestro el mensaje durante 5seg 
        setTimeout(() => {
            alertDiv.classList.add("hide")
            alertDiv.addEventListener("transitionend", () => {
            alertDiv.remove()
            })
        }, duration)
    }

    function shakeTiles(divs) 
    {
        divs.forEach(div => {
            div.classList.add("shake")
            div.addEventListener("animationend",() => {div.classList.remove("shake")},{ once: true })
        })
    }
 


} // cierro window.onload
