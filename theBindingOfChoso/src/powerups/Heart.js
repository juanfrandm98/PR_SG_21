import * as THREE from '../../libs/three.module.js'

class Heart extends THREE.Object3D {

    constructor(color) {
        super();

        var shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(0, 0);
        shape.quadraticCurveTo(0, -0.5, 0.25, -0.5);
        shape.quadraticCurveTo(0.5, -0.5, 0.5, 0);
        shape.lineTo(0,0.5);
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

        // Un Mesh se compone de geometría y material. En este caso, como material
        // se crea uno a partir de un color
        //var geom = new THREE.BoxGeometry(1, 1, 1);
        var geom = new THREE.ExtrudeBufferGeometry(shape, options);
        this.mat = new THREE.MeshPhongMaterial({color: color});

        // Ya podemos construir el Mesh
        this.obj = new THREE.Mesh(geom, this.mat);

        // Y añadirlo como hijo del Object3D (el this)
        this.add(this.obj);

    }

    update() {}

}

export {Heart};
