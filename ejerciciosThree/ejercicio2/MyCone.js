import * as THREE from '../libs/three.module.js'

class MyCone extends THREE.Object3D {

    constructor(gui, titleGui) {
        super();

        // Se crea la parte de la interfaz que corresponde a la caja. Se crea
        // primero porque otros métodos usan las variables que se definen para la
        // interfaz
        this.createGUI(gui, titleGui);

        // Un Mesh se compone de geometría y material. En este caso, como material
        // se crea uno a partir de un color
        var coneGeom = new THREE.ConeGeometry(1.0, 2.0, 8);
        var coneMat = new THREE.MeshNormalMaterial({flatShading: true});

        // Ya podemos construir el Mesh
        this.cone = new THREE.Mesh(coneGeom, coneMat);

        // Y añadirlo como hijo del Object3D (el this)
        this.add(this.cone);
    }

    createGUI(gui, titleGui) {
        // Controles para el tamaño, la orientación y la posición de la caja
        this.guiControls = new function () {
            this.radius = 1.0;
            this.height = 2.0;
            this.resolution = 8;

            // Un botón para dejarlo todo en su posición inicial. Cuando se pulse, se
            // ejecutará esta función
            this.reset = function () {
                this.radius = 1.0;
                this.height = 2.0;
                this.resolution = 8;
            }
        }

        // Se crea una sección para los controles de la caja
        var folder = gui.addFolder(titleGui);

        // Estas líneas son las que añaden los componentes de la interfaz.
        // Las tres cifras indican un valor mínimo, un máximo y el incremento.
        // El método listen() permite que si se cambia el valor de la variable en
        // código, el deslizador de la interfaz se actualice.
        folder.add(this.guiControls, 'radius', 0.1, 5.0, 0.1).name("Radio : ").listen();
        folder.add(this.guiControls, 'height', 0.1, 5.0, 0.1).name("Altura : ").listen();
        folder.add(this.guiControls, 'resolution', 3, 20, 1).name("Resolución : ").listen();

        folder.add(this.guiControls, 'reset').name('[ Reset ]');
    }

    update() {
        //this.scale.set(this.guiControls.radius, this.guiControls.height, this.guiControls.radius);
        this.cone.geometry = new THREE.ConeGeometry(this.guiControls.radius, this.guiControls.height, this.guiControls.resolution);
    }

}

export {MyCone};
