import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'
import {ThreeBSP} from "../libs/ThreeBSP.js";
import {BufferGeometry} from "../libs/three.module.js";

class MyComecocos extends THREE.Object3D {

    constructor() {
        super();

        var alturaRuta = 1.1;

        var materialAmarillo = new THREE.MeshPhongMaterial({color: new THREE.Color(1, 1, 0)});

        var sphere = new THREE.SphereGeometry(1, 20, 20);
        var box = new THREE.BoxGeometry(2,2,2);
        var cyl = new THREE.CylinderGeometry(0.15, 0.15, 2, 10, 10);

        var cabezaSuperiorBsp = new ThreeBSP(sphere);
        var cabezaInferiorBsp = new ThreeBSP(sphere);

        box.translate(0, -1, 0);
        var restarSuperiorBsp = new ThreeBSP(box);

        cyl.rotateX(Math.PI / 2);
        cyl.translate(0.5, 0.5, 0);
        var cylBSP = new ThreeBSP(cyl);

        var partialResultSup = cabezaSuperiorBsp.subtract(restarSuperiorBsp);
        var finalResultSup = partialResultSup.subtract(cylBSP);

        var geometrySup = finalResultSup.toGeometry();
        var finalGeometrySup = new BufferGeometry().fromGeometry(geometrySup);

        this.parteSup = new THREE.Mesh(finalGeometrySup, materialAmarillo);

        box.translate(0, 2, 0);
        var restarInferiorBsp = new ThreeBSP(box);

        var finalResultInf = cabezaInferiorBsp.subtract(restarInferiorBsp);
        var geometryInf = finalResultInf.toGeometry();
        var finalGeometryInf = new BufferGeometry().fromGeometry(geometryInf);

        this.parteInf = new THREE.Mesh(finalGeometryInf, materialAmarillo);

        this.modelo = new THREE.Object3D();
        this.modelo.add(this.parteSup);
        this.modelo.add(this.parteInf);
        this.modelo.rotateY(-Math.PI / 2);

        this.modeloAnimado = new THREE.Object3D();
        this.modeloAnimado.add(this.modelo);

        this.add(this.modeloAnimado);

        var iniBoca = {p: -Math.PI/4};
        var finBoca = {p: 0};

        var that = this;

        var animacionBoca = new TWEEN.Tween(iniBoca)
            .to(finBoca, 400)
            .yoyo(true)
            .repeat(Infinity)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(function(){
                that.parteInf.rotation.z = iniBoca.p;
            })
            .onComplete(function(){
                iniBoca.p = 0;
            });

        animacionBoca.start();

        var pathSuperior = new THREE.Shape();
        pathSuperior.moveTo(-2, 0);
        pathSuperior.lineTo(-2, 0);
        pathSuperior.lineTo(-2,-5);
        pathSuperior.lineTo(2, -5);
        pathSuperior.quadraticCurveTo(7, -5, 7, -3);
        pathSuperior.quadraticCurveTo(7, -1, 2, -1);
        pathSuperior.lineTo(2, 0);

        var pathInferior = [
            new THREE.Vector3(2, alturaRuta, 0),
            new THREE.Vector3(2, alturaRuta, 5),
            new THREE.Vector3(-2, alturaRuta, 5),
            new THREE.Vector3(-2, alturaRuta, 0),
        ]

        var materialLine = new THREE.LineBasicMaterial({color: new THREE.Color(1, 0, 0)});

        var points = pathSuperior.getPoints(50);
        var points3D =[];

        points.forEach(e => {
            points3D.push(new THREE.Vector3(e.x, alturaRuta, e.y));
        });

        var geomCurvaSup = new THREE.Geometry();
        this.splineSup = new THREE.CatmullRomCurve3(points3D);
        geomCurvaSup.vertices = this.splineSup.getPoints(100);
        var lineaSupVisible = new THREE.Line(geomCurvaSup, materialLine);

        var geomCurvaInf = new THREE.Geometry();
        this.splineInf = new THREE.CatmullRomCurve3(pathInferior);
        geomCurvaInf.vertices = this.splineInf.getPoints(10);
        var lineaInfVisible = new THREE.Line(geomCurvaInf, materialLine);

        this.add(lineaSupVisible);
        this.add(lineaInfVisible);

        var iniSup = {p: 0};
        var finSup = {p: 1};

        var iniInf = {p: 0};
        var finInf = {p: 1};

        var animacionSup = new TWEEN.Tween(iniSup)
            .to(finSup, 6000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(function(){
                var t = iniSup.p;
                var posicion = that.splineSup.getPointAt(t);
                that.modeloAnimado.position.copy(posicion);
                var orientacion = that.splineSup.getTangentAt(t);
                posicion.add(orientacion);
                that.modeloAnimado.lookAt(posicion);
            })
            .onComplete(function(){
                iniSup.p = 0;
            });

        var animacionInf = new TWEEN.Tween(iniInf)
            .to(finInf, 4000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(function(){
                var t = iniInf.p;
                var posicion = that.splineInf.getPointAt(t);
                that.modeloAnimado.position.copy(posicion);
                var orientacion = that.splineInf.getTangentAt(t);
                posicion.add(orientacion);
                that.modeloAnimado.lookAt(posicion);
            })
            .onComplete(function(){
                iniInf.p = 0;
            });

        animacionSup.chain(animacionInf);
        animacionInf.chain(animacionSup);
        animacionSup.start();

    }

    update() {
        TWEEN.update();
    }

}

export {MyComecocos};
