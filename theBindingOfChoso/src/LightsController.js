import * as THREE from '../libs/three.module.js'

class LightsController extends THREE.Object3D {

    constructor() {
        super();

        // Luz ambiental
        this.ambientLight = new THREE.AmbientLight(0xccddee, 0.15);
        this.ambientHighIntensity = 0.25;
        this.add(this.ambientLight);

        // Luz "solar"
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

        // Luz para la derrota
        this.deathLight = new THREE.DirectionalLight(0xff0000, 1);
        this.deathLight.visible = false;
        this.add(this.deathLight);

        // Variables para la animación
        this.tiempoAnterior = Date.now();
        this.lightSpeed = 0.0001;

        this.minNightTime = 10000;
        this.maxNightTime = 15000;
        this.nightTime = this.minNightTime;

        this.currentNightTime = 0;
    }

    // Configura las luces para la derrota, "apagando" la del sol y "encendiendo"
    // la roja
    activateDeathLights() {
        this.deathLight.visible = true;
        this.ambientLight.intensity = this.ambientHighIntensity;
        this.sunLight.visible = false;
    }

    // Establece la dificultad, aumentando la duración del periodo de noche
    changeDifficulty(numWave) {
        var newNightTime = this.minNightTime + (numWave - 1) * 1000;

        if (newNightTime > this.maxNightTime) newNightTime = this.maxNightTime;

        this.nightTime = newNightTime;
    }

    // Actualiza el controlador, moviendo la luz del sol por el día o
    // cronometrando la noche, si no está encendida la luz de derrota.
    update() {
        if (!this.deathLight.visible) {
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