import * as THREE from '../libs/three.module.js'

class MyGround extends THREE.Object3D {

    constructor() {
        super();
        var geometryGround = new THREE.BoxGeometry(200, 0.2, 200);

        var texture = new THREE.TextureLoader().load('../imgs/wood.jpg');
        var materialGround = new THREE.MeshPhongMaterial({map: texture});

        var ground = new THREE.Mesh(geometryGround, materialGround);
        ground.position.y = -0.1;

        this.add(ground);
    }

    update() {
    }

}

export {MyGround};
