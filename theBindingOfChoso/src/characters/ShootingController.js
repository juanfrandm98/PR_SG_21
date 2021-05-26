import * as THREE from '../../libs/three.module.js'
import {Shot} from "./Shot.js";

class ShootingController extends THREE.Object3D {

    constructor(amount, damage, shotsPerSecond, shotSpeed, radius, range) {
        super();

        this.shots = [];
        this.msPerShot = 1000 / shotsPerSecond;
        this.shotSpeed = shotSpeed;
        this.shotRadius = radius;
        this.range = range;
        this.damage = damage;

        this.maxRange = 40;
        this.maxShotRadius = 0.8;
        this.maxDamage = 8;

        for (var i = 0; i < amount; i++) {
            this.shots.push(new Shot(this.shotSpeed, this.shotRadius, this.range));
            this.add(this.shots[i]);
        }

        this.msUntilShot = 0;
        this.tiempoAnterior = Date.now();
    }

    getDamage() {
        return this.damage;
    }

    getRange() {
        return this.range;
    }

    calculateDistance(first, second) {
        var distance = Math.pow((first.x - second.x), 2);
        distance += Math.pow((first.z - second.z), 2);
        return Math.sqrt(distance);
    }

    changeShotDamage(dif) {
        this.damage += dif;
        if (this.damage > this.maxDamage) this.damage = this.maxDamage;
    }

    changeShotRadius(dif) {
        this.shotRadius += dif;
        if (this.shotRadius > this.maxShotRadius) this.shotRadius = this.maxShotRadius;
    }

    changeShotRange(dif) {
        this.range += dif;
        if (this.range > this.maxRange) this.range = this.maxRange;
    }

    update(shooting, position, direction, targets) {
        // TIME CONTROL
        var tiempoActual = Date.now();
        var msTranscurridos = tiempoActual - this.tiempoAnterior;
        this.tiempoAnterior = tiempoActual;

        // NEW SHOT CONTROL
        if (shooting) {
            if (this.msUntilShot <= 0) {
                var encontrado = false;

                for (var i = 0; i < this.shots.length && !encontrado; i++) {
                    if (this.shots[i].getFinished()) {
                        this.shots[i].resetShoot(this.damage, this.shotRadius, position, direction, this.range);
                        encontrado = true;
                    }
                }

                if (!encontrado) {
                    this.shots.push(new Shot(this.shotSpeed, this.shotRadius));
                    this.shots[this.shots.length - 1].resetShoot(this.damage, this.shotRadius, position, direction, this.range);
                    this.add(this.shots[i]);
                }

                this.msUntilShot = this.msPerShot;
            } else {
                this.msUntilShot -= msTranscurridos;
            }
        }

        // POR CADA DISPARO
        for (var i = 0; i < this.shots.length; i++) {
            // SI ESTÁ SIENDO UTILIZADO
            if (!this.shots[i].getHidden()) {
                // SE ACTUALIZA
                this.shots[i].update();

                // SE COMPRUEBA SI HA GOLPEADO A ALGÚN OBJETIVO
                var hitted = false;

                for (var j = 0; j < targets.length && !hitted; j++) {
                    var distance = this.calculateDistance(this.shots[i].getPosition(), targets[j].getPosition());
                    var hitDistance = this.shots[i].getRadius() + targets[j].getHitRadius();

                    if (distance <= hitDistance) {
                        hitted = true;
                        targets[j].takeDamage(this.shots[i].getDamage());
                        this.shots[i].setFinished(true);
                    }
                }

                // SE ESCONDE SI YA NO SE NECESITA
                if (this.shots[i].getFinished())
                    this.shots[i].hide();
            }
        }
    }

}

export {ShootingController};