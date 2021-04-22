import * as THREE from '../libs/three.module.js'

class MyPendulo extends THREE.Object3D {

    constructor(gui) {
        super();
        this.createGUI(gui);

        this.alturaMaximaAzul = -2;

        var parteVerdeGeom = new THREE.BoxGeometry(3,4,2);
        var parteRojaGeom = new THREE.BoxGeometry(3,1,2);
        var ejeGrandeGeom = new THREE.CylinderGeometry(1,1,2.5,20);
        var ejePequenioGeom = new THREE.CylinderGeometry(0.25, 0.25, 1.25, 20);
        var parteAzulGeom = new THREE.BoxGeometry(2,1,1);

        var materialVerde = new THREE.MeshPhongMaterial({color: new THREE.Color(0, 1, 0)});
        var materialRojo = new THREE.MeshPhongMaterial({color: new THREE.Color(1,0,0)});
        var materialGris = new THREE.MeshPhongMaterial({color: new THREE.Color(1,1,1)});
        var materialAzul = new THREE.MeshPhongMaterial({color: new THREE.Color(0,0,1)});

        this.parteVerdeInferior = new THREE.Mesh(parteVerdeGeom, materialVerde);
        this.parteVerdeInferior.position.y = -9;

        this.parteVerdeSuperior = new THREE.Mesh(parteVerdeGeom, materialVerde);

        this.parteRoja = new THREE.Mesh(parteRojaGeom, materialRojo);
        this.parteRoja.position.y = -0.5;

        this.ejeGrande = new THREE.Mesh(ejeGrandeGeom, materialGris);
        this.ejeGrande.rotateX(Math.PI / 2);

        this.nodoRojo = new THREE.Object3D();
        this.nodoRojo.add(this.parteRoja);
        this.nodoRojo.position.y = -2;

        this.ejePequenio = new THREE.Mesh(ejePequenioGeom, materialGris);
        this.ejePequenio.rotation.x = Math.PI / 2;
        this.ejePequenio.position.z = 0.125;

        this.parteAzul = new THREE.Mesh(parteAzulGeom, materialAzul);
        this.parteAzul.position.y = -0.5;

        this.nodoAzul = new THREE.Object3D();
        this.nodoAzul.add(this.parteAzul);
        this.nodoAzul.position.y = 1;

        this.penduloPequenio = new THREE.Object3D();
        this.penduloPequenio.add(this.nodoAzul);
        this.penduloPequenio.add(this.ejePequenio);
        this.penduloPequenio.position.z = 1.5;

        this.pendulo = new THREE.Object3D();
        this.pendulo.add(this.parteVerdeSuperior);
        this.pendulo.add(this.parteVerdeInferior);
        this.pendulo.add(this.nodoRojo);
        this.pendulo.add(this.ejeGrande);
        this.pendulo.add(this.penduloPequenio);

        this.add(this.pendulo);

    }

    createGUI(gui) {
        this.guiControls = new function () {
            this.rotationBig = 0;
            this.scaleBig = 5;
            this.rotationSmall = 0;
            this.scaleSmall = 10;
            this.positionSmall = 10;

            this.reset = function() {
                this.rotationBig = 0;
                this.scaleBig = 5;
                this.rotationSmall = 0;
                this.scaleSmall = 10;
                this.positionSmall = 10;
            }
        }

        var folderBig = gui.addFolder('Controles Péndulo Grande');
        folderBig.add(this.guiControls, 'rotationBig', -Math.PI/4, Math.PI/4, 0.1).name("Rotación : ").listen();
        folderBig.add(this.guiControls, 'scaleBig', 5, 10, 0.1).name('Tamaño pieza roja : ').listen();
        folderBig.add(this.guiControls, 'reset').name('[ Reset ]');

        var folderSmall = gui.addFolder('Controles Péndulo Pequeño');
        folderSmall.add(this.guiControls, 'rotationSmall', -Math.PI/4, Math.PI/4, 0.1).name("Rotación : ").listen();
        folderSmall.add(this.guiControls, 'scaleSmall', 10, 20, 0.1).name('Tamaño pieza azul : ').listen();
        folderSmall.add(this.guiControls, 'positionSmall', 10, 90, 1).name('Posición pieza azul : ').listen();
        folderSmall.add(this.guiControls, 'reset').name('[ Reset ]');
    }

    update() {
        this.pendulo.rotation.z = this.guiControls.rotationBig;
        this.nodoRojo.scale.y = this.guiControls.scaleBig;
        this.parteVerdeInferior.position.y = -4 - this.guiControls.scaleBig;
        this.nodoAzul.scale.y = this.guiControls.scaleSmall;
        this.penduloPequenio.rotation.z = this.guiControls.rotationSmall;
        this.penduloPequenio.position.y = this.alturaMaximaAzul - (this.guiControls.positionSmall / 100) * this.guiControls.scaleBig;
    }

}

export {MyPendulo};
