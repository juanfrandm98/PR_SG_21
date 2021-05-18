import * as THREE from '../libs/three.module.js'
import {Bee} from "./Bee.js";
import {Wolf} from "./Wolf.js";
import {MathUtils} from "../libs/three.module.js";

class EnemyController extends THREE.Object3D {

    constructor() {
        super();

        this.bees = [];
        this.wolves = [];
        this.defPos = new THREE.Vector3(20, 0, -20);
        this.timeBetweenSpanws = 2000;

        for (var i = 0; i < 10; i++) {
            this.bees.push(new Bee());
            this.add(this.bees[i]);
        }

        for (var i = 0; i < 10; i++) {
            this.wolves.push(new Wolf());
            this.add(this.wolves[i]);
        }

        this.enemiesList = [];

        this.tiempoAnterior = Date.now();
        this.tiempoUntilNextSpawn = this.timeBetweenSpanws;
    }

    currentEnemyActivated(vector, pos) {
        var encontrado = false;

        for(var i = 0; i < vector.length && !encontrado; i++) {
            if(vector[i].getHidden()) {
                encontrado = true;
                vector[i].activate(pos);
            }
        }

        return encontrado;
    }

    generateEnemies() {
        for (var i = 0; i < 10; i++) {
            var type = MathUtils.randInt(0, 1);
            this.enemiesList.push(type);
        }
    }

    update(choso) {
        if(this.enemiesList.length > 0) {
            var tiempoActual = Date.now();
            var msTranscurridos = tiempoActual - this.tiempoAnterior;
            var newPos = new THREE.Vector3(this.defPos.x, this.defPos.y, this.defPos.z);

            this.tiempoUntilNextSpawn -= msTranscurridos;

            if(this.tiempoUntilNextSpawn <= 0) {
                var enemyType = this.enemiesList.pop();
                var activated = false;

                switch(enemyType) {
                    case 0:
                        activated = this.currentEnemyActivated(this.bees, newPos);

                        if(!activated) {
                            this.bees.push(new Bee());
                            this.add(this.bees[this.bees.length - 1]);
                            this.bees[this.bees.length - 1].activate(newPos);
                        }

                        break;

                    case 1:
                        activated = this.currentEnemyActivated(this.wolves, newPos);

                        if(!activated) {
                            this.wolves.push(new Wolf());
                            this.add(this.wolves[this.wolves.length - 1]);
                            this.wolves[this.wolves.length - 1].activate(newPos);
                        }

                        break;
                }

                this.tiempoUntilNextSpawn = this.timeBetweenSpanws;
            }

            this.tiempoAnterior = tiempoActual;
        } else {
            this.tiempoAnterior = Date.now();
        }


        for (var i = 0; i < this.bees.length; i++) {
            if (!this.bees[i].getHidden()) {
                if (this.bees[i].isDefeated()) this.bees[i].hide();

                this.bees[i].update();
            }
        }

        for (var i = 0; i < this.wolves.length; i++) {
            if (!this.wolves[i].getHidden()) {
                if (this.wolves[i].isDefeated()) this.wolves[i].hide();

                this.wolves[i].update(choso.getPosition());
            }
        }
    }

    getEnemies() {
        var enemies = [];

        for (var i = 0; i < this.bees.length; i++)
            if (!this.bees[i].getHidden())
                enemies.push(this.bees[i]);

        for (var i = 0; i < this.wolves.length; i++)
            if (!this.wolves[i].getHidden())
                enemies.push(this.wolves[i]);

        return enemies;
    }

}

export {EnemyController};