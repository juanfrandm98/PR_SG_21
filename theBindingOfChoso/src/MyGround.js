import * as THREE from '../libs/three.module.js'

class MyGround extends THREE.Object3D {

    constructor() {
        super();

        // Dimensiones máximas para el spawn de objetos
        this.maxX = 25;
        this.maxZ = 25;

        // Geometrías para el terreno
        var geometryGround = new THREE.BoxGeometry(200, 0.2, 200);
        var geometryFence = new THREE.BoxGeometry(50.05, 1, 0.1);

        // Texturas para el terreno
        var textureGround = new THREE.TextureLoader().load('../imgs/grass.jpg');
        textureGround.wrapS = THREE.RepeatWrapping;
        textureGround.wrapT = THREE.RepeatWrapping;
        textureGround.repeat.set(5, 5);

        var textureFence = new THREE.TextureLoader().load('../imgs/fence.jpg');
        textureFence.wrapS = THREE.RepeatWrapping;
        textureFence.repeat.set(20, 1);

        var materialGround = new THREE.MeshPhongMaterial({map: textureGround});
        var materialFence = new THREE.MeshPhongMaterial({map: textureFence});

        // Colocación del terreno
        var ground = new THREE.Mesh(geometryGround, materialGround);
        ground.position.y = -0.1;

        // Colocación de las vallas
        var leftFence = new THREE.Mesh(geometryFence, materialFence);
        leftFence.position.y = 0.5;
        leftFence.rotateY(Math.PI / 2);
        leftFence.position.x = -25;

        var rightFence = new THREE.Mesh(geometryFence, materialFence);
        rightFence.position.y = 0.5;
        rightFence.rotateY(Math.PI / 2);
        rightFence.position.x = 25;

        var topFence = new THREE.Mesh(geometryFence, materialFence);
        topFence.position.y = 0.5;
        topFence.position.z = -25;

        var bottomFence = new THREE.Mesh(geometryFence, materialFence);
        bottomFence.position.y = 0.5;
        bottomFence.position.z = 25;

        // Adición de los distintos elementos a la escena
        this.add(ground);
        this.add(leftFence);
        this.add(rightFence);
        this.add(topFence);
        this.add(bottomFence);
    }

    update() {
    }

    // Getter del máximo de spawn para el eje X
    getMaxX() {
        return this.maxX;
    }

    // Getter del máximo de spawn para el eje Z
    getMaxZ() {
        return this.maxZ;
    }

}

export {MyGround};
