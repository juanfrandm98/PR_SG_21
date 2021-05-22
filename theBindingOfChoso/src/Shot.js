import * as THREE from '../libs/three.module.js'

class Shot extends THREE.Object3D {

    constructor(speed, radius, range) {
        super();

        this.defPos = new THREE.Vector3(0, 5, 0);
        this.radius = radius;
        this.damage = 1;
        this.finished = true;
        this.speed = speed;
        this.range = range;

        var sphGeom = new THREE.SphereGeometry(this.radius, 10, 10);
        var sphMat = new THREE.MeshPhongMaterial({color: new THREE.Color(1, 1, 1)});

        this.shot = new THREE.Mesh(sphGeom, sphMat);
        this.shot.position.copy(this.defPos);
        this.shot.visible = false;
        this.add(this.shot);
    }

    resetShoot(damage, shotRadius, origin, dirShot, range) {
        this.damage = damage;
        this.range = range;

        if(shotRadius !== this.radius) {
            this.radius = shotRadius;
            this.shot.geometry = new THREE.SphereGeometry(this.radius, 10, 10);
        }

        this.dirShot = new THREE.Vector3(dirShot.x, 0, dirShot.y);
        this.destiny = this.calculateDestiny(origin, this.dirShot, this.range);
        this.finished = false;
        this.shot.visible = true;

        this.shot.position.copy(origin);

        this.duration = this.calculateDuration(origin, this.destiny, this.speed);
        this.currentDur = 0;
        this.tiempoAnterior = Date.now();
    }

    calculateDuration(origin, destiny, speed) {
        var distance = (destiny.x - origin.x) * (destiny.x - origin.x);
        distance = distance + (destiny.z - origin.z) * (destiny.z - origin.z);
        distance = Math.sqrt(distance);

        return(distance / speed);
    }

    calculateDestiny(origin, dirShot, range) {
        var x = origin.x + dirShot.x * range;
        var y = origin.y + dirShot.y * range;
        var z = origin.z + dirShot.z * range;

        return new THREE.Vector3(x, y, z);
    }

    update() {
        var tiempoActual = Date.now();
        var segundosTranscurridos = (tiempoActual - this.tiempoAnterior) / 1000;
        this.currentDur += segundosTranscurridos;

        this.shot.translateOnAxis(this.dirShot, segundosTranscurridos * this.speed);

        if(this.currentDur >= this.duration) this.finished = true;

        this.tiempoAnterior = tiempoActual;
    }

    getFinished() {
        return this.finished;
    }

    setFinished(boolean) {
        this.finished = boolean;
    }

    hide() {
        this.shot.visible = false;
        this.shot.position.copy(this.defPos);
    }

    getPosition() {
        return this.shot.position;
    }

    getRadius() {
        return this.radius;
    }

    getDamage() {
        return this.damage;
    }

    getHidden() {
        return !this.shot.visible;
    }

}

export {Shot};