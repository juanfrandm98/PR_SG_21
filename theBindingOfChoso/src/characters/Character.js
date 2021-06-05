import * as THREE from '../../libs/three.module.js'

class Character extends THREE.Object3D {

    constructor() {
        super();

        // Variables para el control de la posición dentro de la parcela
        this.maxX = 0;
        this.maxZ = 0;

        // Estadísticas del personaje
        this.speed = 0.5;
        this.shootSpeed = 1;
        this.shootRadius = 0.2;
        this.hitRadius = 1;
        this.contactDamage = 1;

        this.maxHealth = 1;
        this.health = this.maxHealth;

        // Nodo para el modelo
        this.hitBox = new THREE.Object3D();
        this.add(this.hitBox);

        // Variables para la temporización y el movimiento
        this.tiempoAnterior = Date.now();
        this.enMovimiento = false;
    }

    update() {
    }

    // Comprueba y modifica la posición si es necesario para que el personaje
    // se mantenga dentro de la parcela
    checkPosition(pos, maxX, maxZ, hitRadius) {
        if (pos.x > (maxX - hitRadius)) pos.x = maxX - hitRadius;
        if (pos.x < (-maxX + hitRadius)) pos.x = -maxX + hitRadius;
        if (pos.z > (maxZ - hitRadius)) pos.z = maxZ - hitRadius;
        if (pos.z < (-maxZ + hitRadius)) pos.z = -maxZ + hitRadius;

        return pos;
    }

    // Setter de la velocidad de movimiento
    setSpeed(speed) {
        this.speed = speed;
    }

    // Getter de la posición
    getPosition() {
        return this.hitBox.position;
    }

    // Setter de la posición
    setPosition(pos) {
        this.hitBox.position.set(pos.x, pos.y, pos.z);
    }

    // Getter de la velocidad de disparo
    getShootSpeed() {
        return this.shootSpeed;
    }

    // Getter del radio del disparo
    getShootRadius() {
        return this.shootRadius;
    }

    // Getter del radio de colisión
    getHitRadius() {
        return this.hitRadius;
    }

    // Getter del daño por contacto
    getContactDamage() {
        return this.contactDamage;
    }

    // Getter de la salud máxima
    getMaxHealth() {
        return this.maxHealth;
    }

    // Getter de la salud actual
    getHealth() {
        return this.health;
    }

    // Resta a la salud actual una cantidad de daño
    takeDamage(damage) {
        this.health -= damage;
    }

    // Comprueba si el personaje ha sido derrotado (sin salud)
    isDefeated() {
        return this.health <= 0;
    }

    // Desactiva el personaje
    hide() {
        this.hitBox.visible = false;
    }

    // Getter para comprobar si el personaje está activo o no (según la
    // visibilidad del modelo)
    getHidden() {
        return !this.hitBox.visible;
    }

    // Activación de un personaje en una determinada posición, activando la
    // visibilidad del modelo y poniendo su salud al máximo
    activate(pos) {
        var nuevaPos = this.checkPosition(pos, this.maxX, this.maxZ, this.hitRadius);
        this.health = this.maxHealth;
        this.hitBox.position.set(nuevaPos.x, nuevaPos.y, nuevaPos.z);
        this.hitBox.visible = true;
        this.tiempoAnterior = Date.now();
    }

    // Cura al personaje una determinada cantidad
    heal(amount) {
        this.health += amount;
        if (this.health > this.maxHealth) this.health = this.maxHealth;
    }

}

export {Character};