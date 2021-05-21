import * as THREE from '../libs/three.module.js'
import {Character} from "./Character.js";
import {ShootingController} from "./ShootingController.js";

class Choso extends Character {

    constructor(maxX, maxZ) {
        super();

        this.maxX = maxX;
        this.maxZ = maxZ;

        var boxGeom = new THREE.BoxGeometry(2, 2, 2);
        var boxMat = new THREE.MeshNormalMaterial({flatShading: true});

        this.speed = 10.0;
        this.shootSpeed = 1.25;

        this.maxHealth = 10;
        this.health = this.maxHealth;

        this.hitBox = new THREE.Mesh(boxGeom, boxMat);
        this.hitBox.position.y += 1;
        this.add(this.hitBox);

        this.shootingController = new ShootingController(10, 3, 15, 0.2, 20);
        this.add(this.shootingController);

        this.secondsBetweenDamages = 1;
        this.secondsToTakeDamage = 0;
    }

    takeDamage(damage, soundsController) {
        if (this.secondsToTakeDamage <= 0) {
            super.takeDamage(damage);
            console.log("AY, me quedan " + this.health + " de vida...");

            if (this.health > 0) soundsController.playChosoDamage();
            else soundsController.playChosoDeath();

            this.secondsToTakeDamage = this.secondsBetweenDamages;
        }
    }

    update(dirX, dirZ, shooting, dirShot, targets) {
        var tiempoActual = Date.now();
        var segundosTranscurridos = (tiempoActual - this.tiempoAnterior) / 1000;

        this.secondsToTakeDamage -= segundosTranscurridos;

        // Movimiento
        if (this.enMovimiento) {
            var nuevaPos = new THREE.Vector3(this.hitBox.position.x, this.hitBox.position.y, this.hitBox.position.z);
            nuevaPos.x += dirX * this.speed * segundosTranscurridos;
            nuevaPos.z += dirZ * this.speed * segundosTranscurridos;
            nuevaPos = super.checkPosition(nuevaPos, this.maxX, this.maxZ, this.hitRadius);

            this.hitBox.position.copy(nuevaPos);

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