import * as THREE from '../../libs/three.module.js'
import {Character} from "./Character.js";
import {MathUtils} from "../../libs/three.module.js";
import {BeeModel} from "./BeeModel.js";

class Bee extends Character {

    constructor(maxX, maxZ) {
        super();

        // Valores para no salirse de la parcela
        this.maxX = maxX;
        this.maxZ = maxZ;

        // Estadísticas de la abeja
        this.speed = 5;
        this.shootSpeed = 0;
        this.maxHealth = 2;
        this.hitRadius = 1.3;

        // Modelo
        this.bee = new BeeModel();
        this.hitBox.add(this.bee);
        this.hitBox.visible = false;

        // Variables para la animación
        this.directions = ["up", "down", "left", "right"];
        this.direction;
        this.tiempoAcumulado = 0;
        this.msCambioDireccion = 2000;
    }

    // Cambia la dirección y la inclinación del modelo
    changeBeeDirection(bee, direction) {
        switch (direction) {
            case "up":
                bee.setBeeRotation(Math.PI);
                bee.rotation.x = -Math.PI / 4;
                bee.rotation.z = 0;
                break;

            case "down":
                bee.setBeeRotation(0);
                bee.rotation.x = Math.PI / 4;
                bee.rotation.z = 0;
                break;

            case "left":
                bee.setBeeRotation(Math.PI / 2);
                bee.rotation.x = 0;
                bee.rotation.z = Math.PI / 4;
                break;

            case "right":
                bee.setBeeRotation(3 * Math.PI / 2);
                bee.rotation.x = 0;
                bee.rotation.z = -Math.PI / 4;
                break;
        }
    }

    // Actualización
    update() {
        var tiempoActual = Date.now();
        var msTranscurridos = tiempoActual - this.tiempoAnterior
        var segundosTranscurridos = msTranscurridos / 1000;

        this.tiempoAcumulado += msTranscurridos;

        // Gestión del cambio de dirección
        if (!this.enMovimiento || this.tiempoAcumulado >= this.msCambioDireccion) {
            var index = MathUtils.randInt(0, 3);
            this.direction = this.directions[index];
            this.enMovimiento = true;
            this.tiempoAcumulado = 0;
        }

        // Cálculo de la nueva posición
        var nuevaPos = new THREE.Vector3(this.hitBox.position.x, this.hitBox.position.y, this.hitBox.position.z);

        switch (this.direction) {
            case "up":
                nuevaPos.z -= this.speed * segundosTranscurridos;
                break;

            case "down":
                nuevaPos.z += this.speed * segundosTranscurridos;
                break;

            case "left":
                nuevaPos.x -= this.speed * segundosTranscurridos;
                break;

            case "right":
                nuevaPos.x += this.speed * segundosTranscurridos;
                break;
        }

        // Comprobación de la dirección
        this.direction = this.checkDirection(nuevaPos, this.maxX, this.maxZ, this.hitRadius, this.direction);
        this.changeBeeDirection(this.bee, this.direction);

        nuevaPos = super.checkPosition(nuevaPos, this.maxX, this.maxZ, this.hitRadius);

        // Actualización de la posición y el modelo
        this.hitBox.position.copy(nuevaPos);
        this.bee.update();

        this.tiempoAnterior = tiempoActual;

    }

    // Devuelve la dirección opuesta a una dada
    opositeDirection(direction) {
        switch (direction) {
            case "up":
                return "down";

            case "down":
                return "up";

            case "left":
                return "right";

            case "right":
                return "left";
        }
    }

    // Comprueba si se necesita invertir la dirección (si toca la valla)
    checkDirection(pos, maxX, maxZ, hitRadius, direction) {
        if (
            (pos.x > (maxX - hitRadius)) ||
            (pos.x < (-maxX + hitRadius)) ||
            (pos.z > (maxZ - hitRadius)) ||
            (pos.z < (-maxZ + hitRadius))
        ) {
            return this.opositeDirection(direction);
        } else {
            return direction;
        }
    }

    // Activación de la abeja
    activate(pos) {
        pos.y += 1;
        super.activate(pos);
    }

}

export {Bee};