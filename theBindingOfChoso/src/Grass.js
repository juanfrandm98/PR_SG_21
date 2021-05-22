import * as THREE from '../libs/three.module.js'
import {PowerUp} from "./PowerUp.js"

class Grass extends PowerUp {

    constructor() {
        super();

        this.name = "grass";
        this.effect = 1;
        this.hitRadius = 0.5;

        var grass = this.createGrass();
        this.nodo.add(grass);

        // Variables para la animación
        this.velRot = 0.001;
        this.maxH = 1;
        this.minH = 0.5;
        this.velH = 0.0005;
        this.up = false;
    }

    createGrass() {
        var shape = new THREE.Shape();

        shape.moveTo(0.5, 0.4);
        shape.lineTo(0.5, 0.4);
        shape.lineTo(0.3, -0.5);
        shape.lineTo(-0.4, -0.5);
        shape.lineTo(-0.5, 0.3);
        shape.lineTo(-0.35, 0);
        shape.lineTo(-0.1, 0.5);
        shape.lineTo(0.1, -0.1);
        shape.lineTo(0.25, 0.2);
        shape.lineTo(0.35, -0.05);
        shape.lineTo(0.5, 0.4);

        var options = {
            depth: 0.2,
            steps: 1,
            curveSegments: 55,
            bevelThickness: 0.1,
            bevelSize: 0.1,
            bevelSegments: 3
        };

        var geom = new THREE.ExtrudeBufferGeometry(shape, options);
        var mat = new THREE.MeshPhongMaterial({color: new THREE.Color(0, 1, 0)});

        return new THREE.Mesh(geom, mat);
    }

    activate(pos) {
        pos.y = 0.75;
        super.activate(pos);
    }

}

export {Grass};