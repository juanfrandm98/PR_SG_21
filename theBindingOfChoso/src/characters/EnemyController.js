import * as THREE from '../../libs/three.module.js'
import {Bee} from "./Bee.js";
import {Wolf} from "./Wolf.js";
import {Bear} from "./Bear.js";
import {MathUtils} from "../../libs/three.module.js";

class EnemyController extends THREE.Object3D {

    constructor(maxX, maxZ) {
        super();

        this.maxX = maxX;
        this.maxZ = maxZ;

        this.bees = [];
        this.wolves = [];
        this.bears = [];
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

        for (var i = 0; i < 10; i++) {
            this.bears.push(new Bear(this.maxX, this.maxZ));
            this.add(this.bears[i]);
        }

        this.enemiesList = [];

        this.tiempoAnterior = Date.now();
        this.tiempoUntilNextSpawn = this.timeBetweenSpanws;

        this.numWave = 0;
        this.wavePause = true;
        this.timeBetweenWaves = 5000;
        this.timeUntilNextWave = 0;
    }

    currentEnemyActivated(vector, pos) {
        var encontrado = false;

        for (var i = 0; i < vector.length && !encontrado; i++) {
            if (vector[i].getHidden()) {
                encontrado = true;
                vector[i].activate(pos);
            }
        }

        return encontrado;
    }

    generateEnemies() {
        this.numWave++;
        var probTypes;
        var numEnemies;

        if (this.numWave === 1) {
             probTypes = [0, 0, 0, 1];
             numEnemies = 10;
        } else if (this.numWave === 2) {
            probTypes = [0, 0, 1, 1, 2];
            numEnemies = 12;
        } else if (this.numWave === 3) {
            probTypes = [0, 1, 2];
            numEnemies = 15;
        } else {
            probTypes = [0, 1, 1, 2, 2];
            numEnemies = 18;
        }

        var index;

        for (var i = 0; i < numEnemies; i++) {
            index = MathUtils.randInt(0, probTypes.length - 1);
            this.enemiesList.push(probTypes[index]);
        }
    }

    randomSpawnPos(maxX, maxZ) {
        var pos = new THREE.Vector3(0, 0, 0);
        var dif = 5;

        var firstRand = MathUtils.randInt(0, 3);

        switch (firstRand) {
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
        var tiempoActual = Date.now();
        var msTranscurridos = tiempoActual - this.tiempoAnterior;

        if(this.wavePause) {
            if(this.timeUntilNextWave <= 0) {
                this.generateEnemies();
                this.wavePause = false;
            } else {
                this.timeUntilNextWave -= msTranscurridos;
                this.tiempoAnterior = tiempoActual;
            }
        } else {
            var activeEnemies = this.getEnemies();

            if(activeEnemies.length !== 0 || this.enemiesList.length !== 0) {
                if (this.enemiesList.length > 0) {

                    this.tiempoUntilNextSpawn -= msTranscurridos;

                    if (this.tiempoUntilNextSpawn <= 0) {
                        var enemyType = this.enemiesList.pop();
                        var newPos = this.randomSpawnPos(this.maxX, this.maxZ);
                        var activated = false;

                        switch (enemyType) {
                            case 0:
                                activated = this.currentEnemyActivated(this.bees, newPos);

                                if (!activated) {
                                    this.bees.push(new Bee(this.maxX, this.maxZ));
                                    this.add(this.bees[this.bees.length - 1]);
                                    this.bees[this.bees.length - 1].activate(newPos);
                                }

                                break;

                            case 1:
                                activated = this.currentEnemyActivated(this.wolves, newPos);

                                if (!activated) {
                                    this.wolves.push(new Wolf(this.maxX, this.maxZ));
                                    this.add(this.wolves[this.wolves.length - 1]);
                                    this.wolves[this.wolves.length - 1].activate(newPos);
                                }

                                break;

                            case 2:
                                activated = this.currentEnemyActivated(this.bears, newPos);

                                if (!activated) {
                                    this.bears.push(new Bear(this.maxX, this.maxZ));
                                    this.add(this.bears[this.bears.length - 1]);
                                    this.bears[this.bears.length - 1].activate(newPos);
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

                for (var i = 0; i < this.bears.length; i++) {
                    if (!this.bears[i].getHidden()) {
                        if (this.bears[i].isDefeated()) {
                            soundsController.playBearDeath();
                            this.bears[i].hide();
                        }

                        this.bears[i].update(choso, soundsController);
                    }
                }
            } else {
                this.wavePause = true;
                this.timeUntilNextWave = this.timeBetweenWaves;
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

        for (var i = 0; i < this.bears.length; i++)
            if (!this.bears[i].getHidden())
                enemies.push(this.bears[i]);

        return enemies;
    }

}

export {EnemyController};