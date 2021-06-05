import * as THREE from '../../libs/three.module.js'
import {ThreeBSP} from "../../libs/ThreeBSP.js";

class RangeIcon extends THREE.Object3D {

    constructor(mat) {
        super();

        // Geometrías
        var externGeom = new THREE.CylinderGeometry(0.45, 0.45, 0.2);
        var minusGeom = new THREE.CylinderGeometry(0.35, 0.35, 0.2);
        var internGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.2);

        var internCyl = new THREE.Mesh(internGeom, mat);
        internCyl.rotateX(Math.PI / 2);

        externGeom.rotateX(Math.PI / 2);
        var externGeomBsp = new ThreeBSP(externGeom);
        minusGeom.rotateX(Math.PI / 2);
        var minusGeomBsp = new ThreeBSP(minusGeom);

        // Creación de una geometría a partir de la resta de dos
        var finalResult = externGeomBsp.subtract(minusGeomBsp);
        var resultGeom = finalResult.toGeometry();
        var externCyl = new THREE.Mesh(resultGeom, mat);

        // Composición del modelo final
        this.node = new THREE.Object3D();
        this.node.add(internCyl);
        this.node.add(externCyl);
        this.add(this.node);

    }

    update() {
    };

}

export {RangeIcon};
