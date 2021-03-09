////////////////////////////////////////////////////////////////////////////////
//                                                                            //
//       Ejercicio 2. Geometría básica 3D                                     //
//                                                                            //
// Mediante este ejercicio, el alumno debe familiarizarse con las diferentes  //
// figuras 3D que proporciona la biblioteca THREE.JS y conocer sus            //
// principales parámetros.                                                    //
// El vídeo geometría-básica.mp4 muestra diversos ejemplos de varias figuras  //
// donde se muestran los efectos de dar diferentes valores a sus parámetros.  //
//                                                                            //
// No es necesario que el ejercicio sea como lo que se muestra en el vídeo.   //
// No es necesario que se puedan modificar las figuras interactivamente.      //
// Basta con que se muestren diferentes figuras con diferentes colores en sus //
// parámetros.                                                                //
//                                                                            //
// A tener en cuenta:                                                         //
// - Modificar una geometría ya creada implica volver a crearla. Debe         //
//   evitarse, en la medida de lo posible, crear nuevas geometrías para cada  //
//   frame ya que se dejarían muchos objetos huérfanos y debería actuar el    //
//   recolector de basura con mucha frecuencia.                               //
// - El material usado en el vídeo es MeshNormalMaterial, que asigna colores  //
//   a los polígonos según el vector normal de sus caras o vértices. El       //
//   sombreado plano o suave se consigue asignándole true o false,            //
//   respectivamente, al atributo flatShading del material. Tras modificar    //
//   dicho atributo, hay que asignar true al atributo needsUpdate del         //
//   material para que el cambio sea tenido en cuenta en el siguiente frame.  //
// - El movimiento continuo se consigue incrementando un poco la rotación de  //
//   cada figura en cada frame. Por ejemplo:                                  //
//       this.caja.rotation.y += 0.01;                                        //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////

// Clases de la biblioteca
import * as THREE from '../libs/three.module.js'
import {GUI} from '../libs/dat.gui.module.js'
import {TrackballControls} from '../libs/TrackballControls.js'

// Clases para el ejercicio
import {MyBox} from './MyBox.js'
import {MyCone} from './MyCone.js'
import {MyCylinder} from './MyCylinder.js';
import {MySphere} from './MySphere.js';
import {MyTorus} from './MyTorus.js';
import {MyIcosahedron} from "./MyIcosahedron.js";

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
        this.caja = new MyBox(this.gui, 'Controles de la Caja');
        this.add(this.caja);
        var axisCaja = new THREE.AxesHelper(5);
        this.add(axisCaja);

        this.cono = new MyCone(this.gui, 'Controles del Cono');
        this.add(this.cono);
        this.cono.position.x += 10;
        var axisCono = new THREE.AxesHelper(5);
        axisCono.position.x += 10;
        this.add(axisCono);

        this.cilindro = new MyCylinder(this.gui, 'Controles del Cilindro');
        this.add(this.cilindro);
        this.cilindro.position.z += 10;
        var axisCylinder = new THREE.AxesHelper(5);
        axisCylinder.position.z += 10;
        this.add(axisCylinder);

        this.sphere = new MySphere(this.gui, 'Controles de la Esfera');
        this.add(this.sphere);
        this.sphere.position.z -= 10;
        var axisSphere = new THREE.AxesHelper(5);
        axisSphere.position.z -= 10;
        this.add(axisSphere);

        this.torus = new MyTorus(this.gui, 'Controles del Toro');
        this.add(this.torus);
        this.torus.position.x += 10;
        this.torus.position.z += 10;
        var axisTorus = new THREE.AxesHelper(5);
        axisTorus.position.x += 10;
        axisTorus.position.z += 10;
        this.add(axisTorus);

        this.icosahedron = new MyIcosahedron(this.gui, 'Controles del Icosaedro');
        this.add(this.icosahedron);
        this.icosahedron.position.x += 10;
        this.icosahedron.position.z -= 10;
        var axisIcosahedron = new THREE.AxesHelper(5);
        axisIcosahedron.position.x += 10;
        axisIcosahedron.position.z -= 10;
        this.add(axisIcosahedron);

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
        var folder = gui.addFolder('Luz');

        // Se le añade un control para la intensidad de la luz
        folder.add(this.guiControls, 'lightIntensity', 0, 1, 0.1).name('Intensidad de la luz : ');

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
        this.caja.update();
        this.cono.update();
        this.cilindro.update();
        this.sphere.update();
        this.torus.update();
        this.icosahedron.update();

        // Rotaciones automáticas
        this.caja.rotation.x += 0.01;
        this.caja.rotation.y += 0.01;
        this.caja.rotation.z += 0.01;
        this.cono.rotation.x += 0.01;
        this.cono.rotation.y += 0.01;
        this.cono.rotation.z += 0.01;
        this.cilindro.rotation.x += 0.01;
        this.cilindro.rotation.y += 0.01;
        this.cilindro.rotation.z += 0.01;
        this.sphere.rotation.x += 0.01;
        this.sphere.rotation.y += 0.01;
        this.sphere.rotation.z += 0.01;
        this.torus.rotation.x += 0.01;
        this.torus.rotation.y += 0.01;
        this.torus.rotation.z += 0.01;
        this.icosahedron.rotation.x += 0.01;
        this.icosahedron.rotation.y += 0.01;
        this.icosahedron.rotation.z += 0.01;

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
