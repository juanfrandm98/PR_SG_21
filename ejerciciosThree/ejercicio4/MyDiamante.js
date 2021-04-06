import * as THREE from '../libs/three.module.js'

class MyDiamante extends THREE.Object3D {

    constructor() {
        super();

        var shape = new THREE.Shape();
        shape.moveTo(0, 2);
        shape.lineTo(1, 0);
        shape.lineTo(0, -2);
        shape.lineTo(-1, 0);
        shape.lineTo(0, 2);

        var options = {
            depth: 0.5,
            steps: 1,
            curveSegments: 15,
            bevelThickness: 0.5,
            bevelSize: 1,
            bevelSegments: 5
        };

        // Un Mesh se compone de geometría y material. En este caso, como material
        // se crea uno a partir de un color
        //var geom = new THREE.BoxGeometry(1, 1, 1);
        var geom = new THREE.ExtrudeBufferGeometry(shape, options);
        this.mat = new THREE.MeshPhongMaterial({color: new THREE.Color(255, 0, 0)});

        // Ya podemos construir el Mesh
        this.obj = new THREE.Mesh(geom, this.mat);

        // Y añadirlo como hijo del Object3D (el this)
        this.add(this.obj);

    }

    update() {}

}

export {MyDiamante};
