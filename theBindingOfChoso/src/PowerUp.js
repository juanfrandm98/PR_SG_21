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

}

export {PowerUp};