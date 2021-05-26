import * as THREE from '../../libs/three.module.js'

class ShotIcon extends THREE.Object3D {

    constructor(mat) {
        super();

        // Un Mesh se compone de geometría y material. En este caso, como material
        // se crea uno a partir de un color
        //var geom = new THREE.BoxGeometry(1, 1, 1);
        var bigGeom = new THREE.CylinderGeometry(0.25, 0.25, 0.2);
        var smallGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.2);

        // Ya podemos construir el Mesh
        var smallCyl = new THREE.Mesh(smallGeom, mat);
        smallCyl.rotateX(Math.PI / 2);
        smallCyl.position.set(-0.3, -0.3, 0);
        var bigCyl = new THREE.Mesh(bigGeom, mat);
        bigCyl.rotateX(Math.PI / 2);
        bigCyl.position.set(0.25, 0.25, 0);

        this.node = new THREE.Object3D();
        this.node.add(smallCyl);
        this.node.add(bigCyl);
        this.add(this.node);

    }

    update(){};

}

export {ShotIcon};
