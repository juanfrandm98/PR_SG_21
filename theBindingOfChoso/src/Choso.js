import * as THREE from '../libs/three.module.js'
import {Character} from "./Character.js";

class Choso extends Character {

    constructor() {
        super();

        var boxGeom = new THREE.BoxGeometry(2, 2, 2);
        var boxMat = new THREE.MeshNormalMaterial({flatShading: true});

        this.speed = 0.5;
        this.shootSpeed = 1.25;

        this.choso = new THREE.Mesh(boxGeom, boxMat);
        this.choso.position.y += 1;
        this.add(this.choso);
    }

    move(direction) {
        switch(direction) {
            case "up":
                this.choso.position.z -= this.speed;
                break;

            case "down":
                this.choso.position.z += this.speed;
                break;

            case "left":
                this.choso.position.x -= this.speed;
                break;

            case "right":
                this.choso.position.x += this.speed;
                break;
        }
    }

    getPosition() {
        return this.choso.position;
    }

    update() {
    }

}

export {Choso};