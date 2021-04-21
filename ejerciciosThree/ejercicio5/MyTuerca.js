import * as THREE from '../libs/three.module.js'
import {ThreeBSP} from '../libs/ThreeBSP.js';
import {BufferGeometry} from "../libs/three.module.js";

class MyTuerca extends THREE.Object3D {

    constructor() {
        super();

        this.mat = new THREE.MeshNormalMaterial({flatShading: true});

        var cuerpoTuerca = new THREE.CylinderGeometry(1,1,0.8,20);
        var bordesTuerca = new THREE.SphereGeometry(1,20,20);
        var centroTuerca = new THREE.CylinderGeometry(0.4, 0.4, 0.8, 20);

        var shape = this.createShape();
        var path = this.createPath();
        var options = {
          steps: 100,
          extrudePath: path,
        };
        var rosca = new THREE.ExtrudeGeometry(shape, options);

        var cuerpoTuercaBsp = new ThreeBSP(cuerpoTuerca);
        var bordesTuercaBsp = new ThreeBSP(bordesTuerca);
        var centroTuercaBsp = new ThreeBSP(centroTuerca);
        var roscaBsp = new ThreeBSP(rosca);

        var partialResult = cuerpoTuercaBsp.intersect(bordesTuercaBsp);
        partialResult = partialResult.subtract(centroTuercaBsp);
        var finalResult = partialResult.subtract(roscaBsp);

        var geometry = finalResult.toGeometry();
        var finalGeometry = new BufferGeometry().fromGeometry(geometry);

        this.obj = new THREE.Mesh(finalGeometry, this.mat);
        this.add(this.obj);

    }

    createShape() {
        var shape = new THREE.Shape();
        shape.moveTo(-0.03, -0);
        shape.quadraticCurveTo(-0.03,0.03,0,0.03);
        shape.quadraticCurveTo(0.03,0.03,0.03,0);
        shape.quadraticCurveTo(0.03,-0.03,0,-0.03);
        shape.quadraticCurveTo(-0.03,-0.03,-0.03,0);

        return shape;
    }

    createPath() {
        var path = [];

        path.push(new THREE.Vector3(-0.5,-0.5,0));
        path.push(new THREE.Vector3(0,-0.45,0.5));
        path.push(new THREE.Vector3(0.5,-0.4,0));
        path.push(new THREE.Vector3(0,-0.35,-0.5));
        path.push(new THREE.Vector3(-0.5,-0.3,0));
        path.push(new THREE.Vector3(0,-0.25,0.5));
        path.push(new THREE.Vector3(0.5,-0.2,0));
        path.push(new THREE.Vector3(0,-0.15,-0.5));
        path.push(new THREE.Vector3(-0.5,-0.1,0));
        path.push(new THREE.Vector3(0,-0.05,0.5));
        path.push(new THREE.Vector3(0.5,0,0));
        path.push(new THREE.Vector3(0,0.05,-0.5));
        path.push(new THREE.Vector3(-0.5,0.1,0));
        path.push(new THREE.Vector3(0,0.15,0.5));
        path.push(new THREE.Vector3(0.5,0.2,0));
        path.push(new THREE.Vector3(0,0.25,-0.5));
        path.push(new THREE.Vector3(-0.5,0.3,0));
        path.push(new THREE.Vector3(0,0.35,0.5));
        path.push(new THREE.Vector3(0.5,0.4,0));

        return new THREE.CatmullRomCurve3(path);
    }

    update(animationSpeed) {
        this.obj.rotation.x += animationSpeed;
        this.obj.rotation.y += animationSpeed;
    }

}

export {MyTuerca};
