import * as THREE from '../libs/three.module.js'
import {Shoot} from "./Shoot.js";

class ShootsController extends THREE.Object3D {

    constructor(origin, destiny, speed) {
        super();

        this.shoots = [];
    }

    createShoot(origin, destiny, speed) {
        var newShoot = new Shoot(origin, destiny, speed);
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

}

export {ShootsController};