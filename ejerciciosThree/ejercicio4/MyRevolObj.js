import * as THREE from '../libs/three.module.js'
import {LatheGeometry} from "../libs/three.module.js";

class MyRevolObj extends THREE.Object3D {

    constructor(points, color) {
        super();

        this.points = points;

        // Un Mesh se compone de geometría y material. En este caso, como material
        // se crea uno a partir de un color
        //var geom = new THREE.BoxGeometry(1, 1, 1);
        var geom = new LatheGeometry(this.points, 12, 0, 2 * Math.PI);
        this.mat = new THREE.MeshPhongMaterial({color: color});

        // Ya podemos construir el Mesh
        this.obj = new THREE.Mesh(geom, this.mat);

        // Y añadirlo como hijo del Object3D (el this)
        this.add(this.obj);

    }

    update() {
    }

}

export {MyRevolObj};
