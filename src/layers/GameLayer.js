class GameLayer extends Layer {

    constructor() {
        super();
        this.iniciar();
    }

    iniciar() {
        this.espacio = new Espacio(1);

        this.botonSalto = new Boton(imagenes.boton_salto, 480 * 0.9, 320 * 0.55);
        this.botonDisparo = new Boton(imagenes.boton_disparo, 480 * 0.75, 320 * 0.83);
        this.pad = new Pad(480 * 0.14, 320 * 0.8);


        this.scrollX = 0;
        this.bloques = [];
        this.item = []

        this.fondo = new Fondo(imagenes.fondo_2, 480 * 0.5, 320 * 0.5);

        this.enemigos = [];


        this.fondoPuntos =
            new Fondo(imagenes.icono_puntos, 480 * 0.85, 320 * 0.05);

        this.fondoItems =
            new Fondo(imagenes.icono_recolectable, 480 * 0.10, 320 * 0.07);


        this.disparosJugador = []
        this.puntos = new Texto(0, 480 * 0.9, 320 * 0.07);
        this.puntosItems = new Texto(0, 480 * 0.15, 320 * 0.10);
        this.cargarMapa("res/" + nivelActual + ".txt");
    }

    actualizar() {
        this.espacio.actualizar();

        if (this.copa.colisiona(this.jugador)) {
            nivelActual++;
            if (nivelActual > nivelMaximo) {
                nivelActual = 0;
            }
            this.iniciar();
        }

        for (var i = 0; i < this.bloques.length; i++) {
            if (this.bloques[i].isDestruible()) {
                if (this.bloques[i].isSaltable() && this.jugador.colisionSuperior(this.bloques[i])) {
                    this.destruirBloques(i)
                } else {
                    if (this.bloques[i].isDisparable()) {
                        for (var j = 0; j < this.disparosJugador.length; j++) {
                            if (this.disparosJugador[j] != null &&
                                this.disparosJugador[j].vx == 0 &&
                                this.bloques[i].colisiona(this.disparosJugador[j])) {
                                this.destruirBloques(i)
                            }
                        }
                    }
                }

            }
        }

        // Jugador se cae
        if (this.jugador.y > 480) {
            this.iniciar();
        }

        // Eliminar disparos sin velocidad
        for (var i = 0; i < this.disparosJugador.length; i++) {
            if (this.disparosJugador[i] != null &&
                this.disparosJugador[i].vx == 0) {

                this.espacio
                    .eliminarCuerpoDinamico(this.disparosJugador[i]);
                this.disparosJugador.splice(i, 1);
            }
        }


        // elementos fuera
        // Enemigos muertos fuera del juego
        for (var j = 0; j < this.enemigos.length; j++) {
            if (this.enemigos[j] != null &&
                this.enemigos[j].estado == estados.muerto) {

                this.espacio
                    .eliminarCuerpoDinamico(this.enemigos[j]);

                this.enemigos.splice(j, 1);
                j = j - 1;
            }
        }

        // Eliminar disparos fuera de pantalla
        for (var i = 0; i < this.disparosJugador.length; i++) {
            if (this.disparosJugador[i] != null &&
                !this.disparosJugador[i].estaEnPantalla()) {

                this.espacio
                    .eliminarCuerpoDinamico(this.disparosJugador[i]);

                this.disparosJugador.splice(i, 1);
                i = i - 1;

                this.puntos.valor++
            }
        }




        for (var i = 0; i < this.item.length; i++) {
            this.item[i].actualizar();
        }

        for (var i = 0; i < this.item.length; i++) {
            if (this.item[i].colisiona(this.jugador)) {
                this.espacio.eliminarCuerpoDinamico(this.item[i]);
                this.item.splice(i, 1);
                i = i - 1;

                this.puntosItems.valor++;
            }
        }


        this.jugador.actualizar();
        for (var i = 0; i < this.enemigos.length; i++) {
            this.enemigos[i].actualizar();
        }
        for (var i = 0; i < this.disparosJugador.length; i++) {
            this.disparosJugador[i].actualizar();
        }

        // colisiones
        for (var i = 0; i < this.enemigos.length; i++) {
            if (this.enemigos[i].isSaltable() && this.jugador.colisionSuperior(this.enemigos[i])) {
                let x = this.enemigos[i].x - this.jugador.x
                let refY = (this.jugador.y + this.jugador.alto / 2)
                let modY = -(this.enemigos[i].y - this.enemigos[i].alto / 2)
                this.enemigos[i].impactado();
            } else if (this.jugador.colisiona(this.enemigos[i])) {
                this.iniciar();
            }
        }
        // colisiones , disparoJugador - Enemigo
        for (var i = 0; i < this.disparosJugador.length; i++) {
            for (var j = 0; j < this.enemigos.length; j++) {
                if (this.disparosJugador[i] != null &&
                    this.enemigos[j] != null &&
                    this.enemigos[j].estado != estados.muriendo &&
                    this.disparosJugador[i].colisiona(this.enemigos[j])) {

                    this.espacio
                        .eliminarCuerpoDinamico(this.disparosJugador[i]);
                    this.disparosJugador.splice(i, 1);
                    i = i - 1;
                    this.enemigos[j].impactado();

                    this.puntos.valor++;
                }
            }
        }




    }

    destruirBloques(i) {
        if (this.bloques[i].estado == estadosTile.roto) {
            this.espacio.eliminarCuerpoEstatico(this.bloques[i]);
            this.bloques.splice(i, 1);
            i = i - 1;
        } else {
            this.bloques[i].destruir();
        }
    }

    calcularScroll() {
        // limite izquierda
        if (this.jugador.x > 480 * 0.3) {
            if (this.jugador.x - this.scrollX < 480 * 0.3) {
                this.scrollX = this.jugador.x - 480 * 0.3;
            }
        }
        // limite derecha
        if (this.jugador.x < this.anchoMapa - 480 * 0.3) {
            if (this.jugador.x - this.scrollX > 480 * 0.7) {
                this.scrollX = this.jugador.x - 480 * 0.7;
            }
        }

    }


    dibujar() {
        this.calcularScroll();

        this.fondo.dibujar();
        for (var i = 0; i < this.bloques.length; i++) {
            this.bloques[i].dibujar(this.scrollX);
        }

        this.copa.dibujar(this.scrollX);
        for (var i = 0; i < this.item.length; i++) {
            this.item[i].dibujar(this.scrollX);
        }


        for (var i = 0; i < this.disparosJugador.length; i++) {
            this.disparosJugador[i].dibujar(this.scrollX);
        }


        this.jugador.dibujar(this.scrollX);
        for (var i = 0; i < this.enemigos.length; i++) {
            this.enemigos[i].dibujar(this.scrollX);
        }


        // HUD
        this.fondoPuntos.dibujar();
        this.fondoItems.dibujar();
        this.puntos.dibujar();
        this.puntosItems.dibujar();

        if (!this.pausa && entrada == entradas.pulsaciones) {
            this.botonDisparo.dibujar();
            this.botonSalto.dibujar();
            this.pad.dibujar();
        }

    }


    procesarControles() {
        // disparar
        if (controles.disparo) {
            var nuevoDisparo = this.jugador.disparar();
            if (nuevoDisparo != null) {
                this.espacio.agregarCuerpoDinamico(nuevoDisparo);
                this.disparosJugador.push(nuevoDisparo);

            }


        }

        // Eje X
        if (controles.moverX > 0) {
            this.jugador.moverX(1);

        } else if (controles.moverX < 0) {
            this.jugador.moverX(-1);

        } else {
            this.jugador.moverX(0);
        }

        // Eje Y
        if (controles.moverY > 0) {
            this.jugador.saltar();

        } else if (controles.moverY < 0) {


        } else {

        }

    }


    cargarMapa(ruta) {
        var fichero = new XMLHttpRequest();
        fichero.open("GET", ruta, false);

        fichero.onreadystatechange = function() {
            var texto = fichero.responseText;
            var lineas = texto.split('\n');
            this.anchoMapa = (lineas[0].length - 1) * 40;
            for (var i = 0; i < lineas.length; i++) {
                var linea = lineas[i];

                for (var j = 0; j < linea.length; j++) {
                    var simbolo = linea[j];
                    var x = 40 / 2 + j * 40; // x central
                    var y = 32 + i * 32; // y de abajo
                    this.cargarObjetoMapa(simbolo, x, y);
                }
            }
        }.bind(this);

        fichero.send(null);
    }

    cargarObjetoMapa(simbolo, x, y) {
        switch (simbolo) {
            case "W":
                var tile = new TileDestruible(imagenes.bloque_metal, x, y);
                tile.y = tile.y - tile.alto / 2;
                // modificación para empezar a contar desde el suelo
                this.bloques.push(tile);
                this.espacio.agregarCuerpoEstatico(tile);
                break;
            case "U":
                var tile = new TileDestruible2(imagenes.bloque_fondo_muro, x, y);
                tile.y = tile.y - tile.alto / 2;
                // modificación para empezar a contar desde el suelo
                this.bloques.push(tile);
                this.espacio.agregarCuerpoEstatico(tile);
                break;
            case "C":
                this.copa = new Bloque(imagenes.copa, x, y);
                this.copa.y = this.copa.y - this.copa.alto / 2;
                // modificación para empezar a contar desde el suelo
                this.espacio.agregarCuerpoDinamico(this.copa);
                break;
            case "I":
                let item = new Recolectable(x, y);
                item.y = item.y - item.alto / 2;
                // modificación para empezar a contar desde el suelo

                this.item.push(item)
                this.espacio.agregarCuerpoDinamico(item);
                break;
            case "E":
                var enemigo = new Enemigo(x, y);

                enemigo.y = enemigo.y - enemigo.alto / 2;
                // modificación para empezar a contar desde el suelo
                this.enemigos.push(enemigo);
                this.espacio.agregarCuerpoDinamico(enemigo);
                break;
            case "N":
                var enemigo = new Enemigo2(x, y);

                enemigo.y = enemigo.y - enemigo.alto / 2;
                // modificación para empezar a contar desde el suelo
                this.enemigos.push(enemigo);
                this.espacio.agregarCuerpoDinamico(enemigo);
                break;
            case "1":
                this.jugador = new Jugador(x, y);
                // modificación para empezar a contar desde el suelo
                this.jugador.y = this.jugador.y - this.jugador.alto / 2;
                this.espacio.agregarCuerpoDinamico(this.jugador);
                break;
            case "#":
                var bloque = new Bloque(imagenes.bloque_tierra, x, y);
                bloque.y = bloque.y - bloque.alto / 2;
                // modificación para empezar a contar desde el suelo
                this.bloques.push(bloque);
                this.espacio.agregarCuerpoEstatico(bloque);
                break;
        }
    }

    calcularPulsaciones(pulsaciones) {
        // Suponemos botones no estan pulsados
        this.botonDisparo.pulsado = false;
        this.botonSalto.pulsado = false;

        // suponemos que el pad está sin tocar
        controles.moverX = 0;



        for (var i = 0; i < pulsaciones.length; i++) {
            if (this.pad.contienePunto(pulsaciones[i].x, pulsaciones[i].y)) {
                var orientacionX = this.pad.obtenerOrientacionX(pulsaciones[i].x);
                if (orientacionX > 20) { // de 0 a 20 no contabilizamos
                    controles.moverX = 1;
                }
                if (orientacionX < -20) { // de -20 a 0 no contabilizamos
                    controles.moverX = -1;
                }
            }


            if (this.botonDisparo.contienePunto(pulsaciones[i].x, pulsaciones[i].y)) {
                this.botonDisparo.pulsado = true;
                if (pulsaciones[i].tipo == tipoPulsacion.inicio) {
                    controles.disparo = true;
                }
            }

            if (this.botonSalto.contienePunto(pulsaciones[i].x, pulsaciones[i].y)) {
                this.botonSalto.pulsado = true;
                if (pulsaciones[i].tipo == tipoPulsacion.inicio) {
                    controles.moverY = 1;
                }
            }

        }

        // No pulsado - Boton Disparo
        if (!this.botonDisparo.pulsado) {
            controles.disparo = false;
        }

        // No pulsado - Boton Salto
        if (!this.botonSalto.pulsado) {
            controles.moverY = 0;
        }
    }


}