import * as THREE from '../libs/three.module.js'
import {MyCorazon} from "./MyCorazon.js";
import {Color} from "../libs/three.module.js";
import {MyRevolObj} from "./MyRevolObj.js";

class MyPica extends THREE.Object3D {

    constructor() {
        super();

        var color = new Color(0,0,0);
        var points = [];
        points.push(new THREE.Vector3(0,-1,0));
        points.push(new THREE.Vector3(0.5,-1,0));
        points.push(new THREE.Vector3(0.2,0,0));
        points.push(new THREE.Vector3(0,1,0));

        this.objSup = new MyCorazon(color);
        this.objInf = new MyRevolObj(points, color);

        this.objSup.scale.set(0.8,0.8,0.8);
        this.objSup.position.y += 0.2;
        this.objInf.position.y -= 2.5;

        // Y añadirlo como hijo del Object3D (el this)
        this.add(this.objSup);
        this.add(this.objInf);

    }

    update() {
    }

}

export {MyPica};
