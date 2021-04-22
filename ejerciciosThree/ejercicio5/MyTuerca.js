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
        rosca.rotateX(Math.PI / 2);

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

        var anguloAcumulado = 0;
        var anguloPorVertice = Math.PI / 10;
        var altura= -0.4;
        var maxAltura = 0.4;
        var radio = 0.4;
        var alturaPorVertice = 0.005;

        while( altura < maxAltura ) {
            var x = Math.sin(anguloAcumulado) * radio;
            var y = - Math.cos(anguloAcumulado) * radio;
            var z = altura;

            path.push(new THREE.Vector3(x,y,z));

            altura += alturaPorVertice;
            anguloAcumulado += anguloPorVertice;
        }

        return new THREE.CatmullRomCurve3(path);
    }

    update(animationSpeed) {
        this.obj.rotation.x += animationSpeed;
        this.obj.rotation.y += animationSpeed;
    }

}

export {MyTuerca};
