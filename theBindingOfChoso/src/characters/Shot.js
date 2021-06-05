import * as THREE from '../../libs/three.module.js'

class Shot extends THREE.Object3D {

    constructor(speed, radius, range, sphMat) {
        super();

        // Características básicas del disparo
        this.defPos = new THREE.Vector3(0, 5, 0);
        this.radius = radius;
        this.damage = 1;
        this.finished = true;
        this.speed = speed;
        this.range = range;

        var sphGeom = new THREE.SphereGeometry(this.radius, 10, 10);

        // Modelo
        this.shot = new THREE.Mesh(sphGeom, sphMat);
        this.shot.position.copy(this.defPos);
        this.shot.visible = false;
        this.add(this.shot);
    }

    // Activa el disparo, estableciendo sus características
    resetShoot(damage, shotRadius, origin, dirShot, range) {
        this.damage = damage;
        this.range = range;

        // Si cambia el radio del disparo, le asigna una nueva geometría
        if (shotRadius !== this.radius) {
            this.radius = shotRadius;
            this.shot.geometry = new THREE.SphereGeometry(this.radius, 10, 10);
        }

        // Cálculo del destino del disparo
        this.dirShot = new THREE.Vector3(dirShot.x, 0, dirShot.y);
        this.destiny = this.calculateDestiny(origin, this.dirShot, this.range);
        this.finished = false;
        this.shot.visible = true;

        this.shot.position.copy(origin);

        // Cálculo de la duración del disparo (desde el origen al destino, en
        // función de la velocidad)
        this.duration = this.calculateDuration(origin, this.destiny, this.speed);
        this.currentDur = 0;
        this.tiempoAnterior = Date.now();
    }

    // Cálculo de la duración del desplazamiento del disparo
    calculateDuration(origin, destiny, speed) {
        var distance = (destiny.x - origin.x) * (destiny.x - origin.x);
        distance = distance + (destiny.z - origin.z) * (destiny.z - origin.z);
        distance = Math.sqrt(distance);

        return (distance / speed);
    }

    // Cálculo del punto de destino del disparo
    calculateDestiny(origin, dirShot, range) {
        var x = origin.x + dirShot.x * range;
        var y = origin.y + dirShot.y * range;
        var z = origin.z + dirShot.z * range;

        return new THREE.Vector3(x, y, z);
    }

    // Actualización del disparo (posición y comprobación de finalización)
    update() {
        var tiempoActual = Date.now();
        var segundosTranscurridos = (tiempoActual - this.tiempoAnterior) / 1000;
        this.currentDur += segundosTranscurridos;

        this.shot.translateOnAxis(this.dirShot, segundosTranscurridos * this.speed);

        if (this.currentDur >= this.duration) this.finished = true;

        this.tiempoAnterior = tiempoActual;
    }

    // Getter de si el disparo ha llegado a su destino
    getFinished() {
        return this.finished;
    }

    // Setter de finalizado
    setFinished(boolean) {
        this.finished = boolean;
    }

    // Desactivación del disparo (haciéndolo invisible)
    hide() {
        this.shot.visible = false;
        this.shot.position.copy(this.defPos);
    }

    // Getter de la posición del disparo
    getPosition() {
        return this.shot.position;
    }

    // Getter del radio de disparo
    getRadius() {
        return this.radius;
    }

    // Getter del daño que produce el disparo
    getDamage() {
        return this.damage;
    }

    // Getter de la visibilidad del modelo
    getHidden() {
        return !this.shot.visible;
    }

}

export {Shot};