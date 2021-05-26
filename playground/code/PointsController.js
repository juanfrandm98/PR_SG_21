import * as THREE from '../libs/three.module.js'

class PointsController extends THREE.Object3D {

    constructor(initialPoints) {
        super();

        this.points = [];
        this.initialX = 0.5;
        this.xPerPoint = 0.5;

        this.normalMat = new THREE.MeshPhongMaterial({color: new THREE.Color(0.8, 0.8, 0.8)});
        this.gainMat = new THREE.MeshPhongMaterial({color: new THREE.Color(0, 1, 0)});
        this.lossMat = new THREE.MeshPhongMaterial({color: new THREE.Color(1, 0, 0)});

        for (var i = 0; i < initialPoints; i++) {
            var newPoint = this.getPoint(this.normalMat);
            var pos = this.getPointPos(this.initialX, i, this.xPerPoint);
            newPoint.position.set(pos.x, pos.y, pos.z);
            this.points.push(newPoint);
            this.add(this.points[i]);
        }

        this.currentPoints = initialPoints;

        this.tiempoAnterior = Date.now();
        this.tiempoParaCambio = 1000;
        this.tiempoAcumulado = 0.0;

    }

    getPoint(mat) {
        var geom = new THREE.BoxGeometry(0.25, 1, 0.2);

        return new THREE.Mesh(geom, mat);
    }

    getPointPos(initialX, index, xPerPoint) {
        var pos = new THREE.Vector3(0, 0, 0);
        pos.x = initialX + index * xPerPoint;
        return pos;
    }

    resetColors(array, mat) {
        for(var i = 0; i < array.length; i++)
            array[i].material = mat;
    }

    update(points) {
        if(this.tiempoAcumulado > 0) {
            var tiempoActual = Date.now();
            this.tiempoAcumulado -= tiempoActual - this.tiempoAnterior;
            this.tiempoAnterior = tiempoActual;
        }

        if(this.tiempoAcumulado <= 0) {
            this.tiempoAcumulado = 0.0;
            this.resetColors(this.points, this.normalMat);
        }

        if (points >= 0 && points !== this.currentPoints) {
            var i;

            this.resetColors(this.points, this.normalMat);

            if (points > this.currentPoints) {
                for (i = this.currentPoints; i < points; i++) {
                    if (i < this.points.length) {
                        this.points[i].material = this.gainMat;
                        this.tiempoAcumulado = this.tiempoParaCambio;
                        this.tiempoAnterior = Date.now();
                        this.points[i].visible = true;
                    }
                    else {
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

                if(this.points.length > 0) {
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