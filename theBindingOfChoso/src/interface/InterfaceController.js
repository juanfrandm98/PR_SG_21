import * as THREE from '../../libs/three.module.js'
import {SemiHeart} from "./SemiHeart";

class InterfaceController extends THREE.Object3D {

    constructor(maxHP) {
        super();

        this.hearts = [];

        for(var i = 0; i < maxHP) {
            this.hearts.push(new SemiHeart();)
        }
    }

    update() {}

}

export {InterfaceController};