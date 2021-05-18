import * as THREE from '../libs/three.module.js'

class MyGround extends THREE.Object3D {

    constructor() {
        super();

        this.maxX = 49.5;
        this.maxZ = 49.5;

        var geometryGround = new THREE.BoxGeometry(200, 0.2, 200);
        var geometryFence = new THREE.BoxGeometry(101, 1, 1);

        var textureGround = new THREE.TextureLoader().load('../imgs/grass.jpg');
        var textureFence = new THREE.TextureLoader().load('../imgs/fence.jpg');
        var materialGround = new THREE.MeshPhongMaterial({map: textureGround});
        var materialFence = new THREE.MeshPhongMaterial({map: textureFence});

        var ground = new THREE.Mesh(geometryGround, materialGround);
        ground.position.y = -0.1;

        var leftFence = new THREE.Mesh(geometryFence, materialFence);
        leftFence.position.y = 0.5;
        leftFence.rotateY(Math.PI / 2);
        leftFence.position.x = -50;

        var rightFence = new THREE.Mesh(geometryFence, materialFence);
        rightFence.position.y = 0.5;
        rightFence.rotateY(Math.PI / 2);
        rightFence.position.x = 50;

        var topFence = new THREE.Mesh(geometryFence, materialFence);
        topFence.position.y = 0.5;
        topFence.position.z = -50;

        var bottomFence = new THREE.Mesh(geometryFence, materialFence);
        bottomFence.position.y = 0.5;
        bottomFence.position.z = 50;

        this.add(ground);
        this.add(leftFence);
        this.add(rightFence);
        this.add(topFence);
        this.add(bottomFence);
    }

    update() {
    }

    getMaxX() {
        return this.maxX;
    }

    getMaxZ() {
        return this.maxZ;
    }

}

export {MyGround};
