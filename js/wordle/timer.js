 //// TIMER /////
export function paddedFormat(num) {

    return num < 10 ? "0" + num : num; 
}

export function startCountDown(duration, element) {

    let secondsRemaining = duration;
    let min = 0;
    let sec = 0;

    var countInterval = setInterval(function () {  // arranca

        min = parseInt(secondsRemaining / 60);   // paso a minutos el tiempo
        sec = parseInt(secondsRemaining % 60);   // paso a segundos

        element.textContent = `${paddedFormat(min)}:${paddedFormat(sec)}`; // voy pintando
        secondsRemaining = secondsRemaining - 1; // segundos acumulados decrecientemente
        if (secondsRemaining < 0) { clearInterval(countInterval) };
    }, 1000);
}

export function emptyStart(cero,elem){
    startCountDown(cero,elem)
}

////////// DATE ////////////////////

export function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }
  
export function formatDate(date) {
    return (
      [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
      ].join('-') +
      ' ' +
      [
        padTo2Digits(date.getHours()),
        padTo2Digits(date.getMinutes()),
        padTo2Digits(date.getSeconds()),
      ].join(':')
    );
  }
  
  
  
