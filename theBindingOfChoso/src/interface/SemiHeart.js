import * as THREE from '../../libs/three.module.js'

class SemiHeart extends THREE.Object3D {

    constructor() {
        super();

        var shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(0, 0);
        shape.quadraticCurveTo(0, 0.5, 0.25, 0.5);
        shape.quadraticCurveTo(0.5, 0.5, 0.5, 0);
        shape.lineTo(0,-0.5);
        shape.lineTo(0,0);

        var options = {
            depth: 0.2,
            steps: 1,
            curveSegments: 55,
            bevelEnabled: false,
        };

        // Un Mesh se compone de geometría y material. En este caso, como material
        // se crea uno a partir de un color
        //var geom = new THREE.BoxGeometry(1, 1, 1);
        var geom = new THREE.ExtrudeBufferGeometry(shape, options);

        this.redMat = new THREE.MeshPhongMaterial({color: new THREE.Color(1,0,0)});
        this.greyMat = new THREE.MeshPhongMaterial({color: new THREE.Color(0.717, 0.701, 0.701)});

        // Ya podemos construir el Mesh
        this.obj = new THREE.Mesh(geom, this.redMat);
        this.obj.position.z = -0.1;

        this.scaleNode = new THREE.Object3D();
        this.scaleNode.add(this.obj);

        this.node = new THREE.Object3D();
        this.node.add(this.scaleNode);

        // Y añadirlo como hijo del Object3D (el this)
        this.add(this.node);

    }

    rotateY() {
        this.node.rotateY(Math.PI);
    }

    changeColor() {
        if(this.obj.material === this.redMat) this.obj.material = this.greyMat;
        else this.obj.material = this.redMat;
    }

    changeScale(scale) {
        this.scaleNode.scale.y = scale;
    }

    getScale() {
        return this.scaleNode.scale.y;
    }

    update(){};

}

export {SemiHeart};
