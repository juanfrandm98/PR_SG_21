import * as THREE from '../../libs/three.module.js'
import {Character} from "./Character.js";
import {MathUtils} from "../../libs/three.module.js";
import {WolfModel} from "./WolfModel.js";

class Wolf extends Character {

    constructor(maxX, maxZ) {
        super();

        // Variables para mantenerse dentro de la parcela
        this.maxX = maxX;
        this.maxZ = maxZ;

        // Estadísticas
        this.speed = 8;
        this.shootSpeed = 0;
        this.maxHealth = 4;

        // Modelo
        this.wolf = new WolfModel();

        this.hitBox.add(this.wolf);
        this.hitBox.position.y += 1;
        this.hitBox.visible = false;

        // Para el retroceso tras golpe
        this.isGoingBack = false;
        this.maxSegundosGoingBack = 0.75;
        this.segundosGoingBack = 0.0;
        this.dirXBack = 0;
        this.dirZBack = 0;
    }

    // Cálculo de los coeficientes de movimiento localizando a Choso
    calculateCoef(position, target, coefX) {
        var dif;

        if (coefX) dif = position.x - target.x;
        else dif = position.z - target.z;

        if (dif > 0) return -1;
        else if (dif < 0) return 1;
        else return 0;
    }

    // Actualización
    update(target) {
        var tiempoActual = Date.now();
        var segundosTranscurridos = (tiempoActual - this.tiempoAnterior) / 1000;

        // Coeficiente de dirección en cada eje
        var dirX = 0;
        var dirZ = 0;

        // Si está retrocediendo
        if (this.isGoingBack) {
            dirX = this.dirXBack;
            dirZ = this.dirZBack;

            this.segundosGoingBack -= segundosTranscurridos;

            if (this.segundosGoingBack <= 0) this.isGoingBack = false;
        } else {
            // Si está persiguiendo a Choso
            dirX = this.calculateCoef(this.hitBox.position, target, true);
            dirZ = this.calculateCoef(this.hitBox.position, target, false);

            this.wolf.update(this.speed, dirX, dirZ);
        }

        // Cálculo de la nueva posición
        var newPos = new THREE.Vector3(0, 0, 0);
        newPos.x = this.hitBox.position.x + dirX * this.speed * segundosTranscurridos;
        newPos.y = this.hitBox.position.y;
        newPos.z = this.hitBox.position.z + dirZ * this.speed * segundosTranscurridos;

        // Comprobar que la animación de la persecución sea fluida
        var sameX = false;
        var sameZ = false;

        if (!this.isGoingBack) {
            var margin = 0.5;

            if (Math.abs(target.x - newPos.x) < margin) {
                newPos.x = target.x;
                sameX = true;
            }

            if (Math.abs(target.z - newPos.z) < margin) {
                newPos.z = target.z;
                sameZ = true;
            }
        }

        newPos = super.checkPosition(newPos, this.maxX, this.maxZ, this.hitRadius);

        // Si sameX y sameZ quiere decir que está golpeando a Choso, por lo que
        // comienza su etapa de retroceso
        if (sameX && sameZ) {
            this.isGoingBack = true;
            this.segundosGoingBack = this.maxSegundosGoingBack;
            this.dirXBack = -dirX;
            this.dirZBack = -dirZ;
        }

        this.hitBox.position.set(newPos.x, newPos.y, newPos.z);

        this.tiempoAnterior = tiempoActual;
    }

}

export {Wolf};