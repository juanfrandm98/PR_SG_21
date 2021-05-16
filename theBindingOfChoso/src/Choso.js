import * as THREE from '../libs/three.module.js'
import {Character} from "./Character.js";

class Choso extends Character {

    constructor() {
        super();

        var boxGeom = new THREE.BoxGeometry(2, 2, 2);
        var boxMat = new THREE.MeshNormalMaterial({flatShading: true});

        this.speed = 0.5;
        this.shootSpeed = 1.25;

        this.hitBox = new THREE.Mesh(boxGeom, boxMat);
        this.hitBox.position.y += 1;
        this.add(this.hitBox);
    }

    move(direction) {
        switch(direction) {
            case "up":
                this.hitBox.position.z -= this.speed;
                break;

            case "down":
                this.hitBox.position.z += this.speed;
                break;

            case "left":
                this.hitBox.position.x -= this.speed;
                break;

            case "right":
                this.hitBox.position.x += this.speed;
                break;
        }
    }

    update() {
    }

}

export {Choso};