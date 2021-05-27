import * as THREE from '../../libs/three.module.js'

class BearModel extends THREE.Object3D {
    constructor() {
        super();

        // BODY & HEAD
        this.body = this.createBody();
        this.body.position.y = 0.5;

        // LEFT LEG
        this.leftLeg = this.createLeg();

        this.nodeLeftLeg = new THREE.Object3D();
        this.nodeLeftLeg.add(this.leftLeg);
        this.nodeLeftLeg.position.x = -0.15;
        this.nodeLeftLeg.position.y = 0.5;

        // RIGHT LEG
        this.rightLeg = this.createLeg();

        this.nodeRightLeg = new THREE.Object3D();
        this.nodeRightLeg.add(this.rightLeg);
        this.nodeRightLeg.position.x = 0.15;
        this.nodeRightLeg.position.y = 0.5;

        // LEFT ARM
        this.leftArm = this.createArm();

        this.leftArmNode = new THREE.Object3D();
        this.leftArmNode.add(this.leftArm);
        this.leftArmNode.position.set(-0.45, 1.3, 0.1);

        // RIGHT ARM
        this.rightArm = this.createArm();

        this.rightArmNode = new THREE.Object3D();
        this.rightArmNode.add(this.rightArm);
        this.rightArmNode.position.set(0.45, 1.3, 0.1);

        // GLOBAL
        this.bear = new THREE.Object3D();
        this.bear.add(this.body);
        this.bear.add(this.leftArmNode);
        this.bear.add(this.rightArmNode);
        this.bear.add(this.nodeLeftLeg);
        this.bear.add(this.nodeRightLeg);

        this.add(this.bear);

        // ANIMACIÓN
        this.maxAngle = Math.PI / 4;
        this.ida = true;
        this.tiempoAnterior = Date.now();
    }

    createHead() {
        var darkBrownMat = new THREE.MeshPhongMaterial({color: new THREE.Color(0.623, 0.235, 0.015)});
        var lightBrownMat = new THREE.MeshPhongMaterial({color: new THREE.Color(0.929, 0.6, 0.007)});

        var baseGeom = new THREE.BoxGeometry(0.3, 0.35, 0.3);
        var partMouthGeom = new THREE.BoxGeometry(0.4, 0.1, 0.4);
        var neckGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.1);
        var earGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.1);

        var neck = new THREE.Mesh(neckGeom, darkBrownMat);
        neck.position.y = 0.05;

        var base = new THREE.Mesh(baseGeom, darkBrownMat);
        base.position.y = 0.275;

        var leftEar = new THREE.Mesh(earGeom, darkBrownMat);
        leftEar.rotateX(Math.PI / 2);
        leftEar.position.set(-0.1, 0.45, 0);

        var rightEar = new THREE.Mesh(earGeom, darkBrownMat);
        rightEar.rotateX(Math.PI / 2);
        rightEar.position.set(0.1, 0.45, 0);

        var supMouth = new THREE.Mesh(partMouthGeom, darkBrownMat);
        supMouth.position.set(0, 0.25, 0.05);

        var infMouth = new THREE.Mesh(partMouthGeom, lightBrownMat);
        infMouth.position.set(0, 0.15, 0.05);

        var node = new THREE.Object3D();
        node.add(neck);
        node.add(base);
        node.add(leftEar);
        node.add(rightEar);
        node.add(supMouth);
        node.add(infMouth);

        return node;
    }

    createBody() {
        var darkBrownMat = new THREE.MeshPhongMaterial({color: new THREE.Color(0.623, 0.235, 0.015)});
        var lightBrownMat = new THREE.MeshPhongMaterial({color: new THREE.Color(0.929, 0.6, 0.007)});

        var supBodyGeom = new THREE.BoxGeometry(0.7, 0.6, 0.5);
        var infBodyGeom = new THREE.BoxGeometry(0.5, 0.5, 0.4);
        var tailGeom = new THREE.SphereGeometry(0.15, 10, 10);

        var head = this.createHead();
        head.position.y = 0.25;
        head.rotateX(-Math.PI / 8);

        var supBody = new THREE.Mesh(supBodyGeom, darkBrownMat);

        var supNode = new THREE.Object3D();
        supNode.add(head);
        supNode.add(supBody);
        supNode.rotateX(Math.PI / 8);
        supNode.position.set(0, 0.7, 0.1);

        var infBody = new THREE.Mesh(infBodyGeom, lightBrownMat);
        infBody.position.set(0, 0.25, 0);

        var tail = new THREE.Mesh(tailGeom, darkBrownMat);
        tail.position.set(0, 0.25, -0.3);

        var node = new THREE.Object3D();
        node.add(infBody);
        node.add(tail);
        node.add(supNode);

        return node;
    }

    createLeg() {
        var darkBrownMat = new THREE.MeshPhongMaterial({color: new THREE.Color(0.623, 0.235, 0.015)});
        var legGeom = new THREE.BoxGeometry(0.2, 0.5, 0.2);

        var leg = new THREE.Mesh(legGeom, darkBrownMat);
        leg.position.y = -0.25;

        var node = new THREE.Object3D();
        node.add(leg);

        return node;
    }

    createArm() {
        var darkBrownMat = new THREE.MeshPhongMaterial({color: new THREE.Color(0.623, 0.235, 0.015)});
        var supArmGeom = new THREE.BoxGeometry(0.2, 0.4, 0.2);
        var infArmGeom = new THREE.BoxGeometry(0.1, 0.4, 0.1);

        var supArm = new THREE.Mesh(supArmGeom, darkBrownMat);
        supArm.position.y = -0.1;

        var infArm = new THREE.Mesh(infArmGeom, darkBrownMat);
        infArm.position.y = -0.5;

        var node = new THREE.Object3D();
        node.add(supArm);
        node.add(infArm);

        return node;
    }

    calculateAngle(direction) {
        switch(direction) {
            case "up":
                return Math.PI;
            case "down":
                return 0;
            case "left":
                return 3 * Math.PI / 2;
            case "right":
                return Math.PI / 2;
            default:
                return -1;
        }
    }

    update(speed, direction) {
        var tiempoActual = Date.now();
        var msTranscurridos = tiempoActual - this.tiempoAnterior;
        this.tiempoAnterior = tiempoActual;

        var newAngle = 0.0;

        if(this.ida) {
            newAngle = this.rightLeg.rotation.x + msTranscurridos * speed / 3000;

            if(newAngle > this.maxAngle)
                newAngle = this.maxAngle;
        } else {
            newAngle = this.rightLeg.rotation.x - msTranscurridos * speed / 3000;

            if(newAngle < -this.maxAngle)
                newAngle = -this.maxAngle;
        }


        this.rightLeg.rotation.x = newAngle;
        this.leftLeg.rotation.x = -newAngle;

        var angle = this.calculateAngle(direction);
        if(angle >= 0) this.bear.rotation.y = angle;

        if(Math.abs(newAngle) === this.maxAngle) {
            if(this.ida) this.ida = false;
            else this.ida = true;
        }
    }

}

export {BearModel};