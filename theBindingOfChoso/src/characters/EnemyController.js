import * as THREE from '../../libs/three.module.js'
import {Bee} from "./Bee.js";
import {Wolf} from "./Wolf.js";
import {Bear} from "./Bear.js";
import {MathUtils} from "../../libs/three.module.js";

class EnemyController extends THREE.Object3D {

    constructor(maxX, maxZ) {
        super();

        // Variables para controlar las posiciones de los enemigos generados
        this.maxX = maxX;
        this.maxZ = maxZ;

        // Vectores de enemigos
        this.bees = [];
        this.wolves = [];
        this.bears = [];
        this.defPos = new THREE.Vector3(20, 0, -20);
        this.timeBetweenSpanws = 2000;

        for (var i = 0; i < 5; i++) {
            this.bees.push(new Bee(this.maxX, this.maxZ));
            this.add(this.bees[i]);
        }

        for (var i = 0; i < 5; i++) {
            this.wolves.push(new Wolf(this.maxX, this.maxZ));
            this.add(this.wolves[i]);
        }

        for (var i = 0; i < 5; i++) {
            this.bears.push(new Bear(this.maxX, this.maxZ));
            this.add(this.bears[i]);
        }

        // Vector de enemigos que faltan por activar en cada ronda
        this.enemiesList = [];

        this.tiempoAnterior = Date.now();
        this.tiempoUntilNextSpawn = this.timeBetweenSpanws;

        // Variable para conocer el cambio de oleada desde fuera del controlador
        this.justPaused = false;

        // Variable para distinguir cuando los osos disparan aleatoriamente
        // (false) y cuando disparan a Choso (true)
        this.bearShootingTracking = false;

        // Variables para el control de olas
        this.numWave = 1;
        this.wavePause = true;
        this.timeBetweenWaves = 5000;
        this.timeUntilNextWave = 0;
    }

    // Cambia la dificultad de los enemigos (a partir de la ola 4, los osos
    // cambian su tipo de disparo)
    changeDifficulty(numWave) {
        if (numWave >= 4) this.bearShootingTracking = true;
    }

    // Devuelve true si se ha podido activar un determinado enemigo o false si
    // se necesita crear otro nuevo
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

    // Rellena el vector de enemigos restantes de una ola en de forma aleatoria
    // en función del número de la misma
    generateEnemies() {
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

    // Genera una posición aleatoria cerca de una de las vallas
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

    // Actualización
    update(choso, soundsController) {
        var tiempoActual = Date.now();
        var msTranscurridos = tiempoActual - this.tiempoAnterior;

        if (this.wavePause) {
            // Si la ola está pausada, contabiliza y espera a que pase el tiepmo
            // necesario para generar los nuevos enemigos
            this.justPaused = false;

            if (this.timeUntilNextWave <= 0) {
                this.generateEnemies();
                this.wavePause = false;
            } else {
                this.timeUntilNextWave -= msTranscurridos;
                this.tiempoAnterior = tiempoActual;
            }
        } else {
            // Si la ola no está pausada (terminada)
            var activeEnemies = this.getEnemies();

            if (activeEnemies.length !== 0 || this.enemiesList.length !== 0) {
                // Si quedan enemigos de la ola
                if (this.enemiesList.length > 0) {
                    // Si quedan enemigos por generar y ha pasado el tiempo
                    // necesario, genera uno del tipo sacado de enemiesList
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

                // Actualiza cada uno de los enemigos activos, comprobando antes
                // si alguno acaba de ser derrotado para desactivarlo
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
                    if (this.bears[i].isDefeated() && !this.bears[i].getHidden()) {
                        soundsController.playBearDeath();
                        this.bears[i].hide();
                    }

                    this.bears[i].update(choso, soundsController, this.bearShootingTracking);
                }
            } else {
                // Si no quedan enemigos activos o en la lista de enemigos por
                // activar, pausa la ola (la termina) e incrementa su número
                this.wavePause = true;
                this.timeUntilNextWave = this.timeBetweenWaves;
                this.justPaused = true;
                this.numWave++;
            }
        }

    }

    // Devuelve una lista con los enemigos activos de TODOS los tipos
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

    // Devuelve si la ola acaba de terminar
    getJustPaused() {
        return this.justPaused;
    }

    // Devuelve el número actual de ola
    getNumWave() {
        return this.numWave;
    }

}

export {EnemyController};