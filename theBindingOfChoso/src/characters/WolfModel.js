import * as THREE from '../../libs/three.module.js'

class WolfModel extends THREE.Object3D {
    constructor() {
        super();

        // CABEZA
        this.head = this.createHead();
        this.head.position.y = 1.5;

        // BODY
        this.body = this.createBody();
        this.body.position.y = 1.05;

        // TAIL
        this.tail = this.createTail();

        this.nodeTail = new THREE.Object3D();
        this.nodeTail.add(this.tail);
        this.nodeTail.position.y = 0.75;
        this.nodeTail.position.z = -0.15;

        // LEFT LEG
        this.leftLeg = this.createLeg();

        this.nodeLeftLeg = new THREE.Object3D();
        this.nodeLeftLeg.add(this.leftLeg);
        this.nodeLeftLeg.position.x = -0.1;
        this.nodeLeftLeg.position.y = 0.6;

        // RIGHT LEG
        this.rightLeg = this.createLeg();

        this.nodeRightLeg = new THREE.Object3D();
        this.nodeRightLeg.add(this.rightLeg);
        this.nodeRightLeg.position.x = 0.1;
        this.nodeRightLeg.position.y = 0.6;

        // LEFT ARM
        this.leftArm = this.createArm();

        this.leftArmNode = new THREE.Object3D();
        this.leftArmNode.add(this.leftArm);
        this.leftArmNode.position.x = -0.3;
        this.leftArmNode.position.y = 1.35;

        // RIGHT ARM
        this.rightArm = this.createArm();

        this.rightArmNode = new THREE.Object3D();
        this.rightArmNode.add(this.rightArm);
        this.rightArmNode.position.x = 0.3;
        this.rightArmNode.position.y = 1.35;

        // GLOBAL
        this.wolf = new THREE.Object3D();
        this.wolf.add(this.head);
        this.wolf.add(this.body);
        this.wolf.add(this.nodeTail);
        this.wolf.add(this.nodeLeftLeg);
        this.wolf.add(this.nodeRightLeg);
        this.wolf.add(this.leftArmNode);
        this.wolf.add(this.rightArmNode);

        this.add(this.wolf);

        // ANIMACIÓN
        this.maxAngle = Math.PI / 4;
        this.ida = true;
        this.tiempoAnterior = Date.now();
    }

    // Creación de la boca con sus dientes
    createMouth() {
        var brownMat = new THREE.MeshPhongMaterial({color: new THREE.Color(0.623, 0.235, 0.015)});
        var whiteMat = new THREE.MeshPhongMaterial({color: new THREE.Color(1, 1, 1)});

        var mouthGeom = new THREE.BoxGeometry(0.3, 0.075, 0.3);
        var toothGeom = new THREE.ConeGeometry(0.01, 0.05);

        var mouthUp = new THREE.Mesh(mouthGeom, brownMat);
        mouthUp.position.y = 0.0375;

        var toothUpLf = new THREE.Mesh(toothGeom, whiteMat);
        toothUpLf.rotateZ(Math.PI);
        toothUpLf.position.x = -0.12;
        toothUpLf.position.y = -0.025;
        toothUpLf.position.z = 0.12;

        var toothUpRi = new THREE.Mesh(toothGeom, whiteMat);
        toothUpRi.rotateZ(Math.PI);
        toothUpRi.position.x = 0.12;
        toothUpRi.position.y = -0.025;
        toothUpRi.position.z = 0.12;

        var mouthUpNode = new THREE.Object3D();
        mouthUpNode.add(mouthUp);
        mouthUpNode.add(toothUpLf);
        mouthUpNode.add(toothUpRi);

        var mouthDw = new THREE.Mesh(mouthGeom, brownMat);
        mouthDw.position.y = -0.0375;

        var toothDwLf = new THREE.Mesh(toothGeom, whiteMat);
        toothDwLf.position.x = -0.08;
        toothDwLf.position.y = 0.025;
        toothDwLf.position.z = 0.12;

        var toothDwRi = new THREE.Mesh(toothGeom, whiteMat);
        toothDwRi.position.x = 0.08;
        toothDwRi.position.y = 0.025;
        toothDwRi.position.z = 0.12;

        var mouthDwNode = new THREE.Object3D();
        mouthDwNode.add(mouthDw);
        mouthDwNode.add(toothDwLf);
        mouthDwNode.add(toothDwRi);
        mouthDwNode.rotateX(Math.PI / 7);

        var node = new THREE.Object3D();
        node.add(mouthUpNode);
        node.add(mouthDwNode);

        return node;
    }

    // Creación de la cabeza
    createHead() {
        var brownMat = new THREE.MeshPhongMaterial({color: new THREE.Color(0.623, 0.235, 0.015)});

        var baseGeom = new THREE.BoxGeometry(0.2, 0.325, 0.2);
        var neckGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.1);
        var earGeom = new THREE.ConeGeometry(0.05, 0.1);

        var neck = new THREE.Mesh(neckGeom, brownMat);
        neck.position.y = 0.05;

        var base = new THREE.Mesh(baseGeom, brownMat);
        base.position.y = 0.2625;

        var leftEar = new THREE.Mesh(earGeom, brownMat);
        leftEar.position.x = -0.05;
        leftEar.position.y = 0.475;

        var rightEar = new THREE.Mesh(earGeom, brownMat);
        rightEar.position.x = 0.05;
        rightEar.position.y = 0.475;

        var mouth = this.createMouth();
        mouth.position.y = 0.175;
        mouth.position.z = 0.05;

        var node = new THREE.Object3D();
        node.add(neck);
        node.add(base);
        node.add(leftEar);
        node.add(rightEar);
        node.add(mouth);

        return node;
    }

    // Creación de la cola
    createTail() {
        var brownMat = new THREE.MeshPhongMaterial({color: new THREE.Color(0.623, 0.235, 0.015)});
        var partTailGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.3);

        var tailInf = new THREE.Mesh(partTailGeom, brownMat);
        tailInf.rotateX(-Math.PI / 2);
        tailInf.position.z = -0.15;

        var tailSup = new THREE.Mesh(partTailGeom, brownMat);
        tailSup.position.y = 0.15;
        tailSup.position.z = -0.275

        var node = new THREE.Object3D();
        node.add(tailInf);
        node.add(tailSup);

        return node;
    }

    // Creación del cuerpo
    createBody() {
        var brownMat = new THREE.MeshPhongMaterial({color: new THREE.Color(0.623, 0.235, 0.015)});

        var supBodyGeom = new THREE.BoxGeometry(0.5, 0.4, 0.4);
        var infBodyGeom = new THREE.BoxGeometry(0.3, 0.5, 0.3);

        var supBody = new THREE.Mesh(supBodyGeom, brownMat);
        supBody.position.y = 0.25;

        var infBody = new THREE.Mesh(infBodyGeom, brownMat);
        infBody.position.y = -0.20;

        var node = new THREE.Object3D();
        node.add(supBody);
        node.add(infBody);

        return node;
    }

    // Creación de una pierna
    createLeg() {
        var brownMat = new THREE.MeshPhongMaterial({color: new THREE.Color(0.623, 0.235, 0.015)});
        var legGeom = new THREE.BoxGeometry(0.1, 0.6, 0.1);

        var leg = new THREE.Mesh(legGeom, brownMat);
        leg.position.y = -0.3;

        var node = new THREE.Object3D();
        node.add(leg);

        return node;
    }

    // Creación de un brazo
    createArm() {
        var brownMat = new THREE.MeshPhongMaterial({color: new THREE.Color(0.623, 0.235, 0.015)});
        var partArmGeom = new THREE.BoxGeometry(0.1, 0.3, 0.1);

        var supArm = new THREE.Mesh(partArmGeom, brownMat);
        supArm.rotateX(-Math.PI / 4);
        supArm.position.y = -0.05;
        supArm.position.z = 0.1;

        var infArm = new THREE.Mesh(partArmGeom, brownMat);
        infArm.rotateX(Math.PI / 2);
        infArm.position.y = -0.15;
        infArm.position.z = 0.325;

        var node = new THREE.Object3D();
        node.add(supArm);
        node.add(infArm);

        return node;
    }

    // Cálculo de la rotación del modelo en función de su dirección de
    // movimiento
    calculateAngle(dirX, dirZ) {
        if (dirX === 0 && dirZ > 0)
            return 0;
        else if (dirX > 0 && dirZ > 0)
            return Math.PI / 4;
        else if (dirX > 0 && dirZ === 0)
            return Math.PI / 2;
        else if (dirX > 0 && dirZ < 0)
            return 3 * Math.PI / 4;
        else if (dirX === 0 && dirZ < 0)
            return Math.PI;
        else if (dirX < 0 && dirZ < 0)
            return 5 * Math.PI / 4;
        else if (dirX < 0 && dirZ === 0)
            return 3 * Math.PI / 2;
        else if (dirX < 0 && dirZ > 0)
            return 7 * Math.PI / 4;
        else return -1;
    }

    // Actualización
    update(speed, dirX, dirZ) {
        var tiempoActual = Date.now();
        var msTranscurridos = tiempoActual - this.tiempoAnterior;
        this.tiempoAnterior = tiempoActual;

        // Cálculo de los ángulos de las piernas, los brazos y la cola
        var newAngle = 0.0;
        var newArmAngle = 0.0;

        if (this.ida) {
            newAngle = this.rightLeg.rotation.x + msTranscurridos * speed / 3000;

            if (newAngle > this.maxAngle)
                newAngle = this.maxAngle;
        } else {
            newAngle = this.rightLeg.rotation.x - msTranscurridos * speed / 3000;

            if (newAngle < -this.maxAngle)
                newAngle = -this.maxAngle;
        }

        newArmAngle = newAngle / 2;

        this.rightLeg.rotation.x = newAngle;
        this.leftLeg.rotation.x = -newAngle;
        this.rightArm.rotation.x = -newArmAngle;
        this.leftArm.rotation.x = newArmAngle;
        this.tail.rotation.y = newAngle;

        var angle = this.calculateAngle(dirX, dirZ);
        if (angle >= 0) this.wolf.rotation.y = angle;

        // Comprobación del cambio de dirección de las rotaciones
        if (Math.abs(newAngle) === this.maxAngle) {
            if (this.ida) this.ida = false;
            else this.ida = true;
        }
    }
}

export {WolfModel};