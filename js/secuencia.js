/////////////////////////////////////////////////////////////////////////
///////////////// VARIABLES PARA MOSTRAR EL NIVEL //////////////////////
///////////////////////////////////////////////////////////////////////
const nivel = document.getElementById('nivel');
nivel.innerHTML = `Nivel: 1`;

/////////////////////////////////////////////////////////////////////////
///////////////// VARIABLES PARA LOS SONIDOS ///////////////////////////
///////////////////////////////////////////////////////////////////////
//contiene la vibración por segundo de la nota
//posición en el arreglo: do=0,do#=1,re=2........
const Sonidos= [510];

//creamos contexto
const context = new (window.AudioContext || window.webkitAudioContext)();
/////////////////////////////////////////////////////////////////////////
///////////////// VARIABLES PARA EL CRONÓMETRO /////////////////////////
///////////////////////////////////////////////////////////////////////
const relojCronometro = document.getElementById('relojCronometro');
/////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

// El Math.floor(), redondea al decimal, si es 3,9 sería a '3'
const celeste = document.getElementById('celeste');
const violeta = document.getElementById('violeta');
const naranja = document.getElementById('naranja');
const verde = document.getElementById('verde');

const ULTIMO_NIVEL = 12;

const boton = document.getElementById('btnEmpezar');
boton.addEventListener('click', empezarJuego);

class Juego {
    constructor() {
        // Lo que hace el constructor es llamar al método (Función) inicializar al momento en que se invoca la clase, si no llamas ese método en el constructor no se ejecuta.
        // y el this se usa para que tome el contexto del objeto inicializar que esta dentro de la clase Juego, recuerda que el comportamiento de this depende de donde se encuentre.
        // This, dentro de una función o método, hace referencia al objeto desde el que se llama a la función.
        this.inicializar();
        this.generarSecuencia();
        setTimeout(this.siguienteNivel, 500);
    }

    inicializar() {
        // classList es una propiedad que retorna el listado de clases que tiene un determinado elemento del dom, en este caso se trae esta lista y se le añade la clase hide usando el add.
        this.mostrarBoton()
        this.nivel = 1;
        this.colores = {
            celeste,
            violeta,
            naranja,
            verde
        }

        this.elegirColor = this.elegirColor.bind(this); // .bin() = Atar o enlazar y establecer que this siga siendo la clase 'Juego' y no al objeto que se escribió en el HTML
        this.siguienteNivel = this.siguienteNivel.bind(this);
        nivel.innerHTML = `Nivel: ${this.nivel}`;
    }

    mostrarBoton() {
        if(boton.classList.contains('hide')) {
            boton.classList.remove('hide');
        } else {
            boton.classList.add('hide');
            this.start();
        }
    }

    start() {
        this.timeInicial = new Date();
        this.control = setInterval(() => this.cronometro(), 10);//Se ejecuta cada 10 millisegundos
    }

    cronometro() {
        this.timeActual = new Date();
        const timeAcumulador = this.timeActual - this.timeInicial; //Restamos el tiempo Actual menos el tiempo inicial, y como resultado nos da en millisegundos.
        const timeAcumulador2 = new Date();
        timeAcumulador2.setTime(timeAcumulador); //Recibe el setTime un valor en millisegundos y da como resultado una fecha específica a partir desde el 1 de enero de 1970

        var millisegundos = Math.round(timeAcumulador2.getMilliseconds()/10);
        var segundos = timeAcumulador2.getSeconds(); //Get the second (0-59)
        var minutos = timeAcumulador2.getMinutes(); //Get the minute (0-59)
        var horas = timeAcumulador2.getHours() - 19; //Get the hour (0-23)

        if (millisegundos < 10) { millisegundos = "0" + millisegundos; }
        if (segundos < 10) { segundos = "0" + segundos; }
        if (minutos < 10) { minutos = "0" + minutos; }
        if (horas < 10) { horas = "0" + horas; }

        relojCronometro.innerHTML = horas + " : " + minutos + " : " + segundos + " : " + millisegundos;

    }

    resetCronometro() {
        clearInterval(this.control);
        relojCronometro.innerHTML = "00 : 00 : 00 : 00";
    }

    stopCronometro() {
        clearInterval(this.control);
    }

    generarSecuencia() {
        // El fill() método llena los elementos especificados en una matriz con un valor estático.
        /* Puede especificar la posición de dónde comenzar y finalizar el llenado. Si no se especifica, todos los elementos serán rellenados.
        array.fill(value, start, end) */
        this.secuencia = new Array(ULTIMO_NIVEL).fill(0).map(n => Math.floor(Math.random() * 4));
        //console.log(this.secuencia);
    }

    siguienteNivel() {
        this.subnivel = 0;
        this.iluminarSecuencia();
        this.eventosDeClick();
    }

    transformarNumAcolor(numero) {
        switch (numero) {
            case 0:
                return 'celeste'
            case 1:
                return 'violeta'
            case 2:
                return 'naranja'
            case 3:
                return 'verde'
        }
    }

    transformarColorANumero(color) {
        switch (color) {
            case 'celeste':
                return 0
            case 'violeta':
                return 1
            case 'naranja':
                return 2
            case 'verde':
                return 3
        }
    }

    iluminarSecuencia() {
        for (let i = 0; i < this.nivel; i++) {
            const color = this.transformarNumAcolor(this.secuencia[i]); // Con el tipo de variable 'var' lo que hace es reemplazar el valor por el último valor del color generado en la function
            //console.log('aqui' + color);
            setTimeout(() => {
                this.iluminarColor(color)
                this.Sonido(0);
            }, 1000 * i);
        }
    }

    iluminarColor(color) {
        this.colores[color].classList.add('light'); // Se agrega el light a la clase de esa 'id'
        setTimeout(() => this.apagarColor(color), 350);
    }

    apagarColor(color) {
        this.colores[color].classList.remove('light');
    }

    eventosDeClick() {
        // El 'this' hará referencia al objeto que se escribió en el HTML: (Ésto sucede porque está dentro de un Evento -> el AddEventListener()
        // El que hará que 'this', dentro del Evento, apunte a Juego, y no al objeto de HTML será el enlace '.bind()'
        // .bin() = Atar o enlazar y establecer que this siga siendo la clase 'Juego' y no al objeto que se escribió en el HTML
        this.colores.celeste.addEventListener('click', this.elegirColor);
        this.colores.violeta.addEventListener('click', this.elegirColor);
        this.colores.naranja.addEventListener('click', this.elegirColor);
        this.colores.verde.addEventListener('click', this.elegirColor);
    }

    eliminarEventosClick() {
        this.colores.celeste.removeEventListener('click', this.elegirColor);
        this.colores.violeta.removeEventListener('click', this.elegirColor);
        this.colores.naranja.removeEventListener('click', this.elegirColor);
        this.colores.verde.removeEventListener('click', this.elegirColor);
    }

    elegirColor(event) {
        const nombreColor = event.target.dataset.color;
        const numeroColor = this.transformarColorANumero(nombreColor);
        // console.log(event);
        this.iluminarColor(nombreColor);
        if (numeroColor === this.secuencia[this.subnivel] ) {
            this.subnivel++;
            if(this.subnivel === this.nivel) {
                this.nivel++;
                nivel.innerHTML = `Nivel: ${this.nivel}`;
                this.eliminarEventosClick();
                if(this.nivel === (ULTIMO_NIVEL + 1)) {
                    this.ganoElJuego(); // Ganó
                    this.stopCronometro();
                } else {
                    setTimeout(this.siguienteNivel, 1500); //this.siguienteNivel -> no la estamos invocando sino le estamos diciendo cual es la función que tiene que llamar, por lo tanto sus valores no se modifican.
                }
            }
        } else {
            this.perdioElJuego(); // Perdió
            this.stopCronometro();
            
        }
    }

    ganoElJuego() {
        swal('Platzi', 'Felicitaciones has ganado :)', 'success') // Este 'swal' devuelve una promesa, por lo que podemos mostrar en .then() una vez que cierre el 'swal'
        .then(() => {
            this.inicializar();
            this.resetCronometro();
        })
    }

    perdioElJuego() {
        swal('Platzi', 'Lo sentimos, has perdido :(', 'error')
        .then(() => {
            this.eliminarEventosClick();
            this.inicializar();
            this.resetCronometro();
        })
    }

    Sonido(nota){
        //creamos oscilador
        const osc = context.createOscillator();

        // admite: sine, square, sawtooth, triangle
        osc.type = 'triangle'; 

        osc.frequency.value = Sonidos[nota];

        //asignamos el destino para el sonido
        osc.connect(context.destination);
        //iniciamos la nota
        osc.start();
        //detenemos la nota medio segundo despues
         osc.stop(context.currentTime + .16);
    }

}

function empezarJuego() {
    window.juego = new Juego();
}
