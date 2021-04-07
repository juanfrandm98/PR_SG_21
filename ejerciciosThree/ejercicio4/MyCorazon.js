import * as THREE from '../libs/three.module.js'

class MyCorazon extends THREE.Object3D {

    constructor(color) {
        super();

        var shape = new THREE.Shape();
        const x = 0, y = 0;
        shape.moveTo( x + 5, y + 5 );
        shape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
        shape.bezierCurveTo( x - 6, y, x - 6, y + 7,x - 6, y + 7 );
        shape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 );
        shape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
        shape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
        shape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );

        var options = {
            depth: 0.5,
            steps: 1,
            curveSegments: 15,
            bevelThickness: 0.5,
            bevelSize: 1,
            bevelSegments: 5
        };

        // Un Mesh se compone de geometría y material. En este caso, como material
        // se crea uno a partir de un color
        //var geom = new THREE.BoxGeometry(1, 1, 1);
        var geom = new THREE.ExtrudeBufferGeometry(shape, options);
        this.mat = new THREE.MeshPhongMaterial({color: color});

        // Ya podemos construir el Mesh
        this.obj = new THREE.Mesh(geom, this.mat);
        this.obj.scale.x = 0.3;
        this.obj.scale.y = 0.3;
        this.obj.scale.z = 0.3;
        this.obj.position.y -= 3;
        this.obj.position.x -= 1.55;

        // Y añadirlo como hijo del Object3D (el this)
        this.add(this.obj);

    }

    update() {}

}

export {MyCorazon};
