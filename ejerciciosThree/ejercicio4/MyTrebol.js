import * as THREE from '../libs/three.module.js'
import {Color} from "../libs/three.module.js";
import {MyRevolObj} from "./MyRevolObj.js";

class MyTrebol extends THREE.Object3D {

    constructor() {
        super();

        var color = new Color(0,0,0);
        var points = [];
        points.push(new THREE.Vector3(0,-1,0));
        points.push(new THREE.Vector3(0.5,-1,0));
        points.push(new THREE.Vector3(0.2,0,0));
        points.push(new THREE.Vector3(0,1,0));

        this.objInf = new MyRevolObj(points, color);

        this.objInf.position.y -= 2.5;

        // Y añadirlo como hijo del Object3D (el this)
        this.add(this.objInf);

    }

    update() {
    }

}

export {MyTrebol};
