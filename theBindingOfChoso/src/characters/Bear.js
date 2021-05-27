import * as THREE from '../../libs/three.module.js'
import {Character} from "./Character.js";
import {MathUtils} from "../../libs/three.module.js";
import {BearModel} from "./BearModel.js";
import {ShootingController} from "./ShootingController.js";

class Bear extends Character {

    constructor(maxX, maxZ) {
        super();

        this.maxX = maxX;
        this.maxZ = maxZ;

        this.speed = 4;
        this.shootSpeed = 1;
        this.maxHealth = 5;
        this.hitRadius = 0.8;

        this.bear = new BearModel();
        this.hitBox.add(this.bear);
        this.hitBox.visible = false;

        this.directions = ["up", "down", "left", "right"];
        this.direction;
        this.tiempoAcumulado = 0;
        this.msCambioDireccion = 2000;

        var shotMat = new THREE.MeshPhongMaterial({color: new THREE.Color(1, 1, 0)});
        this.shootingController = new ShootingController(5, 1, 1, 10, 0.3, 10, shotMat);
        this.add(this.shootingController);
    }

    getRandomDir() {
        var index = MathUtils.randInt(0, 3);
        var dir = new THREE.Vector2(0,0);

        switch(index) {
            case 0:
                dir.y = -1;
                break;
            case 1:
                dir.y = 1;
                break;
            case 2:
                dir.z = -1;
                break;
            case 3:
                dir.z = 1;
                break;
        }

        return dir;
    }

    update(choso, soundsController) {
        var tiempoActual = Date.now();
        var msTranscurridos = tiempoActual - this.tiempoAnterior
        var segundosTranscurridos = msTranscurridos / 1000;

        this.tiempoAcumulado += msTranscurridos;

        if (!this.enMovimiento || this.tiempoAcumulado >= this.msCambioDireccion) {
            var index = MathUtils.randInt(0, 3);
            this.direction = this.directions[index];
            this.enMovimiento = true;
            this.tiempoAcumulado = 0;
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
        this.bear.update(this.speed, this.direction);

        var pos = new THREE.Vector3(this.hitBox.position.x, 1.5, this.hitBox.position.z);
        var dir = this.getRandomDir();
        var targets = [choso];
        this.shootingController.update(true, pos, dir, targets, soundsController);

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

    checkDirection(pos, maxX, maxZ, hitRadius, direction, bear) {
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

export {Bear};