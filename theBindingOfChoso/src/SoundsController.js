import * as THREE from '../libs/three.module.js'

class SoundsController extends THREE.Object3D {

    constructor(camera) {
        super();

        var backgroundPath = '../sounds/background.ogg';
        var chosoShootingPath = '../sounds/chosoShooting.mp3';
        var wolfDeathPath = '../sounds/sadWolf.ogg';
        var beeDeathPath = '../sounds/sadBee.ogg';
        var bearDeathPath = '../sounds/sadBear.ogg';
        var chosoHitPath = '../sounds/sadCow.ogg';
        var chosoDeathPath = '../sounds/chososDeath.ogg';
        var powerUpPath = '../sounds/powerup.mp3';
        var trapPath = '../sounds/trap.ogg';

        const listener = new THREE.AudioListener();
        camera.add(listener);

// create a global audio source
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

// load a sound and set it as the Audio object's buffer
        const audioLoader = new THREE.AudioLoader();

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

        audioLoader.load(bearDeathPath, function(buffer) {
            that.bearDeathSound.setBuffer(buffer);
            that.bearDeathSound.setVolume(0.5);
        });

        audioLoader.load(powerUpPath, function(buffer) {
            that.powerUpSound.setBuffer(buffer);
            that.powerUpSound.setVolume(0.5);
        });

        audioLoader.load(trapPath, function(buffer) {
            that.trapSound.setBuffer(buffer);
            that.trapSound.setVolume(1);
        });

    }

    changeBackgroundSpeed(numWave) {
        if(numWave <= 1) this.backgroundMusic.playbackRate = 1.0;
        else if(numWave === 2) this.backgroundMusic.playbackRate = 1.1;
        else if(numwave === 3) this.backgroundMusic.playbackRate = 1.2;
        else this.backgroundMusic.playbackRate = 1.3;
    }

    changeBackground() {
        if (this.backgroundMusic.isPlaying) {
            this.backgroundMusic.stop();
        } else {
            this.backgroundMusic.play();
        }
    }

    playChosoShootingSound(boolean) {
        if (boolean) {
            if (!this.chosoShootingSound.isPlaying)
                this.chosoShootingSound.play();
        } else {
            if (this.chosoShootingSound.isPlaying)
                this.chosoShootingSound.stop();
        }
    }

    stopBackground() {
        if (this.backgroundMusic.isPlaying)
            this.backgroundMusic.stop();
    }

    playWolfDeath() {
        if (this.wolfDeathSound.isPlaying)
            this.wolfDeathSound.stop();

        this.wolfDeathSound.play();
    }

    playBeeDeath() {
        if (this.beeDeathSound.isPlaying)
            this.beeDeathSound.stop();

        this.beeDeathSound.play();
    }

    playBearDeath() {
        if (this.bearDeathSound.isPlaying)
            this.bearDeathSound.stop();

        this.bearDeathSound.play();
    }

    playChosoDamage() {
        if (this.chosoHitSound.isPlaying)
            this.chosoHitSound.stop();

        this.chosoHitSound.play();
    }

    playChosoDeath() {
        this.chosoDeathSound.play();
    }

    playPowerUpSound() {
        if (this.powerUpSound.isPlaying)
            this.powerUpSound.stop();

        this.powerUpSound.play();
    }

    playTrapSound() {
        if (this.trapSound.isPlaying)
            this.trapSound.stop();

        this.trapSound.play();
    }

}

export {SoundsController};