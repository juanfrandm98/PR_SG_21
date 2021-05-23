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
        this.contactDamage = 1;

        this.maxHealth = 1;
        this.health = this.maxHealth;

        this.hitBox = new THREE.Object3D();
        this.add(this.hitBox);

        this.tiempoAnterior = Date.now();
        this.enMovimiento = false;
    }

    update() {
    }

    checkPosition(pos, maxX, maxZ, hitRadius) {
        if (pos.x > (maxX - hitRadius)) pos.x = maxX - hitRadius;
        if (pos.x < (-maxX + hitRadius)) pos.x = -maxX + hitRadius;
        if (pos.z > (maxZ - hitRadius)) pos.z = maxZ - hitRadius;
        if (pos.z < (-maxZ + hitRadius)) pos.z = -maxZ + hitRadius;

        return pos;
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    getPosition() {
        return this.hitBox.position;
    }

    setPosition(pos) {
        this.hitBox.position.set(pos);
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

    getContactDamage() {
        return this.contactDamage;
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

    heal(amount) {
        this.health += amount;
        if (this.health > this.maxHealth) this.health = this.maxHealth;
    }

}

export {Character};