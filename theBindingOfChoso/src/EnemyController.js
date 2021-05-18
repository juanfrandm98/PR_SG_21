import * as THREE from '../libs/three.module.js'
import {Bee} from "./Bee.js";

class EnemyController extends THREE.Object3D {

    constructor() {
        super();

        this.bees = [];

        for (var i = 0; i < 10; i++) {
            this.bees.push(new Bee(new THREE.Vector3(0, 0, 0)));
            this.add(this.bees[i]);
        }
    }

    update(choso) {
        for (var i = 0; i < this.bees.length; i++) {
            if (this.bees[i].isDefeated()) this.bees[i].hide();

            this.bees[i].update();
        }
    }

    getEnemies() {
        var enemies = [];

        for (var i = 0; i < this.bees.length; i++)
            if (!this.bees[i].isDefeated())
                enemies.push(this.bees[i]);

        return enemies;
    }

}

export {EnemyController};