import * as THREE from '../../libs/three.module.js'

class Heart extends THREE.Object3D {

    constructor(color) {
        super();

        // Creación del modelo del corazón
        var shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(0, 0);
        shape.quadraticCurveTo(0, -0.5, 0.25, -0.5);
        shape.quadraticCurveTo(0.5, -0.5, 0.5, 0);
        shape.lineTo(0, 0.5);
        shape.lineTo(-0.5, 0);
        shape.quadraticCurveTo(-0.5, -0.5, -0.25, -0.5);
        shape.quadraticCurveTo(0, -0.5, 0, 0);

        var options = {
            depth: 0.2,
            steps: 1,
            curveSegments: 55,
            bevelThickness: 0.1,
            bevelSize: 0.1,
            bevelSegments: 3
        };

        // Geometría y material
        var geom = new THREE.ExtrudeBufferGeometry(shape, options);
        this.mat = new THREE.MeshPhongMaterial({color: color});

        // Mesh
        this.obj = new THREE.Mesh(geom, this.mat);
        this.add(this.obj);

    }

    update() {
    }

}

export {Heart};
