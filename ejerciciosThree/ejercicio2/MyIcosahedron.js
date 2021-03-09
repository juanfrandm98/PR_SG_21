import * as THREE from '../libs/three.module.js'

class MyIcosahedron extends THREE.Object3D {

    constructor(gui, titleGui) {
        super();

        // Se crea la parte de la interfaz que corresponde a la caja. Se crea
        // primero porque otros métodos usan las variables que se definen para la
        // interfaz
        this.createGUI(gui, titleGui);

        // Un Mesh se compone de geometría y material. En este caso, como material
        // se crea uno a partir de un color
        var icoGeom = new THREE.IcosahedronGeometry(1, 0);
        var icoMat = new THREE.MeshNormalMaterial({flatShading: true});

        // Ya podemos construir el Mesh
        this.icosahedron = new THREE.Mesh(icoGeom, icoMat);

        // Y añadirlo como hijo del Object3D (el this)
        this.add(this.icosahedron);
    }

    createGUI(gui, titleGui) {
        // Controles para el tamaño, la orientación y la posición de la caja
        this.guiControls = new function () {
            this.radius = 1.0;
            this.detail = 0;

            // Un botón para dejarlo todo en su posición inicial. Cuando se pulse, se
            // ejecutará esta función
            this.reset = function () {
                this.radius = 1.0;
                this.detail = 0;
            }
        }

        // Se crea una sección para los controles de la caja
        var folder = gui.addFolder(titleGui);

        // Estas líneas son las que añaden los componentes de la interfaz.
        // Las tres cifras indican un valor mínimo, un máximo y el incremento.
        // El método listen() permite que si se cambia el valor de la variable en
        // código, el deslizador de la interfaz se actualice.
        folder.add(this.guiControls, 'radius', 0.1, 5.0, 0.1).name("Radio : ").listen();
        folder.add(this.guiControls, 'detail', 0, 2, 1).name("Subdivisión : ").listen();

        folder.add(this.guiControls, 'reset').name('[ Reset ]');
    }

    update() {
        this.icosahedron.geometry = new THREE.IcosahedronGeometry(this.guiControls.radius, this.guiControls.detail);
    }

}

export {MyIcosahedron};
