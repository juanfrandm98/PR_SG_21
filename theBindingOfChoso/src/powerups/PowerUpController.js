import * as THREE from '../../libs/three.module.js'
import {MathUtils, Object3D} from "../../libs/three.module.js";
import {RedHeart} from "./RedHeart.js";
import {Grass} from "./Grass.js";
import {MilkingDevice} from "./MilkingDevice.js";
import {Udder} from "./Udder.js";
import {HorseShoe} from "./HorseShoe.js";

class PowerUpController extends Object3D {
    constructor(maxX, maxZ) {
        super();

        this.maxX = maxX;
        this.maxZ = maxZ;

        this.powerups = [];
        this.types = ["redheart", "grass", "milking", "udder", "horseshoe"];

        for (var i = 0; i < 3; i++) {
            this.powerups.push(new RedHeart());
            this.add(this.powerups[this.powerups.length - 1]);
            this.powerups.push(new Grass());
            this.add(this.powerups[this.powerups.length - 1]);
            this.powerups.push(new MilkingDevice());
            this.add(this.powerups[this.powerups.length - 1]);
            this.powerups.push(new Udder());
            this.add(this.powerups[this.powerups.length - 1]);
            this.powerups.push(new HorseShoe());
            this.add(this.powerups[this.powerups.length - 1]);
        }

        this.powerupsActivos = 0;
        this.maxPowerUpsActivos = 5;

        this.msEntrePowerUps = 5000;
        this.msRestantes = this.msEntrePowerUps;
        this.tiempoAnterior = Date.now();
    }

    generateRandomPowerUp(powerups, types) {
        var index = MathUtils.randInt(0, types.length - 1);
        var newType = types[index];
        var disponible = false;
        var nuevo;

        for (var i = 0; i < powerups.length && !disponible; i++) {
            if ((powerups[i].getName() === newType) && (!powerups[i].getVisible())) {
                disponible = true;
                nuevo = powerups[i];
            }
        }

        if (!disponible) {
            switch (newType) {
                case "redheart":
                    nuevo = new RedHeart();
                    this.add(nuevo);
                    this.powerups.push(nuevo);
                    break;

                case "grass":
                    nuevo = new Grass();
                    this.add(nuevo);
                    this.powerups.push(nuevo);
                    break;

                case "milking":
                    nuevo = new MilkingDevice();
                    this.add(nuevo);
                    this.powerups.push(nuevo);
                    break;

                case "udder":
                    nuevo = new Udder();
                    this.add(nuevo);
                    this.powerups.push(nuevo);
                    break;

                case "horseshoe":
                    nuevo = new HorseShoe();
                    this.add(nuevo);
                    this.powerups.push(nuevo);
                    break;
            }
        }

        return nuevo;
    }

    generateRandomPos(maxX, maxZ, hitRadius) {
        var x = MathUtils.randInt(-maxX + hitRadius, maxX - hitRadius);
        var y = 0;
        var z = MathUtils.randInt(-maxZ + hitRadius, maxZ - hitRadius);

        return (new THREE.Vector3(x, y, z));
    }

    calculateDistancePoints(p1, p2) {
        var distance = Math.pow((p1.x - p2.x), 2);
        distance += Math.pow((p1.z - p2.z), 2);
        return Math.sqrt(distance);
    }

    collisionDetect(obj1, obj2) {
        var distance = this.calculateDistancePoints(obj1.getPosition(), obj2.getPosition());
        var hitDistance = obj1.getHitRadius() + obj2.getHitRadius();

        if(distance < hitDistance) {
            return true;
        } else {
            return false;
        }
    }

    applyPowerUp(powerup, choso, soundsController) {
        soundsController.playPowerUpSound();

        switch(powerup.getName()) {
            case "redheart":
                choso.heal(powerup.getEffect());
                break;

            case "grass":
                choso.changeShotDamage(powerup.getEffect());
                break;

            case "milking":
                choso.changeShotRadius(powerup.getEffect());
                break;

            case "udder":
                choso.changeShotRange(powerup.getEffect());
                break;

            case "horseshoe":
                choso.changeSpeed(powerup.getEffect());
                break;
        }

    }

    update(choso, soundsController) {
        var tiempoActual = Date.now();
        var msTranscurridos = tiempoActual - this.tiempoAnterior;
        this.msRestantes -= msTranscurridos;

        // Generación de powerups
        if (this.msRestantes <= 0) {
            if(this.powerupsActivos < this.maxPowerUpsActivos) {
                var nuevo = this.generateRandomPowerUp(this.powerups, this.types);
                var pos = this.generateRandomPos(this.maxX, this.maxZ, nuevo.getHitRadius());
                nuevo.activate(pos);
                this.powerupsActivos++;
            }

            this.msRestantes = this.msEntrePowerUps;
        }

        this.tiempoAnterior = tiempoActual;

        for (var i = 0; i < this.powerups.length; i++) {
            if(this.powerups[i].getVisible()) {
                // Comprobación de powerups
                if(this.collisionDetect(this.powerups[i], choso)) {
                    this.applyPowerUp(this.powerups[i], choso, soundsController);
                    this.powerups[i].desactivate();
                    this.powerupsActivos--;
                }

                // Actualización de powerups
                if (this.powerups[i].getVisible()) this.powerups[i].update();
            }
        }
    }

}

export {PowerUpController};