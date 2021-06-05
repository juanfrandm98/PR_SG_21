import * as THREE from '../../libs/three.module.js'

class SemiHeart extends THREE.Object3D {

    constructor() {
        super();

        // Creación de la geometría (medio corazón)
        var shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(0, 0);
        shape.quadraticCurveTo(0, 0.5, 0.25, 0.5);
        shape.quadraticCurveTo(0.5, 0.5, 0.5, 0);
        shape.lineTo(0, -0.5);
        shape.lineTo(0, 0);

        var options = {
            depth: 0.2,
            steps: 1,
            curveSegments: 55,
            bevelEnabled: false,
        };

        var geom = new THREE.ExtrudeBufferGeometry(shape, options);

        // Creación de los materiales (para corazón activo e inactivo)
        this.redMat = new THREE.MeshPhongMaterial({color: new THREE.Color(1, 0, 0)});
        this.greyMat = new THREE.MeshPhongMaterial({color: new THREE.Color(0.717, 0.701, 0.701)});

        // Construcción del mesh
        this.obj = new THREE.Mesh(geom, this.redMat);
        this.obj.position.z = -0.1;

        // Composición del nodo para el latido
        this.scaleNode = new THREE.Object3D();
        this.scaleNode.add(this.obj);

        // Composición del nodo para su colocación
        this.node = new THREE.Object3D();
        this.node.add(this.scaleNode);

        // Y añadirlo como hijo del Object3D (el this)
        this.add(this.node);

    }

    // Rotación del medio corazón para componer corazones completos
    rotateY() {
        this.node.rotateY(Math.PI);
    }

    // Cambio de color (corazón activo/inactivo)
    changeColor() {
        if (this.obj.material === this.redMat) this.obj.material = this.greyMat;
        else this.obj.material = this.redMat;
    }

    // Cambio de la escala del corazón (latido)
    changeScale(scale) {
        this.scaleNode.scale.y = scale;
    }

    // Getter del escalado actual (latido)
    getScale() {
        return this.scaleNode.scale.y;
    }

    update() {
    };

}

export {SemiHeart};
