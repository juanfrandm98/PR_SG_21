import * as THREE from '../libs/three.module.js'
import {ThreeBSP} from "../libs/ThreeBSP.js";

class RangeIcon extends THREE.Object3D {

    constructor() {
        super();

        // Un Mesh se compone de geometría y material. En este caso, como material
        // se crea uno a partir de un color
        //var geom = new THREE.BoxGeometry(1, 1, 1);
        var externGeom = new THREE.CylinderGeometry(0.45, 0.45, 0.2);
        var minusGeom = new THREE.CylinderGeometry(0.35, 0.35, 0.2);
        var internGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.2);

        var mat = new THREE.MeshPhongMaterial({color: new THREE.Color(0,0,0)});

        var internCyl = new THREE.Mesh(internGeom, mat);
        internCyl.rotateX(Math.PI / 2);

        externGeom.rotateX(Math.PI / 2);
        var externGeomBsp = new ThreeBSP(externGeom);
        minusGeom.rotateX(Math.PI / 2);
        var minusGeomBsp = new ThreeBSP(minusGeom);

        var finalResult = externGeomBsp.subtract(minusGeomBsp);
        var resultGeom = finalResult.toGeometry();
        var externCyl = new THREE.Mesh(resultGeom, mat);

        this.node = new THREE.Object3D();
        this.node.add(internCyl);
        this.node.add(externCyl);
        this.add(this.node);

    }

    update(){};

}

export {RangeIcon};
