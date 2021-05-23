import * as THREE from '../libs/three.module.js'

class ChosoModel extends THREE.Object3D {
    constructor() {
        super();

        // CABEZA
        this.headNode = this.createHeadNode();
        this.headNode.position.y = 1.625;

        // CUERPO
        this.corpsNode = this.createBody();
        this.corpsNode.position.y = 1.1;

        // PIERNA IZQUIERDA
        this.leftLeg = this.createLeg();

        this.nodeLeftLeg = new THREE.Object3D();
        this.nodeLeftLeg.add(this.leftLeg);
        this.nodeLeftLeg.position.y = 0.6;
        this.nodeLeftLeg.position.x = -0.15;

        // PIERNA DERECHA
        this.rightLeg = this.createLeg();

        this.nodeRightLeg = new THREE.Object3D();
        this.nodeRightLeg.add(this.rightLeg);
        this.nodeRightLeg.position.y = 0.6;
        this.nodeRightLeg.position.x = 0.15;

        // BRAZO IZQUIERDO
        this.leftArm = this.createArm();

        this.nodeLeftArm = new THREE.Object3D();
        this.nodeLeftArm.add(this.leftArm);
        this.nodeLeftArm.position.y = 1.4;
        this.nodeLeftArm.position.x = -0.35;

        // BRAZO DERECHO
        this.rightArm = this.createArm();

        this.nodeRightArm = new THREE.Object3D();
        this.nodeRightArm.add(this.rightArm);
        this.nodeRightArm.position.y = 1.4;
        this.nodeRightArm.position.x = 0.35;

        // CUERPO SALVO CABEZA
        this.bodyNode = new THREE.Object3D();
        this.bodyNode.add(this.corpsNode);
        this.bodyNode.add(this.nodeLeftLeg);
        this.bodyNode.add(this.nodeRightLeg);
        this.bodyNode.add(this.nodeLeftArm);
        this.bodyNode.add(this.nodeRightArm);

        // GLOBAL
        this.choso = new THREE.Object3D();
        this.choso.add(this.headNode);
        this.choso.add(this.bodyNode);

        this.add(this.choso);
    }

    createHeadNode() {
        var whiteMat = new THREE.MeshPhongMaterial({color: new THREE.Color(1,1,1)});
        var blackMat = new THREE.MeshPhongMaterial({color: new THREE.Color(0,0,0)});
        var pinkMat = new THREE.MeshPhongMaterial({color: new THREE.Color(0.964, 0.352, 0.827)});

        var baseGeom = new THREE.BoxGeometry(0.35, 0.3, 0.3);
        var mouthGeom = new THREE.BoxGeometry(0.35, 0.15, 0.1);
        var hornGeom = new THREE.CylinderGeometry(0.03, 0.03, 0.1, 8, 8);
        var neckGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 8, 8);

        var baseHead = new THREE.Mesh(baseGeom, whiteMat);
        baseHead.position.y = 0.175;

        var mouth = new THREE.Mesh(mouthGeom, pinkMat);
        mouth.position.y = 0.1;
        mouth.position.z = 0.2;

        var leftHorn = new THREE.Mesh(hornGeom, blackMat);
        leftHorn.position.y = 0.375;
        leftHorn.position.x = -0.1;

        var rightHorn = new THREE.Mesh(hornGeom, blackMat);
        rightHorn.position.y = 0.375;
        rightHorn.position.x = 0.1;

        var neck = new THREE.Mesh(neckGeom, whiteMat);

        var head = new THREE.Object3D();
        head.add(baseHead);
        head.add(mouth);
        head.add(leftHorn);
        head.add(rightHorn);
        head.add(neck);

        return head;
    }

    createBody() {
        var whiteMat = new THREE.MeshPhongMaterial({color: new THREE.Color(1,1,1)});
        var pinkMat = new THREE.MeshPhongMaterial({color: new THREE.Color(0.964, 0.352, 0.827)});

        var bodyGeom = new THREE.BoxGeometry(0.5, 1, 0.5);
        var udderGeom = new THREE.BoxGeometry(0.3, 0.3, 0.15);

        var body = new THREE.Mesh(bodyGeom, whiteMat);

        var udder = new THREE.Mesh(udderGeom, pinkMat);
        udder.position.z = 0.3;
        udder.position.y = -0.25;

        var node = new THREE.Object3D();
        node.add(body);
        node.add(udder);

        return node;
    }

    createLeg() {
        var whiteMat = new THREE.MeshPhongMaterial({color: new THREE.Color(1,1,1)});
        var blackMat = new THREE.MeshPhongMaterial({color: new THREE.Color(0,0,0)});

        var legGeom = new THREE.BoxGeometry(0.2, 0.5, 0.2);
        var hoofGeom = new THREE.BoxGeometry(0.2, 0.1, 0.2);

        var leg = new THREE.Mesh(legGeom, whiteMat);
        leg.position.y = -0.25;

        var hoof = new THREE.Mesh(hoofGeom, blackMat);
        hoof.position.y = -0.55;

        var node = new THREE.Object3D();
        node.add(leg);
        node.add(hoof);

        return node;
    }

    createArm() {
        var arm = this.createLeg();

        var node = new THREE.Object3D();
        node.add(arm);
        node.position.y = 0.1;

        return node;
    }

    calculateAngle(dirX, dirZ) {
        if(dirX === 0 && dirZ > 0)
            return 0;
        else if(dirX > 0 && dirZ > 0)
            return Math.PI / 4;
        else if(dirX > 0 && dirZ === 0)
            return Math.PI / 2;
        else if(dirX > 0 && dirZ < 0)
            return 3 * Math.PI / 4;
        else if(dirX === 0 && dirZ < 0)
            return Math.PI;
        else if(dirX < 0 && dirZ < 0)
            return 5 * Math.PI / 4;
        else if(dirX < 0 && dirZ === 0)
            return 3 * Math.PI / 2;
        else if(dirX < 0 && dirZ > 0)
            return 7 * Math.PI / 4;
        else return -1;
    }

    rotateChoso(dirX, dirZ) {
        var angle = this.calculateAngle(dirX, dirZ);

        this.headNode.rotation.y = 0;
        this.bodyNode.rotation.y = 0;

        if(angle >= 0) this.choso.rotation.y = angle;
    }

    rotateHead(dirX, dirZ) {
        var angle = this.calculateAngle(dirX, dirZ);

        this.choso.rotation.y = 0;

        if(angle >= 0) this.headNode.rotation.y = angle;
    }

    rotateBody() {
        this.choso.rotation.y = 0;
    }

    update(){}
}

export {ChosoModel};