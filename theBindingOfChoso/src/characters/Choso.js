import * as THREE from '../../libs/three.module.js'
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
        this.hitRadius = 0.5;

        this.maxHealth = 10;
        this.maxSpeed = 15.0;
        this.health = this.maxHealth;

        var shotMat = new THREE.MeshPhongMaterial({color: new THREE.Color(1, 1, 1)});
        this.shootingController = new ShootingController(10, 1, 3, 15, 0.2, 20, shotMat);
        this.add(this.shootingController);

        this.camera = this.createCamera();
        this.hitBox.add(this.camera);

        this.model = new ChosoModel();
        this.hitBox.add(this.model);

        this.secondsBetweenDamages = 1;
        this.secondsToTakeDamage = 0;
    }

    getAttack() {
        return this.shootingController.getDamage();
    }

    getRange() {
        return this.shootingController.getRange();
    }

    getSpeed() {
        return this.speed;
    }

    getShootingRadius() {
        return this.shootingController.getShootingRadius();
    }

    takeDamage(damage, soundsController) {
        if (this.secondsToTakeDamage <= 0) {
            var currentHeath = this.health;
            super.takeDamage(damage);

            if (this.health > 0) soundsController.playChosoDamage();
            else if( this.health <= 0 && currentHeath > 0)
                soundsController.playChosoDeath();

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

    changeSpeed(amount) {
        if (this.speed < this.maxSpeed)
            this.speed += amount;
    }

    createCamera() {
        var camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000);

        camera.position.set(0, 15, 15);
        camera.lookAt(0, 0, 0);

        return camera;
    }

    getCamera() {
        return this.camera;
    }

    update(dirX, dirZ, shooting, dirShot, targets) {
        var tiempoActual = Date.now();
        var segundosTranscurridos = (tiempoActual - this.tiempoAnterior) / 1000;

        if(this.health > 0) {
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

            if (shooting) {
                this.model.rotateHead(dirX, dirZ);
                this.model.rotateBody(dirShot);
            } else
                this.model.rotateChoso(dirX, dirZ);

            if (dirX !== 0 || dirZ !== 0)
                this.enMovimiento = true;
            else
                this.enMovimiento = false;

            var pos = new THREE.Vector3(this.hitBox.position.x, this.model.getUdderHeight(), this.hitBox.position.z);
            this.shootingController.update(shooting, pos, dirShot, targets);

            this.model.update(this.enMovimiento, this.speed);
        } else {
            this.model.deathAnimation(segundosTranscurridos);
        }

    }

}

export {Choso};