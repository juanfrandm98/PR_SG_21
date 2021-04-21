import * as THREE from '../libs/three.module.js'
import {ThreeBSP} from '../libs/ThreeBSP.js';
import {BufferGeometry} from "../libs/three.module.js";

class MyPiezaCurva extends THREE.Object3D {

    constructor() {
        super();

        this.mat = new THREE.MeshNormalMaterial({flatShading: true});

        var shape = new THREE.Shape();
        shape.moveTo(-1.5, -1.5);
        shape.lineTo(-1.5, -1.5);
        shape.lineTo(-1.5, 0.8);
        shape.quadraticCurveTo(-1.5, 1.5, -0.8, 1.5);
        shape.lineTo(1.5, 1.5);
        shape.lineTo(1.5, -1.5);
        shape.lineTo(-1.5, -1.5);

        var options = {
            depth: 2,
            steps: 1,
            curveSegments: 15,
            bevelEnabled: false
        };

        var cuerpoPrincipal = new THREE.BoxGeometry(3, 3, 2);
        var cuerpoARestar = new THREE.ExtrudeGeometry(shape, options);
        var conoArriba = new THREE.CylinderGeometry(0.15, 0.25, 0.5, 10, 10);
        var conoLateral = new THREE.CylinderGeometry(0.15, 0.25, 0.5, 10, 10);

        cuerpoARestar.translate(0.5, -0.5, -1);
        conoArriba.translate(0.2, 1.25, 0);
        conoLateral.rotateZ(Math.PI / 2);
        conoLateral.translate(-1.25, -0.2, 0);

        var cuerpoPrincipalBsp = new ThreeBSP(cuerpoPrincipal);
        var cuerpoARestarBsp = new ThreeBSP(cuerpoARestar);
        var conoArribaBsp = new ThreeBSP(conoArriba);
        var conoLateralBsp = new ThreeBSP(conoLateral);

        var partialResult = cuerpoPrincipalBsp.subtract(cuerpoARestarBsp);
        var partialResult = partialResult.subtract(conoArribaBsp);
        var finalResult = partialResult.subtract(conoLateralBsp);

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

export {MyPiezaCurva};
