import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'

class Shot extends THREE.Object3D {

    constructor(speed, radius) {
        super();

        this.defPos = new THREE.Vector3(0, 5, 0);
        this.radius = radius;
        this.damage = 1;
        this.finished = true;
        this.speed = speed;

        var sphGeom = new THREE.SphereGeometry(this.radius, 10, 10);
        var sphMat = new THREE.MeshPhongMaterial({color: new THREE.Color(1, 1, 1)});

        this.shot = new THREE.Mesh(sphGeom, sphMat);
        this.shot.position.copy(this.defPos);
        this.shot.visible = false;
        this.add(this.shot);
    }

    resetShoot(origin, destiny) {
        this.route = this.createRoute(origin, destiny);
        this.finished = false;
        this.shot.visible = true;

        this.shot.position.copy(origin);

        var origen = {p: 0};
        var destino = {p: 1};
        var that = this;
        var duration = this.calculateDuration(origin, destiny, this.speed);

        this.mov = new TWEEN.Tween(origen)
            .to(destino, duration)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(function () {
                var t = origen.p;
                var posicion = that.route.getPointAt(t);
                that.shot.position.copy(posicion);
            })
            .onComplete(function () {
                origen = 0;
                that.finished = true;
            });

        this.mov.start();
    }

    createRoute(origin, destiny) {
        var path = [origin, destiny];
        return new THREE.CatmullRomCurve3(path);
    }

    calculateDuration(origin, destiny, speed) {
        var timePerUnit = 100;
        var distance = (destiny.x - origin.x) * (destiny.x - origin.x);
        distance = distance + (destiny.z - origin.z) * (destiny.z - origin.z);
        distance = Math.sqrt(distance);

        var time = distance * timePerUnit;
        return (time / speed);
    }

    update() {
        TWEEN.update();
    }

    getFinished() {
        return this.finished;
    }

    setFinished(boolean) {
        this.finished = boolean;
    }

    hide() {
        this.mov.stop();
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