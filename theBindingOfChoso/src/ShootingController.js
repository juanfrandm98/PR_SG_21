import * as THREE from '../libs/three.module.js'
import {Shoot} from "./Shot.js";

class ShootingController extends THREE.Object3D {

    constructor(amount, shotsPerSecond, shotSpeed, radius) {
        super();

        this.shots = [];
        this.msPerShot = 1000 / shotsPerSecond;
        this.shotSpeed = shotSpeed;
        this.shotRadius = radius;

        for (var i = 0; i < amount; i++) {
            this.shots.push(new Shoot(this.shotSpeed, this.shotRadius));
            this.add(this.shots[i]);
        }

        this.msUntilShot = 0;
        this.tiempoAnterior = Date.now();
        console.log("Empieza habiendo " + this.shots.length + " disparos seleccionables");
    }

    calculateDistance(first, second) {
        var distance = Math.pow((first.x - second.x), 2);
        distance += Math.pow((first.z - second.z), 2);
        return Math.sqrt(distance);
    }

    update(shooting, position, direction, targets) {
        // TIME CONTROL
        var tiempoActual = Date.now();
        var msTranscurridos = tiempoActual - this.tiempoAnterior;
        this.tiempoAnterior = tiempoActual;

        // NEW SHOT CONTROL
        if(shooting) {
            if(this.msUntilShot <= 0) {
                var encontrado = false;

                for (var i = 0; i < this.shots.length && !encontrado; i++) {
                    if (this.shots[i].getFinished()) {
                        this.shots[i].resetShoot(position, direction);
                        encontrado = true;
                    }
                }

                if(!encontrado) {
                    this.shots.push(new Shoot(this.shotSpeed, this.shotRadius));
                    this.shots[this.shots.length - 1].resetShoot(position, direction);
                    this.add(this.shots[i]);
                    console.log("Ahora hay " + this.shots.length + " disparos seleccionables");
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