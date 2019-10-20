class BaseEnemigo extends Modelo {

    constructor(imagen, x, y) {
        super(imagen, x, y)

        this.estado = estados.moviendo;

        this.vxInteligencia = -1;
        this.vx = this.vxInteligencia;
        this.vy = 0;

    }

    finAnimacionMorir() {
        this.estado = estados.muerto;
    }

    actualizar() {
        this.animacion.actualizar();

        switch (this.estado) {
            case estados.moviendo:
                this.animacion = this.aMover;
                break;
            case estados.muriendo:
                this.animacion = this.aMorir;
                break;
        }

        if (this.estado == estados.muriendo) {
            this.vx = 0;
        } else {
            if (this.vx == 0) {
                this.vxInteligencia = this.vxInteligencia * -1;
                this.vx = this.vxInteligencia;
            }
        }

    }

    dibujar(scrollX) {
        scrollX = scrollX || 0;
        this.animacion.dibujar(this.x - scrollX, this.y);
    }


    impactado() {
        if (this.estado != estados.muriendo && this.estado != estados.muerto) {
            this.estado = estados.muriendo;
        }
    }

    isSaltable() {
        return false
    }


}