class TileDestruible2 extends BloqueDestruible {

    constructor(rutaImagen, x, y) {
        super(rutaImagen, x, y)

        this.destruible = 1
    }

    isDisparable() {
        return true
    }
}