import * as THREE from '../libs/three.module.js'
import {Shoot} from "./Shoot.js";

class ShootsController extends THREE.Object3D {

    constructor(amount, speed, radius) {
        super();

        this.shoots = [];

        for (var i = 0; i < amount; i++) {
            this.shoots.push(new Shoot(speed, radius));
            this.add(this.shoots[i]);
        }
    }

    calculateDistance(first, second) {
        var distance = Math.pow((first.x - second.x), 2);
        distance += Math.pow((first.z - second.z), 2);
        return Math.sqrt(distance);
    }

    shoot(origin, destiny) {
        var encontrado = false;

        for (var i = 0; i < this.shoots.length && !encontrado; i++) {
            if (this.shoots[i].getFinished()) {
                this.shoots[i].resetShoot(origin, destiny);
                encontrado = true;
            }
        }
    }

    update() {
        for (var i = 0; i < this.shoots.length; i++) {
            if (!this.shoots[i].getHidden()) {
                if (this.shoots[i].getFinished())
                    this.shoots[i].hide();

                this.shoots[i].update();
            }
        }
    }

    checkCollision(targets) {
        for (var i = 0; i < this.shoots.length; i++) {
            for (var j = 0; j < targets.length; j++) {
                var distance = this.calculateDistance(this.shoots[i].getPosition(), targets[j].getPosition());
                var hitDistance = this.shoots[i].getRadius() + targets[j].getHitRadius();

                if (distance <= hitDistance) {
                    targets[j].takeDamage(this.shoots[i].getDamage());
                    this.shoots[i].setFinished(true);
                }
            }
        }
    }

}

export {ShootsController};