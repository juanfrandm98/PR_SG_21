import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'

class MyNave extends THREE.Object3D {

    constructor() {
        super();

        var materialNave = new THREE.MeshNormalMaterial({flatShading: true});
        var materialRojo = new THREE.LineBasicMaterial({color: new THREE.Color(1, 0, 0)});

        var geometriaNave = new THREE.ConeGeometry(1, 5);
        var geometriaSpline = new THREE.Geometry();

        this.nave = new THREE.Mesh(geometriaNave, materialNave);
        this.nave.rotation.x = Math.PI / 2;
        this.add(this.nave);

        this.splineIzquierda = new THREE.CatmullRomCurve3(this.createPath(true));
        this.splineDerecha = new THREE.CatmullRomCurve3(this.createPath(false));

        geometriaSpline.vertices = this.splineIzquierda;
        var visibleSplineIzq = new THREE.Line(geometriaSpline, materialRojo);
        this.add(visibleSplineIzq);

        geometriaSpline.vertices = this.splineDerecha;
        var visibleSplineDer = new THREE.Line(geometriaSpline, materialRojo);
        this.add(visibleSplineDer);

        var origen = {p: 0};
        var destino = {p: 1};
        var that = this;

        var movIzq = new TWEEN.Tween(origen)
            .to(destino, 8000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(function () {
                var t = origen.p;
                var posicion = that.splineIzquierda.getPointAt(t);
                that.nave.position.set(posicion);
                var tangente = that.splineIzquierda.getTangentAt(t);
                posicion.add(tangente);
                that.nave.lookAt(posicion);
            }).onComplete(function () {
                origen.p = 0;
            });

        var movDer = new TWEEN.Tween(origen, origen)
            .to(destino, 4000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(function () {
                var t = origen.p;
                var posicion = that.splineDerecha.getPointAt(t);
                that.nave.position.set(posicion);
            }).onComplete(function () {
                origen.p = 0;
            });

        movDer.start();
        movDer.chain(movIzq);
        movIzq.chain(movDer);

    }

    createPath(izquierda) {
        var path = [];

        if (izquierda) {
            path.push(new THREE.Vector3(0, 0, 0));
            path.push(new THREE.Vector3(-5, 0, 5));
            path.push(new THREE.Vector3(-10, 0, 0));
            path.push(new THREE.Vector3(-5, 0, -5));
            path.push(new THREE.Vector3(0, 0, 0));
        } else {
            path.push(new THREE.Vector3(0, 0, 0));
            path.push(new THREE.Vector3(5, 0, -5));
            path.push(new THREE.Vector3(10, 0, 0));
            path.push(new THREE.Vector3(5, 0, +5));
            path.push(new THREE.Vector3(0, 0, 0));
        }

        return path;
    }

    update() {
        TWEEN.update();
    }

}

export {MyNave};
