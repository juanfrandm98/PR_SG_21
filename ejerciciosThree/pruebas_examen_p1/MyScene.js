/*
 * EJERCICIO 9. RECORRIDOS
 *
 * El vídeo recorridos.mp4 muestra un camino en forma de 8, definido mediante un
 * spline. Una nave recorre dicho camino cíclicamente con los siguientes
 * parámetros:
 * - En recorrer el bucle de la derecha emplea 4 segundos.
 * - En recorrer el bucle de la izquierda emplea 8 segundos.
 * - Cada bucle lo recorre empezando lento y acabando lento, por eso se aprecia
 *   una pequeña parada cada vez que pasa por el eje Y del sistema de
 *   coordenadas.
 *
 * Diseñar e implementar una aplicación similar a esta.
 *
 * Se trata de un ejercicio bastante completo ya que supone definir un
 * movimiento como una composición de 2 animaciones consecutivas, cada una de
 * ellas con un principio, un final y un tiempo empleado. Además de tener que
 * programar la velocidad para que el recorrido de cada bucle lo haga lento al
 * salir y lento al llegar.
 *
 */

// Clases de la biblioteca
import * as THREE from '../libs/three.module.js'
import {GUI} from '../libs/dat.gui.module.js'
import {TrackballControls} from '../libs/TrackballControls.js'

// Clases para el ejercicio
import {MyBolaSaltarina} from "./MyBolaSaltarina.js"
import {MyBolaHelicoide} from "./MyBolaHelicoide.js";
import {MyBolaElipse} from "./MyBolaElipse.js";

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
        /*
        this.bolaSaltarina = new MyBolaSaltarina(this.gui);
        this.add(this.bolaSaltarina);

        this.bolaHelicoide = new MyBolaHelicoide(this.gui);
        this.bolaHelicoide.position.y = 30;
        this.add(this.bolaHelicoide);*/

        this.axis = new THREE.AxisHelper(5);
        this.add(this.axis);

        this.bolaElipse = new MyBolaElipse(this.gui);
        //this.bolaElipse.position.y = -10;
        this.add(this.bolaElipse);

    }

    createCamera() {
        // Para crear una cámara le indicamos:
        // - El ángulo del campo de visión en grados sexagesimales
        // - La razón de aspecto ancho/alto
        // - Los planos de recorte cercano y lejano
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight,
            0.1, 1000);
        // También se indica dónde se coloca
        this.camera.position.set(20, 10, 20);
        // Y hacia dónde mira
        var look = new THREE.Vector3(0, 0, 0);
        this.camera.lookAt(look);
        this.add(this.camera);

        // Para el control de cámara usamos una clase que ya tiene implementados los
        // movimientos de órbita
        this.cameraControl = new TrackballControls(this.camera,
            this.renderer.domElement);
        // Se configuran las velocidades de los movimientos
        this.cameraControl.rotateSpeed = 5;
        this.cameraControl.zoomSpeed = -2;
        this.cameraControl.panSpeed = 0.5;
        // Debe orbitar con respecto al punto de mira de la cámara
        this.cameraControl.target = look;
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
        this.cameraControl.update();

        // Se actualizan el resto de los modelos
        //this.bolaSaltarina.update();
        //this.bolaHelicoide.update();
        this.bolaElipse.update();

        // Le decimos al renderizador 'visualiza la escena que te indico usando la
        // cámara que te estoy pasando'
        this.renderer.render(this, this.getCamera());

        // Este método debe ser llamado cada vez que queramos visualizar la escena
        // de nuevo. Literalmente le decimos al nevagador: 'la próxima vez que haya
        // que refrescar la pantalla, llama al método que te indico'. Si no
        // existiera esta línea, update() se ejecutaría sólo la primera vez.
        requestAnimationFrame(() => this.update());
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

    // Que no se nos olvide, la primera visualización
    scene.update();

});
