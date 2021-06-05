import {Object3D} from "../libs/three.module.js";

class CollisionController extends Object3D {
    constructor(maxX, maxZ) {
        super();
        this.maxX = maxX;
        this.maxZ = maxZ;
    }

    // Calcula la distancia entre dos puntos.
    calculateDistancePoints(p1, p2) {
        var distance = Math.pow((p1.x - p2.x), 2);
        distance += Math.pow((p1.z - p2.z), 2);
        return Math.sqrt(distance);
    }

    // Comprueba si dos objetos colisionan, calculando la distancia entre sus
    // puntos y sumándo sus respectivos hitRadius
    collisionDetect(obj1, obj2) {
        var distance = this.calculateDistancePoints(obj1.getPosition(), obj2.getPosition());
        var hitDistance = obj1.getHitRadius() + obj2.getHitRadius();

        if (distance < hitDistance) {
            return true;
        } else {
            return false;
        }
    }

    // Comprueba las colisiones físicas entre Choso y los enemigos activos
    collisionEnemiesChoso(enemies, choso, soundsController) {
        for (var i = 0; i < enemies.length; i++) {
            if (this.collisionDetect(enemies[i], choso)) {
                choso.takeDamage(enemies[i].getContactDamage(), soundsController);
            }
        }
    }

}

export {CollisionController};