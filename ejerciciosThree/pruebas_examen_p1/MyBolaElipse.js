import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'

class MyBolaElipse extends THREE.Object3D {

    constructor(gui) {
        super();
        this.createGUI(gui);

        this.originalRadius = 1;

        var cylGeom = new THREE.CylinderGeometry(this.originalRadius, this.originalRadius, 2, 20);
        this.cylMat = new THREE.MeshPhongMaterial({
            opacity: 0.2,
            transparent: true,
            color: new THREE.Color(0, 0, 1)
        });

        var sphGeom = new THREE.SphereGeometry(0.5);
        var sphMat = new THREE.MeshNormalMaterial({flatShading: true});

        this.cyl = new THREE.Mesh(cylGeom, this.cylMat);
        this.cyl.position.y = 1;
        this.add(this.cyl);

        this.sphere = new THREE.Mesh(sphGeom, sphMat);
        this.sphere.position.y = 1.25;

        this.bolaElipse = new THREE.Object3D();
        this.bolaElipse.add(this.sphere);
        this.add(this.bolaElipse);

        var curve = new THREE.EllipseCurve(0, 0, this.guiControls.extension, 1, 0, 2 * Math.PI, true, 0);

        var points = curve.getPoints(50);
        var points3D =[];

        points.forEach(e => {
           points3D.push(new THREE.Vector3(e.x, 0.5, e.y));
        });

        this.recorrido = new THREE.CatmullRomCurve3(points3D);

        var iniH = {p: 0};
        var finH = {p: 1};

        var that = this;

        var movHorizontal = new TWEEN.Tween(iniH)
            .to(finH, 3000)
            .repeat(Infinity)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(function () {
                var t = iniH.p;
                var posicion = that.recorrido.getPoint(t);
                that.bolaElipse.position.copy(posicion);
            })
            .onComplete(function () {
                iniH.p = 0;
            });

        movHorizontal.start();

    }

    createGUI(gui) {
        this.guiControls = new function () {
            this.extension = 1;

            this.reset = function () {
                this.extension = 1;
            }
        }

        var folder = gui.addFolder('Controles de la Bola Elipse');
        folder.add(this.guiControls, 'extension', 1, 15, 1).name("Extensión : ").listen();
        folder.add(this.guiControls, 'reset').name('[ Reset ]');
    }

    update() {
        this.cyl.scale.x = this.guiControls.extension;
        var curve = new THREE.EllipseCurve(0, 0, this.guiControls.extension, 1, 0, 2 * Math.PI, true, 0);

        var points = curve.getPoints(50);
        var points3D =[];

        points.forEach(e => {
            points3D.push(new THREE.Vector3(e.x, 0.5, e.y));
        });

        this.recorrido = new THREE.CatmullRomCurve3(points3D);

        TWEEN.update();
    }

}

export {MyBolaElipse};
