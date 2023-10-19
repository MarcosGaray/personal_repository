const rutas = ["img/chrome.svg", "img/facebook.svg", "img/firefox.svg",
    "img/google.svg", "img/instagram.svg", "img/internetexplorer.svg",
    "img/javascript.svg", "img/opera.svg"]

var cartas = new Array(4);
for (var i = 0; i < 4; i++) {
    cartas[i] = new Array(4);
}

let carta1 = null;
let bloqueoDeCartas = false;

var juego = null;

const tableroPuntos = document.getElementById("puntos");
const tableroIntentos = document.getElementById("intentos");
const tableroHistorico = document.getElementById("record");

var puntuacionHistorico = []
var detenerParticulas = false;

/////////////////////////

//OBJETO JUEGO
function Juego(intentos) {
    this.puntos = 0;
    this.intentos = intentos;
    this.intentosRestantes = intentos;
    this.gano = false;
    this.aciertos = 0;
    this.ultimoSumado = 0;
    this.combo = 0;
    this.comboAcum = 0;
    this.restar = (n) => {
        this.puntos -= n;
        this.ultimoSumado = -n;
    }
    this.sumar = (n) => {
        this.puntos += n;
        this.ultimoSumado = n;
    }
    this.combear = (n, b) => {
        if (b === true) {
            this.combo += 1;
            this.comboAcum += n;
            if (this.gano || this.intentosRestantes == 0) {
                this.sumar(this.comboAcum * this.combo);
                this.combo = 0;
            }
        } else {
            if (this.combo === 0) {
                this.restar(5);
            } else {
                this.sumar(this.comboAcum * this.combo);
            }
            this.combo = 0;
            this.comboAcum = 0;
        }
    }
}

function Carta(ruta, frontRef) {
    this.frontRef = frontRef;
    this.ruta = ruta;
    this.estado = 0;
}

function Puntuacion(puntos, nombre, gano) {
    this.puntos = puntos;
    this.nombre = nombre;
    this.gano = gano;
}

const darVuelta = (carta) => {

    console.log("darVuelta - bloqueoDeCartas:", bloqueoDeCartas);
    if (bloqueoDeCartas || juego.intentosRestantes <= 0 || juego.gano) {
        return;
    }
    var ij = carta.id.split(/[,]/)
    var cartaActual = cartas[ij[0]][ij[1]];

    if (cartaActual.estado === 1) {
        console.log("darVuelta - estado:", 1);
        return;
    }
    console.log("darVuelta - estado:", 0);
    var rutaActual = cartaActual.ruta;
    console.log("i j :", ij);
    console.log("rutaActual :", rutaActual);

    if (!cartaActual.frontRef.querySelector('.card-inner').classList.contains('flipped')) {
        cartaActual.frontRef.querySelector('.card-inner').classList.add('flipped');
        if (carta1 === null) {
            // Esta es la primera carta que se voltea
            carta1 = cartaActual;
        } else {
            juego.intentosRestantes--;

            if (carta1.ruta !== rutaActual) {
                juego.combear(5, false); //FALSE ES QUE NO ACERTO. 5 VALOR A RESTAR
                console.log("No coincide. Bloqueando cartas...");
                bloqueoDeCartas = true;
                setTimeout(() => {
                    cartaActual.frontRef.querySelector('.card-inner').classList.remove('flipped');
                    carta1.frontRef.querySelector('.card-inner').classList.remove('flipped');
                    carta1 = null;
                    bloqueoDeCartas = false;
                    console.log("Desbloqueando cartas.");
                }, 1000); // el tiempo 
            } else {
                juego.aciertos++;
                if (juego.aciertos === 8) {
                    juego.gano = true;
                }
                juego.combear(20, true); //TRUE ES QUE ACERTO, 20 A SUMAR
                console.log("COINCIDEN. Bloqueadas para siempre");
                cartaActual.estado = 1;
                carta1.estado = 1;
                carta1 = null;
            }
            actualizarTablero();

            if (juego.gano) {
                mostrarResultadoModal('¡GANASTE!');
            }
            if (juego.intentosRestantes === 0) {
                mostrarResultadoModal('Perdiste...');
            }
        }
    }

}

const iniciarJuego = () => {
    juego = new Juego(15);
    actualizarTablero();
    const vec = generarVectorRandom();
    //const numeros = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7]; //para pruebas
    let pos = 0;
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var cartaRef = document.getElementById(i + "," + j);
            var cartaBack = cartaRef.querySelector('.card-back');
            cartas[i][j] = new Carta(rutas[vec[pos]], cartaRef)
            cartaBack.src = rutas[vec[pos++]];
        }
    }
}

const actualizarTablero = () => {
    tableroPuntos.innerText = "Puntos= " + juego.puntos;
    if (juego.combo >= 1) {
        tableroPuntos.innerText += ' (0)' + ' - COMBO ' + juego.comboAcum + 'x' + juego.combo;
    } else {
        if (juego.ultimoSumado <= 0) {
            tableroPuntos.innerText += ' (' + juego.ultimoSumado + ')'
        } else {
            tableroPuntos.innerText += ' (+' + juego.ultimoSumado + ')'
        }

    }
    tableroIntentos.innerHTML = "Intentos restantes= " + juego.intentosRestantes;
    tableroHistorico.innerHTML = "RECORD:<br>";
    let cont = 1;
    puntuacionHistorico.sort(function (p1, p2) {
        if (p1.gano === p2.gano) {
            return p2.puntos - p1.puntos;
        }
        if (p1.gano)
            return -1;
        else
            return 1;
    });
    puntuacionHistorico.forEach(p => {
        var span = document.createElement("span");
        span.innerHTML = cont + ') ' + p.nombre + '   |   ' + p.puntos + '<br>';
        if (p.gano) {
            span.style.color = "rgb(158, 237, 15)";
        } else {
            span.style.color = '#FF1C1C';
        }
        tableroHistorico.append(span);
        cont++;
    });
}

const mostrarResultadoModal = (txt) => {
    const resultadoModal = new bootstrap.Modal(document.getElementById('resultadoModal'), {
        backdrop: 'static', // Evita que se cierre haciendo clic fuera de la modal
        keyboard: false // Evita que se cierre con la tecla Esc
    });
    const titulo = document.getElementById('modalTitulo');
    const datos = document.getElementById('datos');
    titulo.innerText = txt;

    datos.innerHTML = 'Puntuación: ' + juego.puntos + '<br>Intentos realizados: ' + (juego.intentos - juego.intentosRestantes)
        + '<br>Nombre:';
    const boton_guardar = document.getElementById('boton_guardar');
    const input_nombre = document.getElementById('nombreJugador');
    boton_guardar.disabled = false;
    input_nombre.disabled = false;
    input_nombre.style.backgroundColor = "white";
    resultadoModal.show();

    if (juego.gano) {
        start();//dispara particulas
        update();
    }
}
const guardarDatos = (boton) => {
    boton.disabled = true;
    var input = document.getElementById('nombreJugador')
    var nombre = input.value;
    input.disabled = true;
    if (juego.gano)
        input.style.backgroundColor = "#90EE90";
    puntuacionHistorico.push(new Puntuacion(juego.puntos, nombre, juego.gano));
    guardarPuntuacionHistorico(); //serializar Local
    actualizarTablero();
}

const reiniciar = () => {
    bloqueoDeCartas = true;
    detenerParticulas = true;
    particulasCreadas = 0;
    for (let i = 0; i < cartas.length; i++) {
        for (let j = 0; j < cartas[i].length; j++) {
            const carta = cartas[i][j];
            if (carta.frontRef.querySelector('.card-inner').classList.contains('flipped')) {
                carta.frontRef.querySelector('.card-inner').classList.remove('flipped');
            }
        }
        setTimeout(() => {
            iniciarJuego();
            bloqueoDeCartas = false;
            detenerParticulas = false;
        }, 500)
    }
}

const generarVectorRandom = () => {
    var vector = new Array(16);
    const numeros = [0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7];

    // Barajar el array de números
    for (let i = numeros.length - 1; i > 0; i--) {
        const j = Math.floor(getRandomInt(i + 1));
        [numeros[i], numeros[j]] = [numeros[j], numeros[i]];
    }

    for (let i = 0; i < 16; i++) {
        vector[i] = numeros[i];
    }
    return vector;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

/*const mostrarTexto = () => {
    const vec = generarVectorRandom();
    const text = document.getElementById("pruebas");
    text.innerHTML = vec;
}*/

window.onload = function () {
    cargarPuntuacionHistorico(); //deserealizar
};

function cargarPuntuacionHistorico() {
    const puntuacionGuardada = localStorage.getItem('puntuacionHistorico'); //deserealizar
    if (puntuacionGuardada) {
        puntuacionHistorico = JSON.parse(puntuacionGuardada);
        // Actualiza la tabla de puntuaciones
        actualizarTablero();
    }
}

function guardarPuntuacionHistorico() {
    localStorage.setItem('puntuacionHistorico', JSON.stringify(puntuacionHistorico));
}

const borrarHistorial=()=>{
    puntuacionHistorico = [];
    actualizarTablero();
    guardarPuntuacionHistorico();
}
iniciarJuego();
generarVectorRandom();



//PARTICULAS 
var gravedad = .5;
var numHijos = 50;

var numParticulas = 100;
var particulasCreadas = 0;

function crearParticula() {
    var particula = document.createElement("div");
    particula.className = "particula";

    var y = window.innerHeight;
    var x = Math.random() * window.innerWidth;

    particula.style.top = y + "px";
    particula.style.left = x + "px";

    var velocidadY = -15 - (Math.random() * 15);

    particula.setAttribute("data-velocidad-y", velocidadY);
    particula.setAttribute("data-velocidad-x", "0");
    particula.setAttribute("data-padre", "true");

    particula.style.background = getRandomColor();

    document.getElementsByTagName("body")[0].append(particula);

    particulasCreadas++;

    if (particulasCreadas < numParticulas && detenerParticulas === false) {
        setTimeout(crearParticula, 50 + (Math.random() * 150));
    }
}

function start() {
    crearParticula();
}

function update() {
    var particulas = document.getElementsByClassName("particula");

    for (var p = 0; p < particulas.length; p++) {
        var particula = particulas[p];

        var velocidadY = parseFloat(particula.getAttribute("data-velocidad-y"));
        velocidadY += gravedad;

        particula.setAttribute("data-velocidad-y", velocidadY);

        var top = particula.style.top ? particula.style.top : "0"; //10px
        top = parseFloat(top.replace("px", ""));
        top += velocidadY;
        particula.style.top = top + "px";

        var velocidadX = parseFloat(particula.getAttribute("data-velocidad-x"));

        var left = particula.style.left ? particula.style.left : "0";
        left = parseFloat(left.replace("px", ""));
        left += velocidadX;
        particula.style.left = left + "px";

        var padre = particula.getAttribute("data-padre");

        if (velocidadY >= 0 && padre === "true") {
            explotar(particula);
        }

        if (top > window.innerHeight) {
            particula.remove();
        }
    }
    setTimeout(update, 20);
}

function explotar(particula) {

    for (var h = 0; h < numHijos; h++) {
        var hijo = document.createElement("div");
        hijo.className = "particula";

        hijo.style.top = particula.style.top;
        hijo.style.left = particula.style.left;
        hijo.style.background = particula.style.background;

        var velocidadY = (Math.random() * 20) - 18;
        hijo.setAttribute("data-velocidad-y", velocidadY);
        var velocidadX = (Math.random() * 16) - 8;
        hijo.setAttribute("data-velocidad-x", velocidadX);


        hijo.setAttribute("data-padre", false);

        //Agregar el hijo :) :) :)
        document.getElementsByTagName("body")[0].append(hijo);
    }

    particula.remove();
}


//utilerias
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

