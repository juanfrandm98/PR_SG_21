import * as THREE from '../../libs/three.module.js'

class PowerUp extends THREE.Object3D {

    constructor() {
        super();

        // Variables para el control del powerup
        this.name = "";
        this.effect = 0;

        // Nodo para almacenar el modelo
        this.nodo = new THREE.Object3D();
        this.nodo.visible = false;
        this.add(this.nodo);

        // Variable para el control de colisiones
        this.hitRadius = 0;

        // Variable para la temporización
        this.tiempoAnterior = Date.now();
    }

    // Getter del nombre del powerup
    getName() {
        return this.name;
    }

    // Getter del efecto del powerup (cantidad)
    getEffect() {
        return this.effect;
    }

    // Getter de la posición del powerup
    getPosition() {
        return this.nodo.position;
    }

    // Getter del radio de colisión
    getHitRadius() {
        return this.hitRadius;
    }

    // Getter de la visibilidad del powerup (está o no activo)
    getVisible() {
        return this.nodo.visible;
    }

    // Activación del powerup (colocándolo en una posición y haciéndolo visible)
    activate(pos) {
        this.nodo.position.set(pos.x, pos.y, pos.z);
        this.nodo.visible = true;
        this.tiempoAnterior = Date.now();
    }

    // Desactivación del powerup (haciéndolo invisible)
    desactivate() {
        this.nodo.visible = false;
    }

    // Animación del powerip (rotación y altura)
    update() {
        var tiempoActual = Date.now();
        var msTranscurridos = tiempoActual - this.tiempoAnterior;

        // Control de la altura en función de si está subiendo o bajando
        var h = this.nodo.position.y;

        if (this.up) {
            h += this.velH * msTranscurridos;

            if (h >= this.maxH) {
                h = this.maxH;
                this.up = false;
            }
        } else {
            h -= this.velH * msTranscurridos;

            if (h <= this.minH) {
                h = this.minH;
                this.up = true;
            }
        }

        this.nodo.position.y = h;

        // Control de la rotación
        this.nodo.rotateY(this.velRot * msTranscurridos);

        this.tiempoAnterior = tiempoActual;
    }

}

export {PowerUp};