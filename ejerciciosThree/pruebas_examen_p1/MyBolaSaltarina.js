import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'

class MyBolaSaltarina extends THREE.Object3D {

    constructor(gui) {
        super();
        this.createGUI(gui);

        this.minAlturaBola = 1;
        this.maxAlturaBola = 20;

        var cylGeom = new THREE.CylinderGeometry(15, 15, 20, 20);
        this.cylMat = new THREE.MeshPhongMaterial({
            opacity: 0.2,
            transparent: true,
            color: new THREE.Color(0, 0, 1)
        });

        var sphGeom = new THREE.SphereGeometry(1);
        var sphMat = new THREE.MeshPhongMaterial({color: new THREE.Color(1,0,0)});

        this.cyl = new THREE.Mesh(cylGeom, this.cylMat);
        this.cyl.position.y += 10;
        this.add(this.cyl);

        this.sphere = new THREE.Mesh(sphGeom, sphMat);
        this.sphere.position.x = 15;
        this.sphere.position.y = this.minAlturaBola;

        this.bolaSaltarina = new THREE.Object3D();
        this.bolaSaltarina.add(this.sphere);
        this.add(this.bolaSaltarina);

        var iniV = {p: this.minAlturaBola};
        var finV = {p: this.maxAlturaBola};

        var iniH = {p: 0};
        var finH = {p: 2 * Math.PI};

        var that = this;

        var movVertical = new TWEEN.Tween(iniV)
            .to(finV, 1000)
            .yoyo(true)
            .repeat(Infinity)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(function(){
                that.sphere.position.y = iniV.p;
            })
            .onComplete(function(){
                iniV.p = 0;
            });

        var movHorizontal = new TWEEN.Tween(iniH)
            .to(finH, 4000)
            .repeat(Infinity)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(function() {
                that.bolaSaltarina.rotation.y = iniH.p;
            })
            .onComplete(function() {
                iniH.p = 0;
            });

        movVertical.start();
        movHorizontal.start();

    }

    createGUI(gui) {
        this.guiControls = new function () {
            this.radius = 15;

            this.reset = function () {
                this.radius = 15;
            }
        }

        var folder = gui.addFolder('Controles de la Bola Saltarina');
        folder.add(this.guiControls, 'radius', 5, 30, 1).name("Radio : ").listen();
        folder.add(this.guiControls, 'reset').name('[ Reset ]');
    }

    update() {
        var cylGeom = new THREE.CylinderGeometry(this.guiControls.radius, this.guiControls.radius, 20, 20);
        this.cyl.geometry = cylGeom;
        this.sphere.position.x = this.guiControls.radius;

        TWEEN.update();
    }

}

export {MyBolaSaltarina};
