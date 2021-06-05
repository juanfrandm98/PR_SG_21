import * as THREE from '../../libs/three.module.js'
import {Character} from "./Character.js";
import {ShootingController} from "./ShootingController.js";
import {ChosoModel} from "./ChosoModel.js";

class Choso extends Character {

    constructor(maxX, maxZ) {
        super();

        // Variables para mantener a Choso dentro de la parcela
        this.maxX = maxX;
        this.maxZ = maxZ;

        // Estadísticas de Choso
        this.speed = 10.0;
        this.shootSpeed = 1.25;
        this.hitRadius = 0.5;

        this.maxHealth = 10;
        this.maxSpeed = 15.0;
        this.health = this.maxHealth;

        // Controlador del disparador de leche
        var shotMat = new THREE.MeshPhongMaterial({color: new THREE.Color(1, 1, 1)});
        this.shootingController = new ShootingController(10, 1, 3, 15, 0.2, 20, shotMat);
        this.add(this.shootingController);

        // Creación de la cámara que sigue a Choso
        this.maxPosCam = 20;
        this.minPosCam = 10;
        this.camera = this.createCamera();
        this.hitBox.add(this.camera);

        // Modelo
        this.model = new ChosoModel();
        this.hitBox.add(this.model);

        // Variables para el periodo de invencibilidad de Choso
        this.secondsBetweenDamages = 1;
        this.secondsToTakeDamage = 0;
    }

    // Getter del ataque de los disparos de Choso
    getAttack() {
        return this.shootingController.getDamage();
    }

    // Getter del rango de disparo de Choso
    getRange() {
        return this.shootingController.getRange();
    }

    // Getter de la velocidad de movimiento
    getSpeed() {
        return this.speed;
    }

    // Getter del radio de los disparos de Choso
    getShootingRadius() {
        return this.shootingController.getShootingRadius();
    }

    // Resta una cantidad de daño a Choso y reproduce el sonido de golpe
    takeDamage(damage, soundsController) {
        if (this.secondsToTakeDamage <= 0) {
            var currentHeath = this.health;
            super.takeDamage(damage);

            if (this.health > 0) soundsController.playChosoDamage();
            else if (this.health <= 0 && currentHeath > 0)
                soundsController.playChosoDeath();

            this.secondsToTakeDamage = this.secondsBetweenDamages;
        }
    }

    // Cambia la potencia de los disparos
    changeShotDamage(amount) {
        this.shootingController.changeShotDamage(amount);
    }

    // Cambia el radio de los disparos
    changeShotRadius(amount) {
        this.shootingController.changeShotRadius(amount);
    }

    // Cambia el rango de los disparos
    changeShotRange(amount) {
        this.shootingController.changeShotRange(amount);
    }

    // Cambia la velocidad de movimiento
    changeSpeed(amount) {
        if (this.speed < this.maxSpeed)
            this.speed += amount;
    }

    // Creación de la cámara
    createCamera() {
        var camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000);

        camera.position.set(0, this.maxPosCam, this.maxPosCam);
        camera.lookAt(0, 0, 0);

        return camera;
    }

    // Getter de la cámara
    getCamera() {
        return this.camera;
    }

    // Cambia la dificultad del juego, cambiando la posición de la cámara para
    // reducir el campo de visión
    changeDifficulty(numWave) {
        var x = 0;
        var y = this.maxPosCam - (numWave - 1) * 3;
        if (y < this.minPosCam) y = this.minPosCam;
        var z = y;

        this.camera.position.set(x, y, z);
    }

    // Actualización
    update(dirX, dirZ, shooting, dirShot, targets) {
        var tiempoActual = Date.now();
        var segundosTranscurridos = (tiempoActual - this.tiempoAnterior) / 1000;

        // Si Choso está vivo
        if (this.health > 0) {
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

            // Rota la cabeza, el cuerpo o el conjunto en función de si Choso
            // está disparando
            if (shooting) {
                this.model.rotateHead(dirX, dirZ);
                this.model.rotateBody(dirShot);
            } else
                this.model.rotateChoso(dirX, dirZ);

            // Comprueba si está moviéndose o no
            if (dirX !== 0 || dirZ !== 0)
                this.enMovimiento = true;
            else
                this.enMovimiento = false;

            // Actualización de la posición, el controldor de disparos y el
            // modelo
            var pos = new THREE.Vector3(this.hitBox.position.x, this.model.getUdderHeight(), this.hitBox.position.z);
            this.shootingController.update(shooting, pos, dirShot, targets);

            this.model.update(this.enMovimiento, this.speed);
        } else {
            // Si Choso no está vivo, lo coloca tumbado y actualiza sólo el
            // controlador de disparos
            this.model.deathAnimation(segundosTranscurridos);
            var pos = new THREE.Vector3(this.hitBox.position.x, this.model.getUdderHeight(), this.hitBox.position.z);
            this.shootingController.update(false, pos, dirShot, targets);
        }

    }

}

export {Choso};