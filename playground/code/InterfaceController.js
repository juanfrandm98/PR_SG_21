import * as THREE from '../../libs/three.module.js'
import {SemiHeart} from "./SemiHeart.js";
import {TextBufferGeometry} from "../libs/three.module.js";

class InterfaceController extends THREE.Object3D {

    constructor(maxHP) {
        super();

        this.hearts = [];
        var i;
        var y = -0.5;
        var x = 0.5;
        var xPerCouple = 0.75;

        for(i = 0; i < maxHP; i++) {
            this.hearts.push(new SemiHeart());
            this.hearts[i].position.y = y;
            this.add(this.hearts[i]);
        }

        for(i = 0; i < this.hearts.length; i += 2) {
            this.hearts[i].rotateY();
            this.hearts[i].position.x = x + xPerCouple * i;
            this.hearts[i + 1].position.x = x + xPerCouple * i;
        }

        this.icon = new SemiHeart();
        this.icon.position.set(0.5, -2, 0);
        this.add(this.icon);

        this.maxHealth = maxHP;
        this.currentHeart = maxHP - 1;
        this.beatingSpeed = 0.001;
        this.maxBeat = 1.5;
        this.minBeat = 1;
        this.beatUp = true;

        this.tiempoAnterior = Date.now();
    }

    update(health) {
        if(health >= 0 && health <= this.maxHealth) {
            var currentHealth = this.currentHeart + 1;
            var i;
            var numHeart;

            if(health > currentHealth) {
                numHeart = this.currentHeart + 1;
                for(i = numHeart; i < health; i++) this.hearts[i].changeColor();
            } else if(health < currentHealth) {
                numHeart = this.currentHeart;
                for(i = numHeart; i >= health; i--) this.hearts[i].changeColor();
            }

            this.currentHeart = health - 1;
        }

        if(health === 1 || health === 2) {
            var tiempoActual = Date.now();
            var msTranscurridos = tiempoActual - this.tiempoAnterior;
            this.tiempoAnterior = tiempoActual;

            var scale = this.hearts[0].getScale();

            if(this.beatUp) {
                scale += this.beatingSpeed * msTranscurridos;
                if(scale > this.maxBeat) {
                    scale = this.maxBeat;
                    this.beatUp = false;
                }
            } else {
                scale -= this.beatingSpeed * msTranscurridos;
                if(scale < this.minBeat) {
                    scale = this.minBeat;
                    this.beatUp = true;
                }
            }

            if(health === 1) {
                this.hearts[0].changeScale(scale);
                this.hearts[1].changeScale(1);
            } else {
                this.hearts[0].changeScale(scale);
                this.hearts[1].changeScale(scale);
            }

        } else {
            this.hearts[0].changeScale(1);
            this.hearts[1].changeScale(1);
        }

    }

}

export {InterfaceController};