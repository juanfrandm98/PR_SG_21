import * as THREE from '../libs/three.module.js'

class Character extends THREE.Object3D {

    constructor() {
        super();

        this.maxX = 0;
        this.maxZ = 0;

        this.speed = 0.5;
        this.shootSpeed = 1;
        this.shootRadius = 0.2;
        this.hitRadius = 1;

        this.maxHealth = 1;
        this.health = this.maxHealth;

        this.hitBox = null;

        this.tiempoAnterior = Date.now();
        this.enMovimiento = false;
    }

    update() {
    }

    checkPosition(pos, maxX, maxZ, hitRadius) {
        if(pos.x > (maxX - hitRadius)) pos.x = maxX - hitRadius;
        if(pos.x < (-maxX + hitRadius)) pos.x = -maxX + hitRadius;
        if(pos.z > (maxZ - hitRadius)) pos.z = maxZ - hitRadius;
        if(pos.z < (-maxZ + hitRadius)) pos.z = -maxZ + hitRadius;

        return pos;
    }

    getPosition() {
        return this.hitBox.position;
    }

    getShootSpeed() {
        return this.shootSpeed;
    }

    getShootRadius() {
        return this.shootRadius;
    }

    getHitRadius() {
        return this.hitRadius;
    }

    takeDamage(damage) {
        this.health -= damage;
    }

    isDefeated() {
        return this.health <= 0;
    }

    hide() {
        this.hitBox.visible = false;
    }

    getHidden() {
        return !this.hitBox.visible;
    }

    activate(pos) {
        this.health = this.maxHealth;
        this.hitBox.position.copy(pos);
        this.hitBox.visible = true;
    }

}

export {Character};