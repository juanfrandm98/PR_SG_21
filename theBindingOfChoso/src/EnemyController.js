import * as THREE from '../libs/three.module.js'
import {Bee} from "./Bee.js";
import {Wolf} from "./Wolf.js";
import {MathUtils} from "../libs/three.module.js";

class EnemyController extends THREE.Object3D {

    constructor(maxX, maxZ) {
        super();

        this.maxX = maxX;
        this.maxZ = maxZ;

        this.bees = [];
        this.wolves = [];
        this.defPos = new THREE.Vector3(20, 0, -20);
        this.timeBetweenSpanws = 2000;

        for (var i = 0; i < 10; i++) {
            this.bees.push(new Bee(this.maxX, this.maxZ));
            this.add(this.bees[i]);
        }

        for (var i = 0; i < 10; i++) {
            this.wolves.push(new Wolf(this.maxX, this.maxZ));
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

    randomSpawnPos(maxX, maxZ) {
        var pos = new THREE.Vector3(0,0,0);
        var dif = 5;

        var firstRand = MathUtils.randInt(0, 3);

        switch(firstRand) {
            case 0:
                // 0 - Pegado a la izquierda
                pos.x = -maxX + dif;
                pos.z = MathUtils.randInt(-maxZ + dif, maxZ - dif);
                break;
            case 1:
                // 1 - Pegado arriba
                pos.z = -maxZ + dif;
                pos.x = MathUtils.randInt(-maxX + dif, maxX - dif);
                break;

            case 2:
                // 2 - Pegado a la derecha
                pos.x = maxX - dif;
                pos.z = MathUtils.randInt(-maxZ + dif, maxZ - dif);
                break;

            case 3:
                // 3 - pegado abajo
                pos.z = maxZ - dif;
                pos.x = MathUtils.randInt(-maxX + dif, maxX - dif);
                break;
        }

        return pos;
    }

    update(choso, soundsController) {
        if(this.enemiesList.length > 0) {
            var tiempoActual = Date.now();
            var msTranscurridos = tiempoActual - this.tiempoAnterior;

            this.tiempoUntilNextSpawn -= msTranscurridos;

            if(this.tiempoUntilNextSpawn <= 0) {
                var enemyType = this.enemiesList.pop();
                var newPos = this.randomSpawnPos(this.maxX, this.maxZ);
                var activated = false;

                switch(enemyType) {
                    case 0:
                        activated = this.currentEnemyActivated(this.bees, newPos);

                        if(!activated) {
                            this.bees.push(new Bee(this.maxX, this.maxZ));
                            this.add(this.bees[this.bees.length - 1]);
                            this.bees[this.bees.length - 1].activate(newPos);
                        }

                        break;

                    case 1:
                        activated = this.currentEnemyActivated(this.wolves, newPos);

                        if(!activated) {
                            this.wolves.push(new Wolf(this.maxX, this.maxZ));
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
                if (this.bees[i].isDefeated()) {
                    soundsController.playBeeDeath();
                    this.bees[i].hide();
                }

                this.bees[i].update();
            }
        }

        for (var i = 0; i < this.wolves.length; i++) {
            if (!this.wolves[i].getHidden()) {
                if (this.wolves[i].isDefeated()) {
                    soundsController.playWolfDeath();
                    this.wolves[i].hide();
                }

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