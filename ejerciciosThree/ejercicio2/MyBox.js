import * as THREE from '../libs/three.module.js'

class MyBox extends THREE.Object3D {

    constructor(gui, titleGui) {
        super();

        // Se crea la parte de la interfaz que corresponde a la caja. Se crea
        // primero porque otros métodos usan las variables que se definen para la
        // interfaz
        this.createGUI(gui, titleGui);

        // Un Mesh se compone de geometría y material. En este caso, como material
        // se crea uno a partir de un color
        var boxGeom = new THREE.BoxGeometry(1, 1, 1);
        var boxMat = new THREE.MeshNormalMaterial({flatShading: true});

        // Ya podemos construir el Mesh
        var box = new THREE.Mesh(boxGeom, boxMat);

        // Y añadirlo como hijo del Object3D (el this)
        this.add(box);
    }

    createGUI(gui, titleGui) {
        // Controles para el tamaño, la orientación y la posición de la caja
        this.guiControls = new function () {
            this.sizeX = 1.0;
            this.sizeY = 1.0;
            this.sizeZ = 1.0;

            // Un botón para dejarlo todo en su posición inicial. Cuando se pulse, se
            // ejecutará esta función
            this.reset = function () {
                this.sizeX = 1.0;
                this.sizeY = 1.0;
                this.sizeZ = 1.0;
            }
        }

        // Se crea una sección para los controles de la caja
        var folder = gui.addFolder(titleGui);

        // Estas líneas son las que añaden los componentes de la interfaz.
        // Las tres cifras indican un valor mínimo, un máximo y el incremento.
        // El método listen() permite que si se cambia el valor de la variable en
        // código, el deslizador de la interfaz se actualice.
        folder.add(this.guiControls, 'sizeX', 0.1, 5.0, 0.1).name("Tamaño X : ").listen();
        folder.add(this.guiControls, 'sizeY', 0.1, 5.0, 0.1).name("Tamaño Y : ").listen();
        folder.add(this.guiControls, 'sizeZ', 0.1, 5.0, 0.1).name("Tamaño Z : ").listen();

        folder.add(this.guiControls, 'reset').name('[ Reset ]');
    }

    update() {
        this.scale.set(this.guiControls.sizeX, this.guiControls.sizeY, this.guiControls.sizeZ);
    }

}

export {MyBox};
