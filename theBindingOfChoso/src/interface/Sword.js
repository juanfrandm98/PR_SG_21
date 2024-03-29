import * as THREE from '../../libs/three.module.js'

class Sword extends THREE.Object3D {

    constructor(mat) {
        super();

        // Creación de la forma de espada
        var shape = new THREE.Shape();
        shape.moveTo(-0.5, -0.45);
        shape.lineTo(-0.5, -0.45);
        shape.lineTo(-0.3, -0.25);
        shape.lineTo(-0.425, -0.125);
        shape.lineTo(-0.375, -0.075);
        shape.lineTo(-0.25, -0.2);
        shape.lineTo(0.45, 0.5);
        shape.lineTo(0.5, 0.5);
        shape.lineTo(0.5, 0.45);
        shape.lineTo(-0.2, -0.25);
        shape.lineTo(-0.075, -0.375);
        shape.lineTo(-0.125, -0.425);
        shape.lineTo(-0.25, -0.3);
        shape.lineTo(-0.45, -0.5);
        shape.lineTo(-0.5, -0.45);

        var options = {
            depth: 0.2,
            steps: 1,
            curveSegments: 55,
            bevelEnabled: false,
        };

        // Geometría
        var geom = new THREE.ExtrudeBufferGeometry(shape, options);

        // Composición del icono
        this.obj = new THREE.Mesh(geom, mat);
        this.add(this.obj);
    }

    update() {
    };

}

export {Sword};
