import * as THREE from '../libs/three.module.js'
import {Character} from "./Character.js";
import {MathUtils} from "../libs/three.module.js";
import {WolfModel} from "./WolfModel.js";

class Wolf extends Character {

    constructor(maxX, maxZ) {
        super();

        this.maxX = maxX;
        this.maxZ = maxZ;

        this.speed = 8;
        this.shootSpeed = 0;
        this.maxHealth = 4;

        this.wolf = new WolfModel();

        this.hitBox.add(this.wolf);
        this.hitBox.position.y += 1;
        this.hitBox.visible = false;
    }

    calculateCoef(position, target, coefX) {
        var dif;

        if(coefX) dif = position.x - target.x;
        else dif = position.z - target.z;

        if (dif > 0) return -1;
        else if (dif < 0) return 1;
        else return 0;
    }

    update(target) {
        var tiempoActual = Date.now();
        var segundosTranscurridos = (tiempoActual - this.tiempoAnterior) / 1000;

        var dirX = this.calculateCoef(this.hitBox.position, target, true);
        var dirZ = this.calculateCoef(this.hitBox.position, target, false);

        var newX = this.hitBox.position.x + dirX * this.speed * segundosTranscurridos;
        var newZ = this.hitBox.position.z + dirZ * this.speed * segundosTranscurridos;

        var margin = 0.5;

        if(Math.abs(target.x - newX) < margin) {
            dirX = 0;
            newX = target.x;
        }

        if(Math.abs(target.z - newZ) < margin) {
            dirZ = 0;
            newZ = target.z;
        }

        this.hitBox.position.x = newX;
        this.hitBox.position.z = newZ;

        this.wolf.update(this.speed, dirX, dirZ);

        this.tiempoAnterior = tiempoActual;
    }

}

export {Wolf};