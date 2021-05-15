import * as THREE from '../libs/three.module.js'
import {Character} from "./Character.js";
import {MathUtils} from "../libs/three.module.js";

class Bee extends Character {

    constructor() {
        super();

        var boxGeom = new THREE.BoxGeometry(1, 1, 1);
        var boxMat = new THREE.MeshNormalMaterial({flatShading: true});

        this.speed = 0.15;
        this.shootSpeed = 0;

        this.bee = new THREE.Mesh(boxGeom, boxMat);
        this.bee.position.y += 1;
        this.add(this.bee);

        this.directions = ["up", "down", "left", "right"];
        this.direction;
        this.tick = 0;
        this.maxTicks = 30;
    }

    getPosition() {
        return this.bee.position;
    }

    update() {
        if(this.tick === 0 || this.tick === this.maxTicks) {
            var index = MathUtils.randInt(0, 3);
            this.direction = this.directions[index];
            this.tick = 0;
        }

        switch(this.direction) {
            case "up":
                this.bee.position.z -= this.speed;
                break;

            case "down":
                this.bee.position.z += this.speed;
                break;

            case "left":
                this.bee.position.x -= this.speed;
                break;

            case "right":
                this.bee.position.x += this.speed;
                break;
        }

        this.tick++;
    }

}

export {Bee};