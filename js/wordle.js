window.onload= function() {

    const enviar = document.querySelector('#play');
    const respuesta=[];

    fetch('https://api.datamuse.com/words?sp=?????&v=es&max=10')
        .then(res=>res.json())
        .then(data=> data.map((actual)=> {return eliminarTildes(actual.word)},[]))
        .then(fin=>this.respuesta =[...fin])

    function eliminarTildes(texto)
    {
        return texto.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
    }

    enviar.addEventListener('click',()=>console.log(this.respuesta))
}