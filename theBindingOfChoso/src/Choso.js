import * as THREE from '../libs/three.module.js'
import {Character} from "./Character.js";
import {ShootingController} from "./ShootingController.js";

class Choso extends Character {

    constructor() {
        super();

        var boxGeom = new THREE.BoxGeometry(2, 2, 2);
        var boxMat = new THREE.MeshNormalMaterial({flatShading: true});

        this.speed = 10;
        this.shootSpeed = 1.25;

        this.hitBox = new THREE.Mesh(boxGeom, boxMat);
        this.hitBox.position.y += 1;
        this.add(this.hitBox);

        this.shootingController = new ShootingController(10, 3, 15, 0.2, 20);
        this.add(this.shootingController);
    }

    update(dirX, dirZ, shooting, dirShot, targets) {
        // Movimiento
        if (this.enMovimiento) {
            var tiempoActual = Date.now();
            var segundosTranscurridos = (tiempoActual - this.tiempoAnterior) / 1000;
            this.hitBox.position.x += dirX * this.speed * segundosTranscurridos;
            this.hitBox.position.z += dirZ * this.speed * segundosTranscurridos;
            this.tiempoAnterior = tiempoActual;
        } else {
            this.tiempoAnterior = Date.now();
        }

        if (dirX !== 0 || dirZ !== 0)
            this.enMovimiento = true;
        else
            this.enMovimiento = false;

        var pos = new THREE.Vector3(this.hitBox.position.x, this.hitBox.position.y, this.hitBox.position.z);
        this.shootingController.update(shooting, pos, dirShot, targets);
    }

}

export {Choso};