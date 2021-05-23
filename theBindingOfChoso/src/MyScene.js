/*
 *
 * THE BINDING OF CHOSO
 *
 */

// Clases de la biblioteca
import * as THREE from '../libs/three.module.js'
import {GUI} from '../libs/dat.gui.module.js'
import {TrackballControls} from '../libs/TrackballControls.js'

// Clases para el ejercicio
import {MyGround} from "./MyGround.js"
import {Choso} from "./Choso.js";
import {EnemyController} from "./EnemyController.js";
import {SoundsController} from "./SoundsController.js";
import {CollisionController} from "./CollisionController.js";
import {PowerUpController} from "./PowerUpController.js";

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

        // Se añaden a la gui los controles para manipular los elementos de la clase
        this.gui = this.createGUI();

        // Construimos los distintos elementos que tendremos en la escena

        // Todo elemento que se desee sea tenido en cuenta en el renderizado de la
        // escena debe pertenecer a esta, bien como hijo de la escena (this en esta
        // clase) o como hijo de un elemento que ya esté en la escena.
        // Tras crear cada elemento se añadirá a la escena con this.add(variable).
        this.createLights();

        // Variables para el movimiento de Choso
        this.pressedA = false;
        this.pressedD = false;
        this.pressedW = false;
        this.pressedS = false;

        // Variable para el control de la zona del ratón
        this.shotDir = new THREE.Vector2(0, 0);

        // A partir de aquí, creamos los modelos necesarios para el ejercicio. Cada
        // uno incluirá su parte de interfaz gráfica, por lo que le pasamos la
        // referencia a la gui y el texto bajo el que se agruparán los controles de
        // la interfaz que añada el modelo
        this.ground = new MyGround();
        this.add(this.ground);

        this.choso = new Choso(this.ground.getMaxX(), this.ground.getMaxZ());
        this.add(this.choso);

        this.enemyController = new EnemyController(this.ground.getMaxX(), this.ground.getMaxZ());
        this.enemyController.generateEnemies();
        this.add(this.enemyController);

        this.powerupController = new PowerUpController(this.ground.getMaxX(), this.ground.getMaxZ());
        this.add(this.powerupController);

        // Tendremos una cámara con un control de movimiento con el ratón
        this.createCamera(this.choso.getPosition());
        this.soundsController = new SoundsController(this.camera);
        this.add(this.soundsController);

        this.collisionController = new CollisionController(this.ground.getMaxX(), this.ground.getMaxZ());
        this.add(this.collisionController);

    }

    createCamera(look) {
        // Para crear una cámara le indicamos:
        // - El ángulo del campo de visión en grados sexagesimales
        // - La razón de aspecto ancho/alto
        // - Los planos de recorte cercano y lejano
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight,
            0.1, 1000);
        // También se indica dónde se coloca
        this.camera.position.set(0, 15, 15);
        // Y hacia dónde mira
        this.camera.lookAt(look);
        this.add(this.camera);

        // Para el control de cámara usamos una clase que ya tiene implementados los
        // movimientos de órbita
        /*
        this.cameraControl = new TrackballControls(this.camera,
            this.renderer.domElement);


        // Se configuran las velocidades de los movimientos
        this.cameraControl.rotateSpeed = 5;
        this.cameraControl.zoomSpeed = -2;
        this.cameraControl.panSpeed = 0.5;
        // Debe orbitar con respecto al punto de mira de la cámara
        this.cameraControl.target = look;*/
    }

    createGUI() {
        // Se crea la interfaz gráfica de usuario
        var gui = new GUI();

        // La escena le va a añadir sus propios controles, que se definen mediante
        // una new function(). En este caso, la intensidad de la luz y si se
        // muestran o no los ejes
        this.guiControls = new function () {
            // En el contexto de una función, this alude a la función
            this.lightIntensity = 0.5;
        }

        // Se va a crear una sección para los controles de esta clase
        var lightFolder = gui.addFolder('Luz');

        // Se le añade un control para la intensidad de la luz
        lightFolder.add(this.guiControls, 'lightIntensity', 0, 1, 0.1).name('Intensidad de la luz : ');

        return gui;
    }

    createLights() {
        // Se crea una luz ambiental, que evita que se vean completamente negras las
        // zonas donde no incide de manera directa una fuente de luz. La luz
        // ambiental solo tiene un color y una intensidad. Se declara como var y va
        // a ser una variable local a este método, puesto que no va a ser accedida
        // desde otros métodos
        var ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
        // La añadimos a la escena
        this.add(ambientLight);

        // Se crea una luz focal que va a ser la luz principal de la escena. Esta
        // tiene una posición y un punto de mira. Si no se le da el punto de mira,
        // apuntará al (0,0,0) en coordenadas del mundo. En este caso, se declara
        // como this.atributo para que sea un atributo accesible desde otros métodos
        this.spotLight = new THREE.SpotLight(0xffffff,
            this.guiControls.lightIntensity);
        this.spotLight.position.set(60, 60, 40);
        this.add(this.spotLight);
    }

    createRenderer(myCanvas) {
        // Se recibe el lienzo sobre el que se van a hacer los renderizados (div
        // definido en el html)

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

    // En principio, se devuelve la única cámara que tenemos. Si hubiera varias,
    // este método decidiría qué camara devuelve cada vez que es consultado.
    getCamera() {
        return this.camera;
    }

    // Cada vez que el usuario modifica el tamaño de la ventana desde el gestor de
    // ventanas de su sistema operativo, hay que actualizar el ratio de aspecto de
    // la cámara.
    // Si se cambia ese dato, además hay que actualizar la matriz de proyección de
    // la cámara
    setCameraAspect(ratio) {
        this.camera.aspect = ratio;
        this.camera.updateProjectionMatrix();
    }

    // Este método es llamado cada vez que el usuario modifica el tamaño de la
    // ventana de la aplicación. Hay que actualizar el ratio de aspecto de la
    // cámara y el tamaño del renderizador.
    onWindowResize() {
        this.setCameraAspect(window.innerWidth / window.innerHeight);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    getXCoef(left, right) {
        var coef = 0;

        if (left) coef -= 1;
        if (right) coef += 1;

        return coef;
    }

    getZCoef(up, down) {
        var coef = 0;

        if (up) coef -= 1;
        if (down) coef += 1;

        return coef;
    }

    getCameraPosition(pos) {
        var defPos = new THREE.Vector3(0, 15, 15);

        var x = defPos.x + pos.x;
        var y = defPos.y + pos.y;
        var z = defPos.z + pos.z;

        return (new THREE.Vector3(x, y, z));
    }

    // Se actualizan los elementos de la escena para cada frame
    update() {
        // Se actualiza la intensidad de la luz con lo que haya indicado el usuario
        // en la GUI
        this.spotLight.intensity = this.guiControls.lightIntensity;
        this.ground.update();

        // Se actualiza la posición de la cámara según su controlador
        //this.cameraControl.update();

        // Se actualizan el resto de los modelos
        var dirX = this.getXCoef(this.pressedA, this.pressedD);
        var dirZ = this.getZCoef(this.pressedW, this.pressedS);

        this.soundsController.playChosoShootingSound(this.shooting);

        var targets = this.enemyController.getEnemies();

        this.choso.update(dirX, dirZ, this.shooting, this.shotDir, targets);

        var posChoso = this.choso.getPosition();

        var newCameraPos = this.getCameraPosition(posChoso);
        this.camera.position.set(newCameraPos.x, newCameraPos.y, newCameraPos.z); // SET

        this.powerupController.update(this.choso);

        this.enemyController.update(this.choso, this.soundsController);

        targets = this.enemyController.getEnemies();
        this.collisionController.collisionEnemiesChoso(targets, this.choso, this.soundsController);

        if(this.choso.isDefeated()) {
            this.choso.hide();
            this.choso.setSpeed(0);
            this.soundsController.stopBackground();
        }

        // Le decimos al renderizador 'visualiza la escena que te indico usando la
        // cámara que te estoy pasando'
        this.renderer.render(this, this.getCamera());

        // Este método debe ser llamado cada vez que queramos visualizar la escena
        // de nuevo. Literalmente le decimos al nevagador: 'la próxima vez que haya
        // que refrescar la pantalla, llama al método que te indico'. Si no
        // existiera esta línea, update() se ejecutaría sólo la primera vez.
        requestAnimationFrame(() => this.update());
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
                if(down) this.soundsController.changeBackground();
                break;

            default:
                console.log(event.keyCode);
                break;
        }
    }

    getMousePos(event) {
        var mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (1 - 2 * (event.clientY / window.innerHeight));
        return mouse.normalize();
    }

    // Controlador de eventos del ratón
    mouseClickController(event, down) {
        if (event.button === 0) {
            this.shooting = down;
        }
    }

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
