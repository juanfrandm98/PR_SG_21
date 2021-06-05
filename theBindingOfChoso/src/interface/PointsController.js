import * as THREE from '../../libs/three.module.js'

class PointsController extends THREE.Object3D {

    constructor(initialPoints) {
        super();

        // Lista de puntos
        this.points = [];

        // Variables para el control de la posición de los puntos
        this.initialX = 0.5;
        this.xPerPoint = 0.5;

        // Materiales para el estado normal, de obtención y de pérdida de puntos
        this.normalMat = new THREE.MeshPhongMaterial({color: new THREE.Color(0.8, 0.8, 0.8)});
        this.gainMat = new THREE.MeshPhongMaterial({color: new THREE.Color(0, 1, 0)});
        this.lossMat = new THREE.MeshPhongMaterial({color: new THREE.Color(1, 0, 0)});

        // Creación de los puntos iniciales
        for (var i = 0; i < initialPoints; i++) {
            var newPoint = this.getPoint(this.normalMat);
            var pos = this.getPointPos(this.initialX, i, this.xPerPoint);
            newPoint.position.set(pos.x, pos.y, pos.z);
            this.points.push(newPoint);
            this.add(this.points[i]);
        }

        // Variable para contabilizar el número de puntos activos
        this.currentPoints = initialPoints;

        // Variables para la animación (cambio de color)
        this.tiempoAnterior = Date.now();
        this.tiempoParaCambio = 2000;
        this.tiempoAcumulado = 0.0;

    }

    // Generación de un nuevo punto
    getPoint(mat) {
        var geom = new THREE.BoxGeometry(0.25, 1, 0.2);

        return new THREE.Mesh(geom, mat);
    }

    // Cálculo de la posición de un nuevo punto
    getPointPos(initialX, index, xPerPoint) {
        var pos = new THREE.Vector3(0, 0, 0);
        pos.x = initialX + index * xPerPoint;
        return pos;
    }

    // Pone todos los puntos con su color por defecto
    resetColors(array, mat) {
        for (var i = 0; i < array.length; i++)
            array[i].material = mat;
    }

    // Actualiza el estado de los puntos con la nueva cantidad
    update(points) {
        // Comprueba el tiempo transcurrido tras una modificación
        if (this.tiempoAcumulado > 0) {
            var tiempoActual = Date.now();
            this.tiempoAcumulado -= tiempoActual - this.tiempoAnterior;
            this.tiempoAnterior = tiempoActual;
        }

        // Si ha pasado suficiente tiempo tras una modificación, resetea los
        // colores
        if (this.tiempoAcumulado <= 0) {
            this.tiempoAcumulado = 0.0;
            this.resetColors(this.points, this.normalMat);
        }

        // Si el número de puntos ha cambiado, gestiona la nueva cantidad
        if (points >= 0 && points !== this.currentPoints) {
            var i;

            this.resetColors(this.points, this.normalMat);

            if (points > this.currentPoints) {
                for (i = this.currentPoints; i < points; i++) {
                    if (i < this.points.length) {
                        console.log(i);
                        this.points[i].material = this.gainMat;
                        this.tiempoAcumulado = this.tiempoParaCambio;
                        this.tiempoAnterior = Date.now();
                        this.points[i].visible = true;
                    } else {
                        var newPoint = this.getPoint(this.gainMat);
                        this.tiempoAcumulado = this.tiempoParaCambio;
                        this.tiempoAnterior = Date.now();
                        var pos = this.getPointPos(this.initialX, i, this.xPerPoint);
                        newPoint.position.set(pos.x, pos.y, pos.z);
                        this.points.push(newPoint);
                        this.add(this.points[i]);
                    }
                }
            } else {
                for (i = this.currentPoints - 1; i >= points; i--) {
                    this.points[i].visible = false;
                }

                if (this.points.length > 0) {
                    this.points[points - 1].material = this.lossMat;
                    this.tiempoAcumulado = this.tiempoParaCambio;
                    this.tiempoAnterior = Date.now();
                }
            }

            this.currentPoints = points;
        }
    }

}

export {PointsController};