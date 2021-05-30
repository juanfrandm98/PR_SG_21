import * as THREE from '../libs/three.module.js'

class LightsController extends THREE.Object3D {

    constructor() {
        super();

        this.ambientLight = new THREE.AmbientLight(0xccddee, 0.15);
        this.ambientHighIntensity = 0.25;
        this.add(this.ambientLight);

        this.sunIntensity = 0.8;
        this.minLightAngle = Math.PI / 2;
        this.maxLightAngle = 3 * Math.PI / 2;

        this.sunLight = new THREE.DirectionalLight(0xffffff, this.sunIntensity);
        this.sunLight.position.set(0, -150, 0);
        this.sunLight.castShadow = true;

        this.sunLightNode = new THREE.Object3D();
        this.sunLightNode.add(this.sunLight);
        this.add(this.sunLightNode);

        this.sunLightNode.rotation.z = this.minLightAngle + Math.PI / 4;

        this.deathLight = new THREE.DirectionalLight(0xff0000, 1);
        this.deathLight.visible = false;
        this.add(this.deathLight);

        this.tiempoAnterior = Date.now();
        this.lightSpeed = 0.0001;

        this.nightTime = 10000;
        this.currentNightTime = 0;
    }

    activateDeathLights(choso) {
        this.deathLight.visible = true;
        this.ambientLight.intensity = this.ambientHighIntensity;
        this.sunLight.visible = false;
    }

    update() {
        if(!this.deathLight.visible) {
            var tiempoActual = Date.now();
            var msTranscurridos = tiempoActual - this.tiempoAnterior;
            this.tiempoAnterior = tiempoActual;

            if (this.sunLight.visible) {
                this.sunLightNode.rotation.z += msTranscurridos * this.lightSpeed;

                if (this.sunLightNode.rotation.z >= this.maxLightAngle) {
                    this.sunLightNode.rotation.z = this.minLightAngle;
                    this.currentNightTime = this.nightTime;
                    this.sunLight.visible = false;
                }
            } else {
                this.currentNightTime -= msTranscurridos;

                if (this.currentNightTime <= 0) this.sunLight.visible = true;
            }
        }
    }

}

export {LightsController};