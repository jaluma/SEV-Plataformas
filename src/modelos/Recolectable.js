class Recolectable extends Modelo {
    constructor(x, y) {
        super(imagenes.icono_recolectable, x, y)

        this.animacion = new Animacion(imagenes.recolectable, this.ancho, this.alto, 6, 8)
    }

    actualizar() {
        this.animacion.actualizar();
    }

    dibujar(scrollX) {
        scrollX = scrollX || 0;
        this.animacion.dibujar(this.x - scrollX, this.y);
    }
}