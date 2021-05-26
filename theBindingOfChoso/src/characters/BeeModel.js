import * as THREE from '../../libs/three.module.js'

class BeeModel extends THREE.Object3D {
    constructor() {
        super();

        // BODY
        this.body = this.createBody();

        // LEFT WING
        this.leftWing = this.createWing();
        this.leftWing.position.x = -0.45;

        this.leftWingRotNode = new THREE.Object3D();
        this.leftWingRotNode.add(this.leftWing);

        this.leftWingNode = new THREE.Object3D();
        this.leftWingNode.add(this.leftWingRotNode);
        this.leftWingNode.position.x = -0.2;

        // RING WING
        this.rightWing = this.createWing();
        this.rightWing.position.x = 0.45;

        this.rightWingRotNode = new THREE.Object3D();
        this.rightWingRotNode.add(this.rightWing);

        this.rightWingNode = new THREE.Object3D();
        this.rightWingNode.add(this.rightWingRotNode);
        this.rightWingNode.position.x = 0.2;

        // GLOBAL
        this.bee = new THREE.Object3D();
        this.bee.add(this.body);
        this.bee.add(this.leftWingNode);
        this.bee.add(this.rightWingNode);

        this.add(this.bee);

        // ANIMACIÓN
        this.maxAngle = Math.PI / 4;
        this.ida = true;
        this.tiempoAnterior = Date.now();
    }

    createBody() {
        var yellowMat = new THREE.MeshPhongMaterial({color: new THREE.Color(1, 1, 0)});
        var blackMat = new THREE.MeshPhongMaterial({color: new THREE.Color(0, 0, 0)});

        var corpsGeom = new THREE.SphereGeometry(0.3, 8, 8);
        var headGeom = new THREE.SphereGeometry(0.2, 8, 8);
        var stingGeom = new THREE.ConeGeometry(0.15, 0.3, 8, 8);

        var corps = new THREE.Mesh(corpsGeom, yellowMat);

        var head = new THREE.Mesh(headGeom, blackMat);
        head.position.y = 0.4;

        var sting = new THREE.Mesh(stingGeom, blackMat);
        sting.rotateX(Math.PI);
        sting.position.y = -0.4;

        var body = new THREE.Object3D();
        body.add(corps);
        body.add(head);
        body.add(sting);

        return body;
    }

    createWing() {
        var blueMat = new THREE.MeshPhongMaterial({
            color: new THREE.Color(0.454, 0.878, 0.984),
            transparent: true,
            opacity: 0.5
        });
        var wingGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.2);

        var wing = new THREE.Mesh(wingGeom, blueMat);
        wing.rotateX(Math.PI / 2);
        wing.scale.x = 1.5;

        var node = new THREE.Object3D();
        node.add(wing);

        return node;
    }

    update() {
        var tiempoActual = Date.now();
        var msTranscurridos = tiempoActual - this.tiempoAnterior;
        this.tiempoAnterior = Date.now();

        var newAngle = this.leftWingRotNode.rotation.y;

        if (this.ida) {
            newAngle += msTranscurridos / 50;

            if (newAngle > this.maxAngle) newAngle = this.maxAngle;
        } else {
            newAngle -= msTranscurridos / 50;

            if (newAngle < -this.maxAngle) newAngle = -this.maxAngle;
        }

        this.leftWingRotNode.rotation.y = newAngle;
        this.rightWingRotNode.rotation.y = -newAngle;

        if (this.maxAngle === Math.abs(newAngle)) {
            if (this.ida) this.ida = false;
            else this.ida = true;
        }
    }

    setBeeRotation(angle) {
        this.bee.rotation.y = angle;
    }
}

export {BeeModel};