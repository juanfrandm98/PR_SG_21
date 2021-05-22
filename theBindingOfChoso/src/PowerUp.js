import * as THREE from '../libs/three.module.js'

class PowerUp extends THREE.Object3D {

    constructor() {
        super();

        this.name = "";
        this.effect = 0;

        this.nodo = new THREE.Object3D();
        this.nodo.visible = false;
        this.add(this.nodo);

        this.hitRadius = 0;

        this.tiempoAnterior = Date.now();
    }

    getName() {
        return this.name;
    }

    getEffect() {
        return this.effect;
    }

    getPosition() {
        return this.nodo.position;
    }

    getHitRadius() {
        return this.hitRadius;
    }

    getVisible() {
        return this.nodo.visible;
    }

    activate(pos) {
        this.nodo.position.set(pos.x, pos.y, pos.z);
        this.nodo.visible = true;
        this.tiempoAnterior = Date.now();
    }

    desactivate() {
        this.nodo.visible = false;
    }

    update() {
        var tiempoActual = Date.now();
        var msTranscurridos = tiempoActual - this.tiempoAnterior;

        var h = this.nodo.position.y;

        if(this.up) {
            h += this.velH * msTranscurridos;

            if(h >= this.maxH) {
                h = this.maxH;
                this.up = false;
            }
        } else {
            h -= this.velH * msTranscurridos;

            if(h <= this.minH) {
                h = this.minH;
                this.up = true;
            }
        }

        this.nodo.position.y = h;

        this.nodo.rotateY(this.velRot * msTranscurridos);

        this.tiempoAnterior = tiempoActual;
    }

}

export {PowerUp};