import * as THREE from '../libs/three.module.js'
import {PowerUp} from "./PowerUp.js"
import {Heart} from "./Heart.js"

class RedHeart extends PowerUp {

    constructor() {
        super();

        this.name = "redheart";
        this.effect = 1;
        this.hitRadius = 0.5;

        var heart = new Heart(new THREE.Color(1,0,0));
        heart.rotateX(Math.PI);

        this.nodo.add(heart);

        // Variables para la animación
        this.velRot = 0.001;
        this.maxH = 1;
        this.minH = 0.5;
        this.velH = 0.0005;
        this.up = false;
    }

    activate(pos) {
        pos.y = 0.75;
        super.activate(pos);
    }

    update() {
        var tiempoActual = Date.now();
        var msTranscurridos = tiempoActual - this.tiempoAnterior;

        var h = this.nodo.position.y;

        if(this.up) {
            h += this.velH * msTranscurridos;

            if(h >= this.maxH) {
                h = this.maxH;
                this.up = false;
            }
        } else {
            h -= this.velH * msTranscurridos;

            if(h <= this.minH) {
                h = this.minH;
                this.up = true;
            }
        }

        this.nodo.position.y = h;

        this.nodo.rotateY(this.velRot * msTranscurridos);

        this.tiempoAnterior = tiempoActual;
    }

}

export {RedHeart};