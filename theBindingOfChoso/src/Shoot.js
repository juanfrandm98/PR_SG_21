import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'

class Shoot extends THREE.Object3D {

    constructor(origin, destiny, speed) {
        super();

        var sphGeom = new THREE.SphereGeometry(0.25, 10, 10);
        var sphMat = new THREE.MeshPhongMaterial({color: new THREE.Color(1, 1, 1)});

        this.shoot = new THREE.Mesh(sphGeom, sphMat);
        this.shoot.position.copy(origin);
        this.add(this.shoot);

        this.route = this.createRoute(origin, destiny);
        this.finished = false;

        var origen = {p: 0};
        var destino = {p: 1};
        var that = this;
        var duration = this.calculateDuration(origin, destiny, speed);

        var mov = new TWEEN.Tween(origen)
            .to(destino, duration)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(function () {
                var t = origen.p;
                var posicion = that.route.getPointAt(t);
                that.shoot.position.copy(posicion);
            })
            .onComplete(function () {
                origen = 0;
                that.finished = true;
            });

        mov.start();
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
        return(time / speed);
    }

    update() {
        TWEEN.update();

        if(this.finished) {
            this.shoot.geometry.dispose();
        }
    }

    getFinished() {
        return this.finished;
    }

    delete() {
        this.shoot.geometry.dispose();
    }

}

export {Shoot};