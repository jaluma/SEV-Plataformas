class Bloque extends Modelo {

    constructor(rutaImagen, x, y) {
        super(rutaImagen, x, y)
    }

    isDestruible() {
        return false;
    }

    isSaltable() {
        return false;
    }

    isDisparable() {
        return false;
    }

}