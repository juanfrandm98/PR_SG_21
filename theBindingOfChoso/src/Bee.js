import * as THREE from '../libs/three.module.js'
import {Character} from "./Character.js";
import {MathUtils} from "../libs/three.module.js";

class Bee extends Character {

    constructor() {
        super();

        var boxGeom = new THREE.BoxGeometry(1, 1, 1);
        var boxMat = new THREE.MeshNormalMaterial({flatShading: true});

        this.speed = 5;
        this.shootSpeed = 0;
        this.maxHealth = 2;

        this.hitBox = new THREE.Mesh(boxGeom, boxMat);
        this.hitBox.position.y += 1;
        this.hitBox.visible = false;
        this.add(this.hitBox);

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

        if(!this.enMovimiento || this.tiempoAcumulado >= this.msCambioDireccion) {
            var index = MathUtils.randInt(0, 3);
            this.direction = this.directions[index];
            this.enMovimiento = true;
            this.tiempoAcumulado = 0;
        }

        switch(this.direction) {
            case "up":
                this.hitBox.position.z -= this.speed * segundosTranscurridos;
                break;

            case "down":
                this.hitBox.position.z += this.speed * segundosTranscurridos;
                break;

            case "left":
                this.hitBox.position.x -= this.speed * segundosTranscurridos;
                break;

            case "right":
                this.hitBox.position.x += this.speed * segundosTranscurridos;
                break;
        }

        this.tiempoAnterior = tiempoActual;

    }

    activate(pos) {
        pos.y += 1;
        super.activate(pos);
    }

}

export {Bee};