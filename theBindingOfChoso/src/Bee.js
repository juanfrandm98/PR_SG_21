import * as THREE from '../libs/three.module.js'
import {Character} from "./Character.js";
import {MathUtils} from "../libs/three.module.js";
import {BeeModel} from "./BeeModel.js";

class Bee extends Character {

    constructor(maxX, maxZ) {
        super();

        this.maxX = maxX;
        this.maxZ = maxZ;

        this.speed = 5;
        this.shootSpeed = 0;
        this.maxHealth = 2;
        this.hitRadius = 1.3;

        this.bee = new BeeModel();
        this.hitBox.add(this.bee);
        this.hitBox.visible = false;

        this.directions = ["up", "down", "left", "right"];
        this.direction;
        this.tiempoAcumulado = 0;
        this.msCambioDireccion = 2000;
    }

    update() {
        var tiempoActual = Date.now();
        var msTranscurridos = tiempoActual - this.tiempoAnterior
        var segundosTranscurridos = msTranscurridos / 1000;

        this.tiempoAcumulado += msTranscurridos;

        if (!this.enMovimiento || this.tiempoAcumulado >= this.msCambioDireccion) {
            var index = MathUtils.randInt(0, 3);
            this.direction = this.directions[index];
            this.enMovimiento = true;
            this.tiempoAcumulado = 0;

            switch(this.direction) {
                case "up":
                    this.bee.setBeeRotation(Math.PI);
                    this.bee.rotation.x = -Math.PI / 4;
                    this.bee.rotation.z = 0;
                    break;

                case "down":
                    this.bee.setBeeRotation(0);
                    this.bee.rotation.x = Math.PI / 4;
                    this.bee.rotation.z = 0;
                    break;

                case "left":
                    this.bee.setBeeRotation(Math.PI / 2);
                    this.bee.rotation.x = 0;
                    this.bee.rotation.z = Math.PI / 4;
                    break;

                case "right":
                    this.bee.setBeeRotation(3 * Math.PI / 2);
                    this.bee.rotation.x = 0;
                    this.bee.rotation.z = -Math.PI / 4;
                    break;
            }
        }

        var nuevaPos = new THREE.Vector3(this.hitBox.position.x, this.hitBox.position.y, this.hitBox.position.z);

        switch (this.direction) {
            case "up":
                nuevaPos.z -= this.speed * segundosTranscurridos;
                break;

            case "down":
                nuevaPos.z += this.speed * segundosTranscurridos;
                break;

            case "left":
                nuevaPos.x -= this.speed * segundosTranscurridos;
                break;

            case "right":
                nuevaPos.x += this.speed * segundosTranscurridos;
                break;
        }

        this.direction = this.checkDirection(nuevaPos, this.maxX, this.maxZ, this.hitRadius, this.direction);
        nuevaPos = super.checkPosition(nuevaPos, this.maxX, this.maxZ, this.hitRadius);

        this.hitBox.position.copy(nuevaPos);
        this.bee.update();

        this.tiempoAnterior = tiempoActual;

    }

    opositeDirection(direction) {
        switch (direction) {
            case "up":
                return "down";

            case "down":
                return "up";

            case "left":
                return "right";

            case "right":
                return "left";
        }
    }

    checkDirection(pos, maxX, maxZ, hitRadius, direction) {
        if (
            (pos.x > (maxX - hitRadius)) ||
            (pos.x < (-maxX + hitRadius)) ||
            (pos.z > (maxZ - hitRadius)) ||
            (pos.z < (-maxZ + hitRadius))
        ) {
            return this.opositeDirection(direction);
        } else {
            return direction;
        }
    }

    activate(pos) {
        pos.y += 1;
        super.activate(pos);
    }

}

export {Bee};