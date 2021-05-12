import * as THREE from '../libs/three.module.js'

class Character extends THREE.Object3D {

    constructor() {
        super();

        this.speed = 0.5;
    }

    update() {
    }

}

export {Character};