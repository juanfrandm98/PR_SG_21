import * as THREE from '../libs/three.module.js'

class MyTorus extends THREE.Object3D {

    constructor(gui, titleGui) {
        super();

        // Se crea la parte de la interfaz que corresponde a la caja. Se crea
        // primero porque otros métodos usan las variables que se definen para la
        // interfaz
        this.createGUI(gui, titleGui);

        // Un Mesh se compone de geometría y material. En este caso, como material
        // se crea uno a partir de un color
        var torGeom = new THREE.TorusGeometry(3, 1, 8, 8);
        var torMat = new THREE.MeshNormalMaterial({flatShading: true});

        // Ya podemos construir el Mesh
        this.torus = new THREE.Mesh(torGeom, torMat);

        // Y añadirlo como hijo del Object3D (el this)
        this.add(this.torus);
    }

    createGUI(gui, titleGui) {
        // Controles para el tamaño, la orientación y la posición de la caja
        this.guiControls = new function () {
            this.torusRadius = 3.0;
            this.tubeRadius = 1.0;
            this.torusResolution = 8;
            this.tubeResolution = 8;

            // Un botón para dejarlo todo en su posición inicial. Cuando se pulse, se
            // ejecutará esta función
            this.reset = function () {
                this.torusRadius = 3.0;
                this.tubeRadius = 1.0;
                this.torusResolution = 8;
                this.tubeResolution = 8;
            }
        }

        // Se crea una sección para los controles de la caja
        var folder = gui.addFolder(titleGui);

        // Estas líneas son las que añaden los componentes de la interfaz.
        // Las tres cifras indican un valor mínimo, un máximo y el incremento.
        // El método listen() permite que si se cambia el valor de la variable en
        // código, el deslizador de la interfaz se actualice.
        folder.add(this.guiControls, 'torusRadius', 0.1, 5.0, 0.1).name("Radio Toro : ").listen();
        folder.add(this.guiControls, 'tubeRadius', 0.1, 5.0, 0.1).name("Radio Tubo : ").listen();
        folder.add(this.guiControls, 'torusResolution', 3, 20, 1).name("Res. Toro : ").listen();
        folder.add(this.guiControls, 'tubeResolution', 3, 20, 1).name("Res. Tubo : ").listen();

        folder.add(this.guiControls, 'reset').name('[ Reset ]');
    }

    update() {
        this.torus.geometry = new THREE.TorusGeometry(this.guiControls.torusRadius, this.guiControls.tubeRadius, this.guiControls.torusResolution, this.guiControls.tubeResolution);
    }

}

export {MyTorus};
