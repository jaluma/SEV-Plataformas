// Canvas y contexto del Canvas
var canvas = document.getElementById("canvas");
var contexto = canvas.getContext("2d");
var escaladoMinimo = 1;

// Controles
var controles = {};

var fps = 30


// Capas
var layer;
var gameLayer;
var menuLayer;


// Inicio capas y bucle del juego
function iniciarJuego() {
    menuLayer = new MenuLayer();
    layer = menuLayer;

    setInterval(loop, 1000 / fps);
}



function loop() {
    layer.actualizar();
    if (entrada == entradas.pulsaciones) {
        layer.calcularPulsaciones(pulsaciones);
    }
    layer.procesarControles()
    layer.dibujar();

    actualizarPulsaciones();
}

function actualizarPulsaciones() {
    for (var i = 0; i < pulsaciones.length; i++) {
        if (pulsaciones[i].tipo == tipoPulsacion.inicio) {
            pulsaciones[i].tipo = tipoPulsacion.mantener;
        }
    }
}



// Cambio de escalado
window.addEventListener('load', resize, false);

function resize() {
    var escaladoAncho = parseFloat(window.innerWidth / canvas.width);
    var escaladoAlto = parseFloat(window.innerHeight / canvas.height);

    escaladoMinimo = Math.min(escaladoAncho, escaladoAlto);

    canvas.width = canvas.width * escaladoMinimo;
    canvas.height = canvas.height * escaladoMinimo;

    contexto.scale(escaladoMinimo, escaladoMinimo);
}