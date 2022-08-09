import {paddedFormat,startCountDown,formatDate} from "./timer.js";

window.onload= function() { // usar refer en etiqueta script para cargar luego del DOM
    
    localStorage.removeItem('name')
    const arrPartidas = localStorage.getItem('lsArray2')?JSON.parse(localStorage.getItem('lsArray2')):[];
    const play = document.querySelector('#play');
    const containerTime=document.querySelector('#timer-container')
    const wordsArray=[];
    const wordWin=[];
    const rr= [];
    const participante=document.querySelector('#participante');
    const keyboard = document.querySelector("[data-keyboard]")
    const guessGrid = document.querySelector("[data-guess-grid]") // obtengo la grilla
    const alertContainer = document.querySelector("[data-alert-container]") // contenedor alert msg
    const WORD_LENGTH = 5
    const SEARCH_TOTAL = 1000
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

        mostrarModal('modalWelcome'); 
                                   
    });   
    
     ////////////////////////////////////   
    /////////// TIMER  COUNTDOWN ///////                        

    let time_minutes = 5; 
    let time_seconds = 0; 
    let duration = time_minutes * 60 + time_seconds;
    let elementCountDown = document.querySelector('#count-down-timer');
    let divTimerr = document.querySelector("#timer")            
    elementCountDown.textContent = `${paddedFormat(time_minutes)}:${paddedFormat(time_seconds)}`
   
   
      ////////////////////////////
     /////////// JUGAR  /////////
    ////////////////////////////

    const comenzarPartida = ()=> {
                    cleaning()
                    containerTime.innerHTML=temporizador
                    const name = document.querySelector("#name");
                    if (!name.value) {   
                        showAlert('Ingresar Nombre')
                        return false
                    }
                    // almaceno nombre el LocalStorage
                    localStorage.setItem('name',name.value)
                    const modal = document.querySelector("#modalWelcome");
                    modal.style.display='none'
                    let elementCountDown = document.querySelector('#count-down-timer');
                    let divTimerr = document.querySelector("#timer")            
                    elementCountDown.textContent = `${paddedFormat(time_minutes)}:${paddedFormat(time_seconds)}`
                    divTimerr.classList.remove('text-hidden')
                    divTimerr.classList.add('text-show')
                    startInteraction();
                    startCountDown(--duration, elementCountDown);
                    participante.textContent=(localStorage.getItem('name'))
                        
                };

    const go = document.querySelector("#go");
    go.addEventListener('click',comenzarPartida);

     /////////////////////////////////////
    ////////// GUARDAR PARTIDA //////////
    ////////////////////////////////////

    class nuevaPartida {
        constructor(date,name,tablero,wordw,timer) {
            this.date = date;
            this.name = name;
            this.tablero = tablero;
            this.wordw = wordw;
            this.timer = timer;

        }
    }
    const guardarPartida = ()=>{
        const getName = localStorage.getItem('name');
        const getTimer = elementCountDown.textContent; 
        if (!getName) return showAlert('Inicie una partida')
        var totalSave= document.querySelectorAll('[data-letter]')
        const mapeo = [...totalSave].map((e)=>{
                      return {...e.dataset}    
        },[]); 
        // Instancio el objeto 
        const nuevaP = new nuevaPartida(formatDate(new Date()),getName,mapeo,this.wordWin,getTimer)
        // voy almancenando cada objeto en LS
        arrPartidas.push(nuevaP)
        // Seteo al Local Storage
        const mapeoStringify = JSON.stringify(arrPartidas)
        const lsArray= localStorage.setItem('lsArray2',mapeoStringify)
        showAlert('Partida Guardada')
    }  
     
    const save = document.querySelector('#save');
    save.addEventListener('click',guardarPartida)

      //////////////////////////////////////////
     /////////   CARGAR PARTIDAS  /////////////
    //////////////////////////////////////////

    const cargarModalPartidas = ()=>{
        const rellenarTable =document.querySelectorAll('[data-guess-grid]')[0].children
        const tbody= document.querySelector('#puntajes');
        const getLsArray = localStorage.getItem('lsArray2')
        const parseArray = JSON.parse(getLsArray)
        let tr='';
        if (getLsArray) {

            parseArray.map((elem,ind)=>{
            tr+=`<tr class="fila-partidas-guardadas" role="row">
                        <td class="data-partida-index" data-index="${ind}">${ind+1}</td>
                        <td class="data-partida-guardadas" data-label="nombre">${elem.name}</td>
                        <td class="data-partida-guardadas" data-label="fecha">${elem.date}</td>
                    </tr>`;

            });
            tbody.innerHTML=tr;
            mostrarModal('modalPartidas'); 
            const modal = document.querySelector('#modalPartidas');
            const trFila = document.querySelectorAll('[data-index]');
            trFila.forEach(element => { 
                element.addEventListener('click',(e)=> {
                                cleaning()
                                const ind = e.target.dataset.index;
                                this.wordWin=parseArray[ind].wordw; 
                                localStorage.setItem('name',parseArray[ind].name) 
                                let parseTime =parseArray[ind].timer
                                participante.textContent=(parseArray[ind].name)
                                let spl = parseTime.split(":")
                                let min = parseInt(spl[0])
                                let sec = parseInt(spl[1])
                                let elementCountDown = document.querySelector('#count-down-timer');
                                let divTimerr = document.querySelector("#timer")            
                                elementCountDown.textContent = `${paddedFormat(time_minutes)}:${paddedFormat(time_seconds)}`
                                let durationSave = min * 60 + sec;
                                divTimerr.classList.remove('text-hidden')
                                divTimerr.classList.add('text-show')
                                elementCountDown.textContent = `${paddedFormat(min)}:${paddedFormat(sec)}`;
                                startCountDown(--durationSave, elementCountDown);

                                for (let i = 0; i < parseArray[ind].tablero.length; i++) { 
                                    rellenarTable[i].textContent=parseArray[ind].tablero[i].letter
                                    rellenarTable[i].dataset.letter=parseArray[ind].tablero[i].letter
                                    rellenarTable[i].dataset.state=parseArray[ind].tablero[i].state
                                }
                                startInteraction();
                                modal.style.display = "none";
                            }); 
            });
           
        }else{
            mostrarModal('modalPartidas');
        }
        const modal = document.querySelector('#modalPartidas');
        const back = document.querySelector('#back')
        back.addEventListener('click',()=> modal.style.display='none')
    }

    const partidas = document.querySelector('#score'); 
    partidas.addEventListener('click',cargarModalPartidas) 

      ////////////////////////////////////////
     ////////////     LIMPIAR  //////////////
    ////////////////////////////////////////
    const cleaning = ()=>{
            const childTable =document.querySelectorAll('[data-guess-grid]')[0].children 
            const toArrChil = [...childTable]
            toArrChil.map((e)=>{
                    e.textContent='';
                    e.removeAttribute("data-letter")
                    e.removeAttribute("data-state")
                 })
    } 
    /// LIMPIAR TECLADO ///
    
    const temporizador =`<div class="text-hidden" id="timer">
                            <h2>Bienvenido 
                            <span id="participante"></span>
                                Te Quedan 
                            <span id="count-down-timer"></span></h2>
                        </div>`

      ////////////////////////////////////////
     ////////////     MODAL  ////////////////
    ////////////////////////////////////////
    
    function mostrarModal(nameModal) {
       
        const modal = document.querySelector(`#${nameModal}`); 
        const span = document.querySelector(".close");
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
   
      ////////////////////////////////
     ////////////HANDLERS ///////////
    ///////////////////////////////

    const handleMouseClick=(e)=>{
    
                                if (e.target.matches("[data-key]")) {
                                    pressKey(e.target.dataset.key)
                                    return
                                }
                                if (e.target.matches("[data-enter]")) {  
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
     ////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////// FUNCIONES GENERALES ////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////

    const startInteraction = ()=>{ document.addEventListener("click", handleMouseClick) 
                                   document.addEventListener("keydown", handleKeyPress)}
    // Hago inversa , se los remuevo.
    const stopInteraction = ()=> { document.removeEventListener("click", handleMouseClick)
                                   document.removeEventListener("keydown", handleKeyPress)}                  

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
                            const activeTilesDiv = getActiveDiv() // cero la primera vez , va incrementando
                            if (activeTilesDiv.length >= WORD_LENGTH) return // retorno temprano si hay mas de 5 activos
                            const nextTile = guessGrid.querySelector(":not([data-letter])") //1ra vez inexistente y devuelve el 1er cuadrante
                            nextTile.dataset.letter = key.toLowerCase() // seteo el data-letter con la key     
                            nextTile.textContent = key // le pongo valor
                            nextTile.dataset.state = "active"  // aca lo activo por 1ra vez
                        } 

    function submitGuess(warr,ww) 
                        {
                          
                            const activeTilesDiv = [...getActiveDiv()] //clono elementos (1er nivel) y lo meto en un array
                            if (activeTilesDiv.length !== WORD_LENGTH) { // si es distinto de 5 
                                showAlert("No Hay Suficientes letras")
                                shakeTiles(activeTilesDiv)
                                return
                            }

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
                            activeTilesDiv.forEach((...params) => flipTile(...params, palabra,ww))
                        
                        }

    function flipTile(div, index, array, palabra,ww) 
    {
       
        const letter = div.dataset.letter
        const key = keyboard.querySelector(`[data-key="${letter}"i]`)
        setTimeout(() => {
        div.classList.add("flip")
        }, (index * FLIP_ANIMATION_DURATION) / 2)
    
        div.addEventListener("transitionend",() => {
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
           
    }                    
     
    function checkWinLose(guess, tiles,ww) 
    {
        if (guess === ww) {
            showAlert("Ganaste !", 5000)
            stopInteraction()
            divTimerr.remove()
            cleaning()
            return
        }
    
        const remainingTiles = guessGrid.querySelectorAll(":not([data-letter])")
        if (remainingTiles.length === 0) {
            showAlert('Perdiste , palabra ganadora es: '+ww.toUpperCase(), 5000)
            stopInteraction()
            divTimerr.remove()
            cleaning()
            return
        }
    }
    
    function showAlert(message, duration = 1000) 
    {
        const alertDiv = document.createElement("div")
        alertDiv.textContent = message
        alertDiv.classList.add("alert")
        alertContainer.prepend(alertDiv)
        if (duration == null) return
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

} 
