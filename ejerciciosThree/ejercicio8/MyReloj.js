import * as THREE from '../libs/three.module.js'

class MyReloj extends THREE.Object3D {

    constructor(gui) {
        super();
        this.createGUI(gui);

        var materialVerde = new THREE.MeshPhongMaterial({color: new THREE.Color(0, 1, 0)});
        var materialRojo = new THREE.MeshPhongMaterial({color: new THREE.Color(1, 0, 0)});

        var sphereGeom = new THREE.SphereGeometry(1, 10, 10);

        this.radioAguja = 8;
        this.radioReloj = 12;
        this.anguloPorPunto = 2 * Math.PI / 12;

        this.reloj = new THREE.Object3D();

        this.aguja = new THREE.Mesh(sphereGeom, materialRojo);
        this.aguja.position.set(0, 0, -this.radioAguja);

        this.nodoAguja = new THREE.Object3D();
        this.nodoAguja.add(this.aguja);
        this.reloj.add(this.nodoAguja);

        this.createMarcas(sphereGeom, materialVerde);

        this.add(this.reloj);

        this.tiempoAnterior = Date.now();

    }

    createGUI(gui) {
        this.guiControls = new function () {
            this.speed = 0;

            this.stop = function () {
                this.speed = 0;
            }
        }

        var folder = gui.addFolder('Controles del Reloj');
        folder.add(this.guiControls, 'speed', -12, 12, 1).name("Marcas/segundo : ").listen();
        folder.add(this.guiControls, 'stop').name('[ Stop ]');
    }

    createMarcas(geom, mat) {
        var anguloAcumulado = 0;
        var anguloPorMarca = 2 * Math.PI / 12;

        for (var i = 0; i < 12; i++) {
            var marca = new THREE.Mesh(geom, mat);
            marca.position.set(this.radioReloj * Math.sin(anguloAcumulado), 0, this.radioReloj * Math.cos(anguloAcumulado));
            this.reloj.add(marca);
            anguloAcumulado += anguloPorMarca;
        }
    }

    update() {
        if (this.guiControls.speed != 0) {
            var tiempoActual = Date.now();
            var segundosTranscurridos = (tiempoActual - this.tiempoAnterior) / 1000;
            var anguloARecorrer = - this.anguloPorPunto * this.guiControls.speed * segundosTranscurridos;
            this.nodoAguja.rotateY(anguloARecorrer);
            this.tiempoAnterior = tiempoActual;
        } else {
            this.tiempoAnterior = Date.now();
        }
    }

}

export {MyReloj};
