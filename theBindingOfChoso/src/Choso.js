import * as THREE from '../libs/three.module.js'
import {Character} from "./Character.js";
import {ShootingController} from "./ShootingController.js";
import {ChosoModel} from "./ChosoModel.js";

class Choso extends Character {

    constructor(maxX, maxZ) {
        super();

        this.maxX = maxX;
        this.maxZ = maxZ;

        this.speed = 10.0;
        this.shootSpeed = 1.25;

        this.maxHealth = 10;
        this.health = this.maxHealth;

        this.shootingController = new ShootingController(10, 1, 3, 15, 0.2, 20);
        this.add(this.shootingController);

        this.model = new ChosoModel();
        this.hitBox.add(this.model);

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

    changeShotDamage(amount) {
        this.shootingController.changeShotDamage(amount);
    }

    changeShotRadius(amount) {
        this.shootingController.changeShotRadius(amount);
    }

    changeShotRange(amount) {
        this.shootingController.changeShotRange(amount);
    }

    update(dirX, dirZ, shooting, dirShot, targets) {
        if (this.health > 0) {
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

                if (shooting) {
                    this.model.rotateHead(dirX, dirZ);
                    this.model.rotateBody();
                } else
                    this.model.rotateChoso(dirX, dirZ);

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

}

export {Choso};