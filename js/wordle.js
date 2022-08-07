import {paddedFormat,startCountDown,formatDate} from "./timer.js";

window.onload= function() { // usar refer en etiqueta scrip t para cargar luego del DOM

    localStorage.removeItem('name')
    /// DECLARACION DE CONSTANTES /////////// 
    const play = document.querySelector('#play');
    const wordsArray=[];
    const wordWin=[];
    const rr= [];
    const arrPartidas =[];
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
    play.addEventListener('click',()=>{ 
          this.wordWin=this.wordsArray[obtenerRandomInt(SEARCH_TOTAL)]
          const ww = this.wordWin.split('')
          this.rr = ww.reduce((acc,elem)=>{
                                    if (acc[elem]) {
                                        acc[elem]++ 
                                    }else{
                                    acc[elem]=1
                                    } 
                                    return acc   

                                   },{});

        mostrarModal(); 
                                   
    });          
    /////////// TIMER  COUNTDOWN ///////                        

    let time_minutes = 5; 
    let time_seconds = 0; 

    let duration = time_minutes * 60 + time_seconds;

    let element = document.querySelector('#count-down-timer');
    var timer = document.querySelector('#timer')
    timer.style.display='none';
    element.textContent = `${paddedFormat(time_minutes)}:${paddedFormat(time_seconds)}`;

    /// INGRESAR NOMBRE /////////
    const comenzarPartida = ()=> {
                    const name = document.querySelector("#name");
                    if (!name.value) {   
                        return false
                    }
                    // almaceno nombre el LocalStorage
                    localStorage.setItem('name',name.value)
                    const modal = document.querySelector("#modalPartidas");
                    modal.style.display='none'
                    timer.style.display='block'
                    startInteraction();
                    startCountDown(--duration, element);
                };

    const go = document.querySelector("#go");
    go.addEventListener('click',comenzarPartida);

    ////////// GUARDAR PARTIDA //////////
    const guardarPartida = ()=>{
        const getName = localStorage.getItem('name');
        if (!getName) return showAlert('Inicie una partida')
        var totalSave= document.querySelectorAll('[data-letter]')
        const mapeo = [...totalSave].map((e)=>{
                      return {...e.dataset}    
        },[]); 
        // creo clase para reutilizar
        class nuevaPartida {
            constructor(date,name,tablero,wordw) {
              this.date = date;
              this.name = name;
              this.tablero = tablero;
              this.wordw = wordw;
            }
          }
        // Instancio el objeto 
        const nuevaP = new nuevaPartida(formatDate(new Date()),getName,mapeo,this.wordWin)
        // voy almancenando cada objeto en LS
        arrPartidas.push(nuevaP)
        // Seteo al Local Storage
        const mapeoStringify = JSON.stringify(arrPartidas)
        const lsArray= localStorage.setItem('lsArray2',mapeoStringify)
    }  

    const save = document.querySelector('#save');
    save.addEventListener('click',guardarPartida)

     const cargarPartidas = ()=>{
        const print =document.querySelectorAll('[data-guess-grid]')[0].children
        // cuando vuelve del LS
        const getLsArray = localStorage.getItem('lsArray')
        const parseArray = JSON.parse(getLsArray)
        for (let i = 0; i < parseArray.length; i++) { 
            print[i].textContent=parseArray[i].letter
            print[i].dataset.letter=parseArray[i].letter
            print[i].dataset.state=parseArray[i].state
            startInteraction();
        }

     }
    const partidas = document.querySelector('#score');
    partidas.addEventListener('click',cargarPartidas) 

    //////////// MODAL  ////////////////
    
    function mostrarModal() {
       
        const modal = document.querySelector("#modalPartidas");
        const span = document.querySelector("#close");
        modal.style.display = "block";
        span.onclick = function () {
            modal.style.display = "none";
        }
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }
   

    /////////////////////////////// HANDLERS //////////////////////////////////////////////////////
    const handleMouseClick=(e)=>{
    
                                if (e.target.matches("[data-key]")) {
                                    // le envio el valor(letra) que tengo guardado en el data-key
                                    pressKey(e.target.dataset.key)
                                    return
                                }
                                if (e.target.matches("[data-enter]")) {
                                    // envio el palabra 
                                   
                                    submitGuess(this.wordsArray)
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
                                    
                                    submitGuess(this.wordsArray,this.wordWin)
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
    // startInteraction(); // INICIALIZADOR
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

    function submitGuess(warr,ww) 
                        {
                            //console.log(ww)
                            //debugger 
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
                            if (!warr.includes(palabra)) {
                                showAlert("No Esta esa Palabra")
                                shakeTiles(activeTilesDiv)
                                return
                            }
                        
                            stopInteraction();
            
                            //forEach(currentValue,index, array)
                            activeTilesDiv.forEach((...params) => flipTile(...params, palabra,ww))
                        
                        }


    
    function flipTile(div, index, array, palabra,ww) 
    {
       
        //console.log(ww)
        //debugger
        const letter = div.dataset.letter
        const key = keyboard.querySelector(`[data-key="${letter}"i]`)
        setTimeout(() => {
        div.classList.add("flip")
        }, (index * FLIP_ANIMATION_DURATION) / 2)
    
        div.addEventListener("transitionend",() => {
                                                //console.log(cantRepeat)  
                                              
                                                div.classList.remove("flip")
                                                if (ww[index] === letter) {
                                                div.dataset.state = "correct"
                                                //this.rr[letter] = this.rr[letter]-1
                                                key.classList.add("correct")
                                                } else if (ww.includes(letter) ) { //&& this.rr[letter]!=0
                                                div.dataset.state = "wrong-location"
                                                key.classList.add("wrong-location")
                                                } else {
                                                div.dataset.state = "wrong"
                                                key.classList.add("wrong")
                                                }
                                        
                                                if (index === array.length - 1) {
                                                    div.addEventListener("transitionend",() => {startInteraction()
                                                                                                checkWinLose(palabra, array,ww)
                                                                                                }, { once: true }
                                                                    )
                                                }
                                            },{ once: true }
                            ) 
                            //console.log(cantRepeat)                  
    }                    
     
    function checkWinLose(guess, tiles,ww) 
    {
        if (guess === ww) {
            showAlert("You Win", 5000)
            danceTiles(tiles)
            stopInteraction()
            return
        }
    
        const remainingTiles = guessGrid.querySelectorAll(":not([data-letter])")
        if (remainingTiles.length === 0) {
            showAlert(ww.toUpperCase(), null)
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
