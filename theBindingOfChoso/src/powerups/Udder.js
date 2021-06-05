import * as THREE from '../../libs/three.module.js'
import {PowerUp} from "./PowerUp.js"

class Udder extends PowerUp {

    constructor() {
        super();

        // Variables para el control del powerup
        this.name = "udder";
        this.effect = 5;
        this.hitRadius = 0.5;

        // Creación del powerup
        var udder = this.createUdder();
        this.nodo.add(udder);

        // Variables para la animación
        this.velRot = 0.001;
        this.maxH = 1;
        this.minH = 0.5;
        this.velH = 0.0005;
        this.up = false;
    }

    // Crea la forma de la ubre
    createUdder() {
        var shape = new THREE.Shape();

        shape.moveTo(-0.5, 0.5);
        shape.lineTo(-0.5, 0.5);
        shape.quadraticCurveTo(0.3, 0.5, 0.3, 0);
        shape.quadraticCurveTo(0.3, -0.5, -0.5, -0.5);

        shape.lineTo(0, 0.4);
        shape.lineTo(0.5, 0.4);
        shape.lineTo(0.5, 0.35);
        shape.lineTo(0, 0.35);

        shape.lineTo(0, 0.2);
        shape.lineTo(0.4, 0.2);
        shape.lineTo(0.4, 0.15);
        shape.lineTo(0, 0.15);

        shape.lineTo(0, -0.1);
        shape.lineTo(0.5, -0.1);
        shape.lineTo(0.5, -0.15);
        shape.lineTo(0, -0.15);

        shape.lineTo(0, -0.3);
        shape.lineTo(0.4, -0.3);
        shape.lineTo(0.4, -0.35);
        shape.lineTo(0, -0.35);

        shape.lineTo(-0.5, -0.5);
        shape.lineTo(-0.5, 0.5);

        var options = {
            depth: 0.2,
            steps: 1,
            curveSegments: 55,
            bevelThickness: 0.1,
            bevelSize: 0.1,
            bevelSegments: 3
        };

        var geom = new THREE.ExtrudeBufferGeometry(shape, options);
        var mat = new THREE.MeshPhongMaterial({color: new THREE.Color(0.909, 0.090, 0.552)});

        return new THREE.Mesh(geom, mat);
    }

    // Activa el powerup, colocándolo en función de su altura
    activate(pos) {
        pos.y = 0.75;
        super.activate(pos);
    }

}

export {Udder};