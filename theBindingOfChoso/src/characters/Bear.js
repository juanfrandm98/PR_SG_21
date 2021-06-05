import * as THREE from '../../libs/three.module.js'
import {Character} from "./Character.js";
import {MathUtils} from "../../libs/three.module.js";
import {BearModel} from "./BearModel.js";
import {ShootingController} from "./ShootingController.js";

class Bear extends Character {

    constructor(maxX, maxZ) {
        super();

        // Variables para el control de la posición (dentro de la parcela)
        this.maxX = maxX;
        this.maxZ = maxZ;

        // Estadísticas concretas
        this.speed = 4;
        this.shootSpeed = 1;
        this.maxHealth = 5;
        this.hitRadius = 0.8;

        // Modelo
        this.bear = new BearModel();
        this.hitBox.add(this.bear);
        this.hitBox.visible = false;

        // Variables para el movimiento
        this.directions = ["up", "down", "left", "right"];
        this.direction;
        this.tiempoAcumulado = 0;
        this.msCambioDireccion = 2000;

        // Cargador de la textura de la colmena para el disparo
        var loader = new THREE.TextureLoader();
        var textura = loader.load("../../imgs/hive.jpg");

        // Control del disparo de colmenas
        var shotMat = new THREE.MeshPhongMaterial({map: textura});
        this.shootingController = new ShootingController(5, 1, 1, 10, 0.3, 10, shotMat);
        this.add(this.shootingController);
    }

    // Cálculo de una dirección aleatoria (arriba, abajo, izquierda, derecha)
    getRandomDir() {
        var index = MathUtils.randInt(0, 3);
        var dir = new THREE.Vector2(0, 0);

        switch (index) {
            case 0:
                dir.y = -1;
                break;
            case 1:
                dir.y = 1;
                break;
            case 2:
                dir.z = -1;
                break;
            case 3:
                dir.z = 1;
                break;
        }

        return dir;
    }

    // Obtención de la dirección de disparo cuando apunta a Choso
    getChosoDir(choso) {
        var dir = new THREE.Vector2(0, 0);

        var myPos = this.hitBox.position;
        var objPos = choso.getPosition();

        dir.x = objPos.x - myPos.x;
        dir.y = objPos.z - myPos.z;

        return dir.normalize();
    }

    // Actualización
    update(choso, soundsController, tracking) {
        var tiempoActual = Date.now();
        var msTranscurridos = tiempoActual - this.tiempoAnterior
        var segundosTranscurridos = msTranscurridos / 1000;

        this.tiempoAcumulado += msTranscurridos;

        var pos = new THREE.Vector3(this.hitBox.position.x, 1.5, this.hitBox.position.z);
        var targets = [choso];
        var dir;

        // Obtención de la dirección de disparo, ya sea aleatoria o hacia Choso
        if (tracking) dir = this.getChosoDir(choso);
        else dir = this.getRandomDir();

        // Si el oso está activo
        if (this.hitBox.visible) {
            // Control del cambio de dirección de movimiento
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

            // Comprueba si tiene que cambiar la dirección
            this.direction = this.checkDirection(nuevaPos, this.maxX, this.maxZ, this.hitRadius, this.direction);
            nuevaPos = super.checkPosition(nuevaPos, this.maxX, this.maxZ, this.hitRadius);

            // Actualiza posición, modelo y controlador de disparos
            this.hitBox.position.copy(nuevaPos);
            this.bear.update(this.speed, this.direction);

            this.shootingController.update(true, pos, dir, targets, soundsController);
        } else {
            // Si no está activo, actualiza el controlador de disparos
            this.shootingController.update(false, pos, dir, targets, soundsController);
        }

        this.tiempoAnterior = tiempoActual;

    }

    // Devuelve la dirección opuesta a la actual (para cuando toca la valla)
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

    // Comprueba si se necesita cambiar de dirección
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

    // Activa el oso
    activate(pos) {
        pos.y += 1;
        super.activate(pos);
    }

}

export {Bear};