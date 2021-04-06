import * as THREE from '../libs/three.module.js'
import {LatheGeometry} from "../libs/three.module.js";

class MyLine extends THREE.Object3D {

    constructor(points, gui, titleGui) {
        super();

        this.points = points;

        // Se crea la parte de la interfaz que corresponde a la caja. Se crea
        // primero porque otros métodos usan las variables que se definen para la
        // interfaz
        this.createGUI(gui, titleGui);

        // Un Mesh se compone de geometría y material. En este caso, como material
        // se crea uno a partir de un color
        //var geom = new THREE.BoxGeometry(1, 1, 1);
        var geom = new THREE.Geometry();
        geom.vertices = this.points;
        this.mat = new THREE.MeshNormalMaterial({flatShading: true});

        // Ya podemos construir el Mesh
        this.line = new THREE.Line(geom, this.mat);

        // Y añadirlo como hijo del Object3D (el this)
        this.add(this.line);

    }

    createGUI(gui, titleGui) {
        // Controles para el tamaño, la orientación y la posición de la caja
        this.guiControls = new function () {
            this.angle = 0;

            // Un botón para dejarlo todo en su posición inicial. Cuando se pulse, se
            // ejecutará esta función
            this.reset = function () {
                this.angle = 0;
            }
        }

        // Se crea una sección para los controles de la caja
        var folder = gui.addFolder(titleGui);

        // Estas líneas son las que añaden los componentes de la interfaz.
        // Las tres cifras indican un valor mínimo, un máximo y el incremento.
        // El método listen() permite que si se cambia el valor de la variable en
        // código, el deslizador de la interfaz se actualice.
        folder.add(this.guiControls, 'angle', 0.0, 2 * Math.PI, 0.1).name("Orientación : ").listen();

        folder.add(this.guiControls, 'reset').name('[ Reset ]');
    }

    update() {
        this.line.rotation.y = this.guiControls.angle;
    }

}

export {MyLine};
