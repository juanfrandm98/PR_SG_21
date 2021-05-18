import * as THREE from '../libs/three.module.js'
import {Character} from "./Character.js";
import {MathUtils} from "../libs/three.module.js";

class Wolf extends Character {

    constructor(maxX, maxZ) {
        super();

        this.maxX = maxX;
        this.maxZ = maxZ;

        var boxGeom = new THREE.BoxGeometry(2, 2, 2);
        var boxMat = new THREE.MeshNormalMaterial({flatShading: true});

        this.speed = 8;
        this.shootSpeed = 0;
        this.maxHealth = 4;

        this.hitBox = new THREE.Mesh(boxGeom, boxMat);
        this.hitBox.position.y += 1;
        this.hitBox.visible = false;
        this.add(this.hitBox);
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

        this.hitBox.position.x += dirX * this.speed * segundosTranscurridos;
        this.hitBox.position.z += dirZ * this.speed * segundosTranscurridos;

        this.tiempoAnterior = tiempoActual;
    }

    activate(pos) {
        pos.y += 1;
        super.activate(pos);
    }

}

export {Wolf};