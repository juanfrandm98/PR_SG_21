import * as THREE from '../../libs/three.module.js'

class SpeedIcon extends THREE.Object3D {

    constructor(mat) {
        super();

        // Construcción del modelo de UNA parte
        var shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(0, 0);
        shape.lineTo(-0.1, 0.2);
        shape.lineTo(0, 0.2);
        shape.lineTo(0.1, 0);
        shape.lineTo(0, -0.2);
        shape.lineTo(-0.1, -0.2);
        shape.lineTo(0, 0);

        var options = {
            depth: 0.2,
            steps: 1,
            curveSegments: 55,
            bevelEnabled: false,
        };

        // Geometría
        var geom = new THREE.ExtrudeBufferGeometry(shape, options);

        // Construcción y colocación de las tres partes
        this.obj1 = new THREE.Mesh(geom, mat);
        this.obj1.position.x = -0.3;
        this.obj2 = new THREE.Mesh(geom, mat);
        this.obj3 = new THREE.Mesh(geom, mat);
        this.obj3.position.x = 0.3;

        // Composición del icono completo
        this.add(this.obj1);
        this.add(this.obj2);
        this.add(this.obj3);

    }

    update() {
    };

}

export {SpeedIcon};
