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
import {ShootsController} from "./ShootsController.js";
import {Bee} from "./Bee.js";
import {Wolf} from "./Wolf.js";

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

        // Tendremos una cámara con un control de movimiento con el ratón
        this.createCamera();

        // A partir de aquí, creamos los modelos necesarios para el ejercicio. Cada
        // uno incluirá su parte de interfaz gráfica, por lo que le pasamos la
        // referencia a la gui y el texto bajo el que se agruparán los controles de
        // la interfaz que añada el modelo
        this.choso = new Choso();
        this.add(this.choso);

        this.ground = new MyGround();
        this.add(this.ground);

        this.shootsController = new ShootsController(10, this.choso.getShootSpeed(), this.choso.getShootRadius());
        this.add(this.shootsController);

        this.bee = new Bee(new THREE.Vector3(50,0,0));
        this.add(this.bee);

        this.wolf = new Wolf(new THREE.Vector3(-50, 0, 0));
        this.add(this.wolf);

    }

    createCamera() {
        // Para crear una cámara le indicamos:
        // - El ángulo del campo de visión en grados sexagesimales
        // - La razón de aspecto ancho/alto
        // - Los planos de recorte cercano y lejano
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight,
            0.1, 1000);
        // También se indica dónde se coloca
        this.camera.position.set(0, 25, 45);
        // Y hacia dónde mira
        var look = new THREE.Vector3(0, 0, 0);
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

    // Se actualizan los elementos de la escena para cada frame
    update() {
        // Se actualiza la intensidad de la luz con lo que haya indicado el usuario
        // en la GUI
        this.spotLight.intensity = this.guiControls.lightIntensity;

        // Se actualiza la posición de la cámara según su controlador
        //this.cameraControl.update();
        this.shootsController.update();

        // Se actualizan el resto de los modelos
        this.bee.update();
        this.wolf.update(this.choso.getPosition());

        var targets = [this.bee];
        this.shootsController.checkCollision(targets);

        //console.log(this.bee.isDefeated());
        if(this.bee.isDefeated()) this.bee.delete();

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
    keyboardController(event) {
        // Tecla 'a': movimiento de Choso hacia la izquierda
        if(event.keyCode == "97") this.choso.move("left");

        // Tecla 'd': movimiento de Choso hacia la derecha
        if(event.keyCode == "100") this.choso.move("right");

        // Tecla 'w': movimiento de Choso hacia arriba
        if(event.keyCode == "119") this.choso.move("up");

        // Tecla 's': movimiento de Choso hacia abajo
        if(event.keyCode == "115") this.choso.move("down");
    }

    getMousePos(event) {
        var mouse = new THREE.Vector3();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.z = 1 - 2 * (event.clientY / window.innerHeight);
        mouse.y = 0;
        return mouse;
    }

    // Controlador de eventos del ratón
    mouseController(event) {
        if(event.button === 0) {
            var pos = this.choso.getPosition();
            var origin = new THREE.Vector3(pos.x, pos.y, pos.z);
            var destiny = this.getMousePos(event);
            this.shootsController.shoot(origin, destiny);
        }
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
    window.addEventListener('keypress', (event) => scene.keyboardController(event));
    window.addEventListener('mousedown', (event) => scene.mouseController(event));

    // Que no se nos olvide, la primera visualización
    scene.update();

});
