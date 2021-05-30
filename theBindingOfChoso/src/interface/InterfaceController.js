import * as THREE from '../../libs/three.module.js'
import {SemiHeart} from "./SemiHeart.js";
import {Sword} from "./Sword.js";
import {ShotIcon} from "./ShotIcon.js";
import {RangeIcon} from "./RangeIcon.js";
import {PointsController} from "./PointsController.js";
import {SpeedIcon} from "./SpeedIcon.js";

class InterfaceController extends THREE.Object3D {

    constructor(maxHP, initialAtk, initialShotRadius, initialRange, initialSpeed) {
        super();

        // FONDO
        var backGeom = new THREE.BoxGeometry(25, 25, 0.1);
        var backText = new THREE.TextureLoader().load('../../imgs/background.jpg');
        backText.wrapS = THREE.RepeatWrapping;
        backText.repeat.set(2, 1);
        var backMat = new THREE.MeshPhongMaterial({map: backText});

        this.backGround = new THREE.Mesh(backGeom, backMat);
        this.backGround.position.x = -2.5;
        this.backGround.position.z = -0.5;
        this.add(this.backGround);

        // HEALTH
        this.hearts = [];
        var i;
        var x = 0.5;
        var xPerCouple = 0.75;

        for (i = 0; i < maxHP; i++) {
            this.hearts.push(new SemiHeart());
            this.hearts[i].position.y = 3;
            this.add(this.hearts[i]);
        }

        for (i = 0; i < this.hearts.length; i += 2) {
            this.hearts[i].rotateY();
            this.hearts[i].position.x = x + xPerCouple * i;
            this.hearts[i + 1].position.x = x + xPerCouple * i;
        }

        // HEALTH ANIMATION
        this.maxHealth = maxHP;
        this.currentHeart = maxHP - 1;
        this.beatingSpeed = 0.001;
        this.maxBeat = 1.5;
        this.minBeat = 1;
        this.beatUp = true;

        // COLOR PARA ICONOS
        var iconMat = new THREE.MeshPhongMaterial({color: new THREE.Color(0, 0, 0)});

        // ATACK
        this.attackIcon = new Sword(iconMat);
        this.attackController = new PointsController(initialAtk);
        this.attackController.position.x = 1;

        this.attackNode = new THREE.Object3D();
        this.attackNode.add(this.attackIcon);
        this.attackNode.add(this.attackController);
        this.attackNode.position.set(0.5, 1.5, 0);
        this.add(this.attackNode);

        // SHOT RADIUS
        this.shotRadiusIcon = new ShotIcon(iconMat);
        this.shotRadiusController = new PointsController(initialShotRadius);
        this.shotRadiusController.position.x = 1;

        this.shotRadiusNode = new THREE.Object3D();
        this.shotRadiusNode.add(this.shotRadiusIcon);
        this.shotRadiusNode.add(this.shotRadiusController);
        this.shotRadiusNode.position.set(0.5, 0, 0);
        this.add(this.shotRadiusNode);

        // RANGE
        this.rangeIcon = new RangeIcon(iconMat);
        this.rangeController = new PointsController(initialRange);
        this.rangeController.position.x = 1;

        this.rangeNode = new THREE.Object3D();
        this.rangeNode.add(this.rangeIcon);
        this.rangeNode.add(this.rangeController);
        this.rangeNode.position.set(0.5, -1.5, 0);
        this.add(this.rangeNode);

        // SPEED
        this.speedIcon = new SpeedIcon(iconMat);
        this.speedController = new PointsController(initialSpeed);
        this.speedController.position.x = 1;

        this.speedNode = new THREE.Object3D();
        this.speedNode.add(this.speedIcon);
        this.speedNode.add(this.speedController);
        this.speedNode.position.set(0.5, -3, 0);
        this.add(this.speedNode);

        // CAM
        this.camera = this.createCamera();
        this.add(this.camera);

        // LIGHT
        this.light = this.createLight();
        this.add(this.light);

        this.tiempoAnterior = Date.now();
    }

    createCamera() {
        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(3.5, 0, 25);
        camera.lookAt(new THREE.Vector3(3.5,0,0));

        return camera;
    }

    createLight() {
        var light = new THREE.SpotLight(0xffffff, 0.8, 100);
        light.position.set(3.5, 0, 10);
        light.target = this.shotRadiusIcon;

        return light;
    }

    getCamera() {
        return this.camera;
    }

    update(health, attack, shotRadius, range, speed) {

        // HEALTH
        if (health >= 0 && health <= this.maxHealth) {
            var currentHealth = this.currentHeart + 1;
            var i;
            var numHeart;

            if (health > currentHealth) {
                numHeart = this.currentHeart + 1;
                for (i = numHeart; i < health; i++) this.hearts[i].changeColor();
            } else if (health < currentHealth) {
                numHeart = this.currentHeart;
                for (i = numHeart; i >= health; i--) this.hearts[i].changeColor();
            }

            this.currentHeart = health - 1;
        }

        if (health === 1 || health === 2) {
            var tiempoActual = Date.now();
            var msTranscurridos = tiempoActual - this.tiempoAnterior;
            this.tiempoAnterior = tiempoActual;

            var scale = this.hearts[0].getScale();

            if (this.beatUp) {
                scale += this.beatingSpeed * msTranscurridos;
                if (scale > this.maxBeat) {
                    scale = this.maxBeat;
                    this.beatUp = false;
                }
            } else {
                scale -= this.beatingSpeed * msTranscurridos;
                if (scale < this.minBeat) {
                    scale = this.minBeat;
                    this.beatUp = true;
                }
            }

            if (health === 1) {
                this.hearts[0].changeScale(scale);
                this.hearts[1].changeScale(1);
            } else {
                this.hearts[0].changeScale(scale);
                this.hearts[1].changeScale(scale);
            }

        } else {
            this.hearts[0].changeScale(1);
            this.hearts[1].changeScale(1);
        }

        // ATTACK
        this.attackController.update(attack);
        this.shotRadiusController.update(shotRadius);
        this.rangeController.update(range);
        this.speedController.update(speed);
    }

}

export {InterfaceController};