window.onload = function () {
    let error='';
      ///////////////////////////////////
     /// Validacion NOMBRE y APELLIDO //
    let nombre = document.getElementById('nombre');
    let errorNombre = document.getElementById('errorNombre');
 
    nombre.onfocus=function () {
        nombre.style.borderColor= "#ced4da"; 
        errorNombre.style.display='none';
    }

    let apellido = document.getElementById('apellido');
    let errorApellido = document.getElementById('errorApellido');

    apellido.onfocus=function () {
       apellido.style.borderColor= "#ced4da"; 
       errorApellido.style.display='none';
    }    
    function validateLetterOb(letter,errorLetter,e){
        expr=/^([a-zA-Z])*$/;
        if(letter.value.length >= 3){
            if (!expr.test(letter.value)) {
                letter.style.borderColor= "red";
                errorLetter.style.display='block';
                errorLetter.innerHTML="Caracteres Invalidos";
                error = true;
            }
        }else{
            letter.style.borderColor= "red";
            errorLetter.style.display='block';
            errorLetter.innerHTML='Debe contener al menos 3 letras';
            error = true;
        }
    }

     ////////////////////////////////////
    /// Validacion CORREO ELECTRONICO/// 
    let correo = document.getElementById('correo');
    let errorCorreo = document.getElementById('errorCorreo');
 
    correo.onfocus=function () {
        correo.style.borderColor= "#ced4da"; 
        errorCorreo.style.display='none';
    }
    function validateEmail(e) {
        expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if ( !expr.test(correo.value)) {
            correo.style.borderColor= "red";
            errorCorreo.style.display='block';
            errorCorreo.innerHTML='Debe ser una direccion de correo valida';
            error = true;
        }
    }

      ////////////////////////////////////
     //////  Validacion TEXT AREA /////// 
    let textArea = document.getElementById('textArea');
    let errorTextArea = document.getElementById('errorTextArea');
    
    textArea.onfocus=function () {
        textArea.style.borderColor= "#ced4da"; 
        errorTextArea.style.display='none';
    }

    function validateTextArea(letter,errorLetter,e){

        if(letter.value.length < 5){
            letter.style.borderColor= "red";
            errorLetter.style.display='block';
            errorLetter.innerHTML='Debe contener al menos 5 letras';
            error = true;
        }    

    }

       //////////////////////////////////
      ////////  EVENTO SUBMIT  ///////// 
    var form = document.getElementById("formulario");
    form.addEventListener('submit', function (evento) {
        error=false;
        evento.preventDefault();
        validateLetterOb(nombre,errorNombre);
        validateLetterOb(apellido,errorApellido);
        validateEmail();
        validateTextArea(textArea,errorTextArea);
        if(!error)  window.open(`mailto:ojedamiltonezequiel@gmail.com?subject=Consulta de ${nombre.value}&body=${textArea.value}`);
    })    
}    