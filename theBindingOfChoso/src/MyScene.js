/*
 *
 * THE BINDING OF CHOSO
 *
 */

// Clases de la biblioteca
import * as THREE from '../libs/three.module.js'

// Clases para el ejercicio
import {MyGround} from "./MyGround.js"
import {Choso} from "./characters/Choso.js";
import {EnemyController} from "./characters/EnemyController.js";
import {SoundsController} from "./SoundsController.js";
import {CollisionController} from "./CollisionController.js";
import {PowerUpController} from "./powerups/PowerUpController.js";
import {InterfaceController} from "./interface/InterfaceController.js";
import {LightsController} from "./LightsController.js";

/// La clase fachada del modelo
/**
 * Usaremos una clase derivada de la clase Scene de Three.js para llevar el
 * control de la escena y de todo lo que ocurre en ella.
 */
class MyScene extends THREE.Scene {

    constructor(myCanvas) {
        super();

        // Lo primero, crear el visualizador, pasándole el lienzo sobre el que
        // realizar los renderizados
        this.renderer = this.createRenderer(myCanvas);

        // Variables para el movimiento de Choso
        this.pressedA = false;
        this.pressedD = false;
        this.pressedW = false;
        this.pressedS = false;

        // Variable para el control de la zona del ratón
        this.shotDir = new THREE.Vector2(0, 0);

        // Terreno de juego
        this.ground = new MyGround();
        this.add(this.ground);

        // Protagonista
        this.choso = new Choso(this.ground.getMaxX(), this.ground.getMaxZ());
        this.add(this.choso);

        // Controlador de enemigos
        this.enemyController = new EnemyController(this.ground.getMaxX(), this.ground.getMaxZ());
        this.add(this.enemyController);

        // Controlador de powerups
        this.powerupController = new PowerUpController(this.ground.getMaxX(), this.ground.getMaxZ());
        this.add(this.powerupController);

        // Controlador de sonidos
        this.soundsController = new SoundsController(this.choso.getCamera());
        this.add(this.soundsController);

        // Controlador de colisiones
        this.collisionController = new CollisionController(this.ground.getMaxX(), this.ground.getMaxZ());
        this.add(this.collisionController);

        // Controlador de luces
        this.lightsController = new LightsController();
        this.add(this.lightsController);

        // Controlador de la interfaz
        this.interfaceController = new InterfaceController(
            this.choso.getMaxHealth(),
            this.choso.getAttack(),
            Math.round(this.choso.getShootingRadius() * 10),
            Math.round(this.choso.getRange() / 5),
            this.choso.getSpeed() - 5
        );
        this.interfaceController.position.y = -1000;
        this.add(this.interfaceController);

    }

    createRenderer(myCanvas) {
        // Se instancia un Renderer WebGL
        var renderer = new THREE.WebGLRenderer();

        // Se establece un color de fondo en las imágenes que genera el render
        renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);

        // Se establece el tamaño, aprovechando la totalidad de la ventana del
        // navegador
        renderer.setSize(window.innerWidth, window.innerHeight);

        // La visualización se muestra en el lienzo recibido
        $(myCanvas).append(renderer.domElement);

        return renderer;
    }

    // Cada vez que el usuario modifica el tamaño de la ventana desde el gestor de
    // ventanas de su sistema operativo, hay que actualizar el ratio de aspecto de
    // la cámara.
    // Si se cambia ese dato, además hay que actualizar la matriz de proyección de
    // la cámara
    setCameraAspect(ratio) {
        this.choso.getCamera().aspect = ratio;
        this.choso.getCamera().updateProjectionMatrix();
    }

    // Este método es llamado cada vez que el usuario modifica el tamaño de la
    // ventana de la aplicación. Hay que actualizar el ratio de aspecto de la
    // cámara y el tamaño del renderizador.
    onWindowResize() {
        this.setCameraAspect(window.innerWidth / window.innerHeight);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // Proporciona la dirección de disparo en el eje X en función de la posición
    // del ratón.
    getXCoef(left, right) {
        var coef = 0;

        if (left) coef -= 1;
        if (right) coef += 1;

        return coef;
    }

    // Proporciona la dirección de disparo en el eje Z en función de la posición
    // del ratón.
    getZCoef(up, down) {
        var coef = 0;

        if (up) coef -= 1;
        if (down) coef += 1;

        return coef;
    }

    // Se actualizan los elementos de la escena para cada frame
    update() {
        this.ground.update();

        // Obtención de la dirección de disparo de Choso
        var dirX = this.getXCoef(this.pressedA, this.pressedD);
        var dirZ = this.getZCoef(this.pressedW, this.pressedS);

        // Obtención de los enemigos activos para los disparos de Choso
        var targets = this.enemyController.getEnemies();

        // Actualización de Choso
        this.choso.update(dirX, dirZ, this.shooting, this.shotDir, targets);

        // Actualización de los powerups y de los enemigos
        this.powerupController.update(this.choso, this.soundsController);
        this.enemyController.update(this.choso, this.soundsController);

        // Obtención de los enemigos activos de nuevo, para no incluir a los que
        // acaban de ser eliminados por Choso
        targets = this.enemyController.getEnemies();

        // Controlador de colisiones físicas entre los enemigos y Choso
        this.collisionController.collisionEnemiesChoso(targets, this.choso, this.soundsController);

        // Actualización de la interfaz
        this.interfaceController.update(
            this.choso.getHealth(),
            this.choso.getAttack(),
            Math.round(this.choso.getShootingRadius() * 10),
            Math.round(this.choso.getRange() / 5),
            this.choso.getSpeed() - 5
        );

        // Actualización de la luz
        this.lightsController.update();

        // Si el controlador de enemigos se acaba de pausar (se ha pasado de ola
        // en este ciclo) se modifica la dificultad del juego
        if (this.enemyController.getJustPaused()) {
            var numWave = this.enemyController.getNumWave();

            this.choso.changeDifficulty(numWave);
            this.lightsController.changeDifficulty(numWave);
            this.powerupController.changeDifficulty(numWave);
            this.enemyController.changeDifficulty(numWave);
            this.soundsController.changeBackgroundSpeed(numWave);
        }

        // Si Choso acaba de ser derrotado, se pasa a estado de derrota; si no,
        // se comprueba la reproducción de la música de disparo
        if (this.choso.isDefeated()) {
            this.choso.setSpeed(0);
            this.soundsController.stopBackground();
            this.soundsController.playChosoShootingSound(false);
            this.lightsController.activateDeathLights(this.choso);
        } else {
            this.soundsController.playChosoShootingSound(this.shooting);
        }

        // Le decimos al renderizador 'visualiza la escena que te indico usando
        // las cámaras que te estoy pasando'
        this.renderViewPort(this, this.choso.getCamera(), 0.2, 0, 0.8, 1);
        this.renderViewPort(this, this.interfaceController.getCamera(), 0, 0, 0.2, 1);

        // Este método debe ser llamado cada vez que queramos visualizar la escena
        // de nuevo. Literalmente le decimos al nevagador: 'la próxima vez que haya
        // que refrescar la pantalla, llama al método que te indico'. Si no
        // existiera esta línea, update() se ejecutaría sólo la primera vez.
        requestAnimationFrame(() => this.update());
    }

    // Renderiza un viewport en la posición y con las características indicadas
    renderViewPort(escena, camara, left, top, width, height) {
        var l = left * window.innerWidth;
        var w = width * window.innerWidth;
        var t = top * window.innerHeight;
        var h = height * window.innerHeight;

        this.renderer.setViewport(l, t, w, h);
        this.renderer.setScissor(l, t, w, h);
        this.renderer.setScissorTest(true);

        camara.aspect = w / h;
        camara.updateProjectionMatrix();

        this.renderer.render(escena, camara);
    }

    // Controlador de eventos de teclado
    keyboardController(event, down) {
        switch (event.keyCode) {
            case 65:
                if (down) this.pressedA = true;
                else this.pressedA = false;
                break;

            case 68:
                if (down) this.pressedD = true;
                else this.pressedD = false;
                break;

            case 87:
                if (down) this.pressedW = true;
                else this.pressedW = false;
                break;

            case 83:
                if (down) this.pressedS = true;
                else this.pressedS = false;
                break;

            case 77:
                if (down) this.soundsController.changeBackground();
                break;

            default:
                console.log(event.keyCode);
                break;
        }
    }

    // Obtención de la posición del ratón. El 0.2 es para la posición teniendo
    // en cuenta el fragmento de pantalla de la interfaz
    getMousePos(event) {
        var mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.x -= 0.2;
        mouse.y = -(1 - 2 * (event.clientY / window.innerHeight));
        return mouse.normalize();
    }

    // Controlador de eventos del ratón
    mouseClickController(event, down) {
        if (event.button === 0) {
            this.shooting = down;
        }
    }

    // Controlador de la posición del ratón
    mousePosController(event) {
        this.shotDir = this.getMousePos(event);
    }

}

/// La función MAIN
$(function () {

    // Se instancia la escena pasándole el div que se ha creado en el html para
    // visualizar
    var scene = new MyScene('#WebGL-output');

    // Se añaden los listener de la aplicación. En este caso, el que va a
    // comprobar cuándo se modifica el tamaño de la ventana de la aplicación
    window.addEventListener('resize', () => scene.onWindowResize());
    window.addEventListener('keydown', (event) => scene.keyboardController(event, true));
    window.addEventListener('keyup', (event) => scene.keyboardController(event, false));
    window.addEventListener('mousedown', (event) => {
        scene.mousePosController(event);
        scene.mouseClickController(event, true);
    });
    window.addEventListener('mouseup', (event) => scene.mouseClickController(event, false));
    window.addEventListener('mousemove', (event) => scene.mousePosController(event));

    // Que no se nos olvide, la primera visualización
    scene.update();

});
