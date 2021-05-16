import * as THREE from '../libs/three.module.js'
import {Character} from "./Character.js";
import {MathUtils} from "../libs/three.module.js";

class Bee extends Character {

    constructor(initialPos) {
        super();

        var boxGeom = new THREE.BoxGeometry(1, 1, 1);
        var boxMat = new THREE.MeshNormalMaterial({flatShading: true});

        this.speed = 0.15;
        this.shootSpeed = 0;

        this.hitBox = new THREE.Mesh(boxGeom, boxMat);
        this.hitBox.position.copy(initialPos);
        this.hitBox.position.y += 1;
        this.add(this.hitBox);

        this.directions = ["up", "down", "left", "right"];
        this.direction;
        this.tick = 0;
        this.maxTicks = 30;
    }

    update() {
        if(this.tick === 0 || this.tick === this.maxTicks) {
            var index = MathUtils.randInt(0, 3);
            this.direction = this.directions[index];
            this.tick = 0;
        }

        switch(this.direction) {
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

        this.tick++;
    }

}

export {Bee};