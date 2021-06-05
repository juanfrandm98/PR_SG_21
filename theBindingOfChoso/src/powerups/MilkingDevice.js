import * as THREE from '../../libs/three.module.js'
import {PowerUp} from "./PowerUp.js"

class MilkingDevice extends PowerUp {

    constructor() {
        super();

        // Variables para el control del powerup
        this.name = "milking";
        this.effect = 0.1;
        this.hitRadius = 0.5;

        // Creación del modelo
        var milkingDevice = this.createDevice();
        this.nodo.add(milkingDevice);

        // Variables para la animación
        this.velRot = 0.001;
        this.maxH = 1;
        this.minH = 0.5;
        this.velH = 0.0005;
        this.up = false;
    }

    // Creación del modelo del sacaleches
    createDevice() {
        var shape = new THREE.Shape();

        shape.moveTo(-0.5, 0.5);
        shape.lineTo(-0.5, 0.5);
        shape.lineTo(-0.25, 0.35);
        shape.lineTo(-0.1, 0.35);
        shape.lineTo(-0.1, 0.45);
        shape.lineTo(0.1, 0.45);
        shape.lineTo(0.1, 0.1);
        shape.quadraticCurveTo(0.3, 0.1, 0.3, -0.1);
        shape.lineTo(0.3, -0.5);
        shape.lineTo(-0.3, -0.5);
        shape.lineTo(-0.3, -0.1);
        shape.quadraticCurveTo(-0.3, 0.1, -0.1, 0.1);
        shape.lineTo(-0.1, 0.25);
        shape.lineTo(-0.25, 0.25);
        shape.lineTo(-0.5, 0.1);
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
        var mat = new THREE.MeshPhongMaterial({color: new THREE.Color(0.509, 0.509, 0.509)});

        return new THREE.Mesh(geom, mat);
    }

    // Activa el powerup, colocándolo en función de su altura
    activate(pos) {
        pos.y = 0.75;
        super.activate(pos);
    }

}

export {MilkingDevice};