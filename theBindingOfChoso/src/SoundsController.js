import * as THREE from '../libs/three.module.js'

class SoundsController extends THREE.Object3D {

    constructor(camera) {
        super();

        // Rutas de las pistas
        var backgroundPath = '../sounds/background.ogg';
        var chosoShootingPath = '../sounds/chosoShooting.mp3';
        var wolfDeathPath = '../sounds/sadWolf.ogg';
        var beeDeathPath = '../sounds/sadBee.ogg';
        var bearDeathPath = '../sounds/sadBear.ogg';
        var chosoHitPath = '../sounds/sadCow.ogg';
        var chosoDeathPath = '../sounds/chososDeath.ogg';
        var powerUpPath = '../sounds/powerup.mp3';
        var trapPath = '../sounds/trap.ogg';

        // Listener
        const listener = new THREE.AudioListener();
        camera.add(listener);

        // Creación de los distintos objetos que controlan cada pista
        this.backgroundMusic = new THREE.Audio(listener);
        this.backgroundMusic.hasPlaybackControl = true;

        this.chosoShootingSound = new THREE.Audio(listener);
        this.chosoShootingSound.hasPlaybackControl = true;

        this.wolfDeathSound = new THREE.Audio(listener);
        this.wolfDeathSound.hasPlaybackControl = true;

        this.beeDeathSound = new THREE.Audio(listener);
        this.beeDeathSound.hasPlaybackControl = true;

        this.chosoHitSound = new THREE.Audio(listener);
        this.chosoHitSound.hasPlaybackControl = true;

        this.chosoDeathSound = new THREE.Audio(listener);
        this.chosoDeathSound.hasPlaybackControl = true;

        this.bearDeathSound = new THREE.Audio(listener);
        this.bearDeathSound.hasPlaybackControl = true;

        this.powerUpSound = new THREE.Audio(listener);
        this.powerUpSound.hasPlaybackControl = true;

        this.trapSound = new THREE.Audio(listener);
        this.trapSound.hasPlaybackControl = true;

        // Audio Loader
        const audioLoader = new THREE.AudioLoader();

        // Configuración de las pistas
        var that = this;
        audioLoader.load(backgroundPath, function (buffer) {
            that.backgroundMusic.setBuffer(buffer);
            that.backgroundMusic.setLoop(true);
            that.backgroundMusic.setVolume(0.5);
            that.backgroundMusic.play();
        });

        audioLoader.load(chosoShootingPath, function (buffer) {
            that.chosoShootingSound.setBuffer(buffer);
            that.chosoShootingSound.setLoop(true);
            that.chosoShootingSound.setVolume(0.5);
        });

        audioLoader.load(wolfDeathPath, function (buffer) {
            that.wolfDeathSound.setBuffer(buffer);
            that.wolfDeathSound.setVolume(0.5);
        });

        audioLoader.load(chosoHitPath, function (buffer) {
            that.chosoHitSound.setBuffer(buffer);
            that.chosoHitSound.setVolume(0.5);
        });

        audioLoader.load(chosoDeathPath, function (buffer) {
            that.chosoDeathSound.setBuffer(buffer);
            that.chosoDeathSound.setVolume(0.75);
        });

        audioLoader.load(beeDeathPath, function (buffer) {
            that.beeDeathSound.setBuffer(buffer);
            that.beeDeathSound.setVolume(0.8);
        });

        audioLoader.load(bearDeathPath, function (buffer) {
            that.bearDeathSound.setBuffer(buffer);
            that.bearDeathSound.setVolume(0.5);
        });

        audioLoader.load(powerUpPath, function (buffer) {
            that.powerUpSound.setBuffer(buffer);
            that.powerUpSound.setVolume(0.5);
        });

        audioLoader.load(trapPath, function (buffer) {
            that.trapSound.setBuffer(buffer);
            that.trapSound.setVolume(1);
        });

    }

    // Cambia la velocidad de reproducción de la música de fondo, para ir
    // incrementándola conforme avanzan las olas
    changeBackgroundSpeed(numWave) {
        if (numWave <= 1) this.backgroundMusic.setPlaybackRate(1.0);
        else if (numWave === 2) this.backgroundMusic.setPlaybackRate(1.1);
        else if (numWave === 3) this.backgroundMusic.setPlaybackRate(1.2);
        else this.backgroundMusic.setPlaybackRate(1.3);

        console.log(numWave + " - " + this.backgroundMusic.playbackRate);
    }

    // (Des)activa la música de fondo
    changeBackground() {
        if (this.backgroundMusic.isPlaying) {
            this.backgroundMusic.stop();
        } else {
            this.backgroundMusic.play();
        }
    }

    // (Des)activa el sonido de disparo
    playChosoShootingSound(boolean) {
        if (boolean) {
            if (!this.chosoShootingSound.isPlaying)
                this.chosoShootingSound.play();
        } else {
            if (this.chosoShootingSound.isPlaying)
                this.chosoShootingSound.stop();
        }
    }

    // Para la música de fondo
    stopBackground() {
        if (this.backgroundMusic.isPlaying)
            this.backgroundMusic.stop();
    }

    // Reproduce el sonido de muerte de los lobos
    playWolfDeath() {
        if (this.wolfDeathSound.isPlaying)
            this.wolfDeathSound.stop();

        this.wolfDeathSound.play();
    }

    // Reproduce el sonido de muerte de las abejas
    playBeeDeath() {
        if (this.beeDeathSound.isPlaying)
            this.beeDeathSound.stop();

        this.beeDeathSound.play();
    }

    // Reproduce el sonido de muerte de los osos
    playBearDeath() {
        if (this.bearDeathSound.isPlaying)
            this.bearDeathSound.stop();

        this.bearDeathSound.play();
    }

    // Reproduce el sonido de Choso recibiendo daño
    playChosoDamage() {
        if (this.chosoHitSound.isPlaying)
            this.chosoHitSound.stop();

        this.chosoHitSound.play();
    }

    // Reproduce el sonido de muerte de Choso
    playChosoDeath() {
        this.chosoDeathSound.play();
    }

    // Reproduce el sonido de obtención de powerup positivo
    playPowerUpSound() {
        if (this.powerUpSound.isPlaying)
            this.powerUpSound.stop();

        this.powerUpSound.play();
    }

    // Reproduce el sonido de activación de trampa
    playTrapSound() {
        if (this.trapSound.isPlaying)
            this.trapSound.stop();

        this.trapSound.play();
    }

}

export {SoundsController};