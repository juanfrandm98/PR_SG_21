import * as THREE from '../libs/three.module.js'

class SoundsController extends THREE.Object3D {

    constructor(camera) {
        super();

        var backgroundPath = '../sounds/background.ogg';
        var chosoShootingPath = '../sounds/chosoShooting.mp3';

        const listener = new THREE.AudioListener();
        camera.add( listener );

// create a global audio source
        this.backgroundMusic = new THREE.Audio( listener );
        this.backgroundMusic.hasPlaybackControl = true;

        this.chosoShootingSound = new THREE.Audio( listener );
        this.chosoShootingSound.hasPlaybackControl = true;

// load a sound and set it as the Audio object's buffer
        const audioLoader = new THREE.AudioLoader();

        var that = this;
        audioLoader.load( backgroundPath, function( buffer ) {
            that.backgroundMusic.setBuffer( buffer );
            that.backgroundMusic.setLoop( true );
            that.backgroundMusic.setVolume( 0.5 );
            that.backgroundMusic.play();
        });

        audioLoader.load( chosoShootingPath, function( buffer ) {
            that.chosoShootingSound.setBuffer( buffer );
            that.chosoShootingSound.setLoop( true );
            that.chosoShootingSound.setVolume( 0.5 );
        });

    }

    changeBackground() {
        if(this.backgroundMusic.isPlaying) {
            this.backgroundMusic.stop();
        } else {
            this.backgroundMusic.play();
        }
    }

    playChosoShootingSound(boolean) {
        if(boolean) {
            if(!this.chosoShootingSound.isPlaying)
                this.chosoShootingSound.play();
        } else {
            if(this.chosoShootingSound.isPlaying)
                this.chosoShootingSound.stop();
        }
    }

}

export {SoundsController};