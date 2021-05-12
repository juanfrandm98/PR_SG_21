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
        //this.add(this.shoots[this.shoots.length - 1]);
        this.add(newShoot);
    }

    update() {
        for(var i = 0; i < this.shoots.length; i++)
            if(this.shoots[i].getFinished())
                this.shoots[i].dispose();

        for(var i = 0; i < this.shoots.length; i++)
            this.shoots[i].update();
    }

}

export {ShootsController};