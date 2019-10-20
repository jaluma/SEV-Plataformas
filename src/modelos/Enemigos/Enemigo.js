class Enemigo extends BaseEnemigo {
    constructor(x, y) {
        super(imagenes.enemigo, x, y)

        this.aMover = new Animacion(imagenes.enemigo_movimiento, this.ancho, this.alto, 6, 3)
        this.aMorir = new Animacion(imagenes.enemigo_morir, this.ancho, this.alto, 6, 8, this.finAnimacionMorir.bind(this))

        // Ref a la animación actual
        this.animacion = this.aMover;

        this.vxInteligencia = -1;
        this.vx = this.vxInteligencia;
        this.vy = 0;

    }
}