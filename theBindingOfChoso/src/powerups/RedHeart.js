import * as THREE from '../../libs/three.module.js'
import {PowerUp} from "./PowerUp.js"
import {Heart} from "./Heart.js"

class RedHeart extends PowerUp {

    constructor() {
        super();

        // Variables para el control del powerup
        this.name = "redheart";
        this.effect = 1;
        this.hitRadius = 0.5;

        // Creación del powerup
        var heart = new Heart(new THREE.Color(1, 0, 0));
        heart.rotateX(Math.PI);

        this.nodo.add(heart);

        // Variables para la animación
        this.velRot = 0.001;
        this.maxH = 1;
        this.minH = 0.5;
        this.velH = 0.0005;
        this.up = false;
    }

    // Activa el powerup, colocándolo en función de su altura
    activate(pos) {
        pos.y = 0.75;
        super.activate(pos);
    }

}

export {RedHeart};