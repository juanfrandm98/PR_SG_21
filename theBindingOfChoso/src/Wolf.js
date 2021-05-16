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

        this.hitBox = new THREE.Mesh(boxGeom, boxMat);
        this.hitBox.position.copy(pos);
        this.hitBox.position.y += 1;
        this.add(this.hitBox);
    }

    update(target) {
        var difX = this.hitBox.position.x - target.x;
        var difZ = this.hitBox.position.z - target.z;

        if(Math.abs(difX) > Math.abs(difZ)) {
            if(difX > 0) this.hitBox.position.x -= this.speed;
            else this.hitBox.position.x += this.speed;
        } else {
            if(difZ > 0) this.hitBox.position.z -= this.speed;
            else this.hitBox.position.z += this.speed;
        }
    }

}

export {Wolf};