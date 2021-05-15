import * as THREE from '../libs/three.module.js'
import {Character} from "./Character.js";
import {MathUtils} from "../libs/three.module.js";

class Wolf extends Character {

    constructor(pos) {
        super();

        var boxGeom = new THREE.BoxGeometry(2, 2, 2);
        var boxMat = new THREE.MeshNormalMaterial({flatShading: true});

        this.speed = 0.2;
        this.shootSpeed = 0;

        this.wolf = new THREE.Mesh(boxGeom, boxMat);
        this.wolf.position.copy(pos);
        this.wolf.position.y += 1;
        this.add(this.wolf);
    }

    getPosition() {
        return this.wolf.position;
    }

    update(target) {
        var difX = this.wolf.position.x - target.x;
        var difZ = this.wolf.position.z - target.z;

        if(Math.abs(difX) > Math.abs(difZ)) {
            if(difX > 0) this.wolf.position.x -= this.speed;
            else this.wolf.position.x += this.speed;
        } else {
            if(difZ > 0) this.wolf.position.z -= this.speed;
            else this.wolf.position.z += this.speed;
        }
    }

}

export {Wolf};