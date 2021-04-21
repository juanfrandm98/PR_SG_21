import * as THREE from '../libs/three.module.js'
import {ThreeBSP} from '../libs/ThreeBSP.js';
import {BufferGeometry} from "../libs/three.module.js";

class MyTaza extends THREE.Object3D {

    constructor() {
        super();

        this.mat = new THREE.MeshNormalMaterial({flatShading: true});

        var externCylGeom = new THREE.CylinderGeometry(1, 1, 2.5, 20);
        var internCylGeom = new THREE.CylinderGeometry(0.9, 0.9, 2.5, 20);
        var torusGeom = new THREE.TorusGeometry(0.8, 0.1, 20, 20);

        torusGeom.translate(-1, 0, 0);
        internCylGeom.translate(0, 0.2, 0);

        var externCylBsp = new ThreeBSP(externCylGeom);
        var internCylBsp = new ThreeBSP(internCylGeom);
        var torusBsp = new ThreeBSP(torusGeom);

        var partialResult = externCylBsp.union(torusBsp);
        var finalResult = partialResult.subtract(internCylBsp);

        var geometry = finalResult.toGeometry();
        var finalGeometry = new BufferGeometry().fromGeometry(geometry);

        this.obj = new THREE.Mesh(finalGeometry, this.mat);
        this.add(this.obj);

    }

    update(animationSpeed) {
        this.obj.rotation.x += animationSpeed;
        this.obj.rotation.y += animationSpeed;
    }

}

export {MyTaza};
