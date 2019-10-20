class Enemigo2 extends BaseEnemigo {
    constructor(x, y) {
        super(imagenes.nube, x, y)

        this.aMover = new Animacion(imagenes.nube_idle, this.ancho, this.alto, 3, 8)
        this.aMorir = new Animacion(imagenes.nube_muerte, this.ancho, this.alto, 3, 8, this.finAnimacionMorir.bind(this))

        // Ref a la animación actual
        this.animacion = this.aMover;

        this.vxInteligencia = -1;
        this.vx = this.vxInteligencia;
        this.vy = 0;

    }

    isSaltable() {
        return true
    }
}