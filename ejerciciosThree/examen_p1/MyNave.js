import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'

class MyNave extends THREE.Object3D {

    constructor() {
        super();

        var materialNave = new THREE.MeshNormalMaterial({flatShading: true});
        var materialRojo = new THREE.LineBasicMaterial({color: new THREE.Color(1, 0, 0)});

        var geometriaNave = new THREE.ConeGeometry(1, 5);
        var geometriaSplineIzq = new THREE.Geometry();
        var geometriaSplineDer = new THREE.Geometry();

        this.cono = new THREE.Mesh(geometriaNave, materialNave);
        this.cono.rotation.x = Math.PI / 2;

        this.nave = new THREE.Object3D();
        this.nave.add(this.cono);
        this.add(this.nave);

        this.splineIzquierda = new THREE.CatmullRomCurve3(this.createPath(true));
        this.splineDerecha = new THREE.CatmullRomCurve3(this.createPath(false));

        geometriaSplineIzq.vertices = this.splineIzquierda.getPoints(50);
        this.visibleSplineIzq = new THREE.Line(geometriaSplineIzq, materialRojo);
        this.add(this.visibleSplineIzq);

        geometriaSplineDer.vertices = this.splineDerecha.getPoints(50);
        this.visibleSplineDer = new THREE.Line(geometriaSplineDer, materialRojo);
        this.add(this.visibleSplineDer);

        var origen = {p: 0};
        var destino = {p: 1};
        var that = this;

        var movDer = new TWEEN.Tween(origen)
            .to(destino, 4000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(function () {
                var t = origen.p;
                var posicion = that.splineDerecha.getPointAt(t);
                that.nave.position.copy(posicion);
                var orientacion = that.splineDerecha.getTangentAt(t);
                posicion.add(orientacion);
                that.nave.lookAt(posicion);
            })
            .onComplete(function () {
                origen.p = 0;
            });

        var movIzq = new TWEEN.Tween(origen)
            .to(destino, 8000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(function(){
                var posicion = that.splineIzquierda.getPointAt(origen.p);
                that.nave.position.copy(posicion);
                var orientacion = that.splineIzquierda.getTangentAt(origen.p);
                posicion.add(orientacion);
                that.nave.lookAt(posicion);
            })
            .onComplete(function(){
                origen.p = 0;
            });


        movDer.chain(movIzq);
        movIzq.chain(movDer);
        movDer.start();

    }

    createPath(izquierda) {
        var path = [];

        if (izquierda) {
            path.push(new THREE.Vector3(0, 0, 0));
            path.push(new THREE.Vector3(-5, 0, -5));
            path.push(new THREE.Vector3(-10, 0, 0));
            path.push(new THREE.Vector3(-5, 0, 5));
            path.push(new THREE.Vector3(0, 0, 0));
        } else {
            path.push(new THREE.Vector3(0, 0, 0));
            path.push(new THREE.Vector3(5, 0, -5));
            path.push(new THREE.Vector3(10, 0, 0));
            path.push(new THREE.Vector3(5, 0, 5));
            path.push(new THREE.Vector3(0, 0, 0));
        }

        return path;
    }

    update() {
        TWEEN.update();
    }

}

export {MyNave};
