import * as THREE from '../../libs/three.module.js'
import {PowerUp} from "./PowerUp.js"

class Trap extends PowerUp {

    constructor() {
        super();

        this.name = "trap";
        this.effect = 4;
        this.hitRadius = 0.5;

        var trap = this.createTrap();
        this.nodo.add(trap);

        // Variables para la animación
        this.velRot = 0.001;
        this.maxH = 1;
        this.minH = 0.5;
        this.velH = 0.0005;
        this.up = false;
    }

    createTrap() {
        var shape = new THREE.Shape();
        var alturaPua = 0.3;
        var alturaPalo = 0.05;

        shape.moveTo(0.0, 0.0);
        shape.lineTo(0.0, 0.0);
        shape.lineTo(1.0, 0.0);
        shape.lineTo(1.0, alturaPalo);
        shape.lineTo(0.9, alturaPua);
        shape.lineTo(0.8, alturaPalo);
        shape.lineTo(0.7, alturaPua);
        shape.lineTo(0.6, alturaPalo);
        shape.lineTo(0.5, alturaPua);
        shape.lineTo(0.4, alturaPalo);
        shape.lineTo(0.3, alturaPua);
        shape.lineTo(0.2, alturaPalo);
        shape.lineTo(0.0, alturaPalo);
        shape.lineTo(0.0, 0.0);

        var options = {
            depth: 0.2,
            steps: 1,
            curveSegments: 55,
            bevelThickness: 0.1,
            bevelSize: 0.1,
            bevelSegments: 3
        };

        var geom = new THREE.ExtrudeBufferGeometry(shape, options);
        var mat = new THREE.MeshPhongMaterial({color: new THREE.Color(0.5, 0.5, 0.5)});

        var infTrap = new THREE.Mesh(geom, mat);
        var supTrap = new THREE.Mesh(geom, mat);

        supTrap.scale.y = -1;
        supTrap.rotateZ(Math.PI / 4);
        supTrap.position.y = 0.1;

        var node = new THREE.Object3D();
        node.add(infTrap);
        node.add(supTrap);
        node.position.set(-0.5, -0.5, 0);

        return node;
    }

    activate(pos) {
        pos.y = 0.5;
        super.activate(pos);
    }

}

export {Trap};