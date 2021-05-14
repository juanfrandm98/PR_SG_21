import * as THREE from '../libs/three.module.js'

class Character extends THREE.Object3D {

    constructor() {
        super();

        this.speed = 0.5;
        this.shootSpeed = 1;
    }

    update() {
    }

    getShootSpeed() {
        return this.shootSpeed;
    }

}

export {Character};