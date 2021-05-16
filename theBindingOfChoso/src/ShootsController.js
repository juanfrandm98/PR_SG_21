import * as THREE from '../libs/three.module.js'
import {Shoot} from "./Shoot.js";

class ShootsController extends THREE.Object3D {

    constructor() {
        super();

        this.shoots = [];
    }

    calculateDistance(first, second) {
        var distance = Math.pow((first.x - second.x), 2);
        distance += Math.pow((first.z - second.z), 2);
        return Math.sqrt(distance);
    }

    createShoot(origin, destiny, speed, radius) {
        var newShoot = new Shoot(origin, destiny, speed, radius);
        this.shoots.push(newShoot);
        this.add(newShoot);
    }

    update() {
        for(var i = 0; i < this.shoots.length; i++) {
            if(this.shoots[i].getFinished()) {
                this.shoots[i].delete();
                this.shoots.splice(i, 1);
                if(i > 0) i = i - 1;
            }

            if(i < this.shoots.length) this.shoots[i].update();
        }
    }

    checkCollision(targets) {
        for(var i = 0; i < this.shoots.length; i++) {
            for(var j = 0; j < targets.length; j++) {
                var distance = this.calculateDistance(this.shoots[i].getPosition(), targets[j].getPosition());
                var hitDistance = this.shoots[i].getRadius() + targets[j].getHitRadius();

                if(distance <= hitDistance) {
                    targets[j].takeDamage(this.shoots[i].getDamage());
                    this.shoots[i].setFinished(true);
                }
            }
        }
    }

}

export {ShootsController};