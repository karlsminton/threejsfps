import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { FirstPersonCameraController } from '/app/client/camera_controller.js'
import { SceneManager } from './app/client/scene_manager';

class App {
    scene;
    renderer;
    controller;
    sceneManager;
    previousTime = null;

    constructor() {    
        this.scene = new THREE.Scene();
        window.camera = new THREE.PerspectiveCamera(
            FirstPersonCameraController.FIELD_OF_VIEW,
            this.getAspectRatio(),
            FirstPersonCameraController.FRUSTUM_NEAR,
            FirstPersonCameraController.FRUSTUM_FAR
        );

        window.camera.position.set(0, 1.7, 0);

        this.renderer = new THREE.WebGLRenderer();

        this.renderer.setSize(window.innerWidth, window.innerHeight);

        window.canvas = this.renderer.domElement;
        document.body.appendChild(window.canvas);

        // TODO abstract making a map
        this.sceneManager = new SceneManager(this.scene)
        this.sceneManager.makeScene()
        
        // Extract the following into separate client code
        let fullscreenRequested = false;
        if (document.fullscreenEnabled) {
            fullscreenRequested = window.confirm("requestFullscreen")
        }

        if (fullscreenRequested) {
            window.canvas.requestFullscreen();
        }

        this.controller = new FirstPersonCameraController(window.camera);
        this.animate(0);
    }

    animate = (time) => {
        // const deltaTime = time;
        if (this.previousTime === null) {
            this.previousTime = time;
        }

        const deltaTime = time - this.previousTime;
        console.log(deltaTime);
        // TODO implement deltaTime and pass to update function

        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, window.camera);
        this.controller.update(deltaTime);
        this.sceneManager.update(deltaTime);

        this.previousTime = time;
    }

    getAspectRatio() {
        return window.innerWidth / window.innerHeight;
    }

    requestPointerLock() {
        let pointerLockRequested = false;
        if (
            'pointerLockElement' in document 
            || 'mozPointerLockElement' in document
            || 'webkitPointerLockElement' in document
        ) {
            pointerLockRequested = window.confirm("Allow pointer-lock?");
    
            const pointerLockEvent = new CustomEvent(
                'pointerLockRequested', 
                {
                    detail: {
                        requested: pointerLockRequested
                    }
                }
            );
    
            document.dispatchEvent(pointerLockEvent);
        }
    }
}

const app = new App();

// function requestPointerLock() {
//     let pointerLockRequested = false;
//     if (
//         'pointerLockElement' in document 
//         || 'mozPointerLockElement' in document
//         || 'webkitPointerLockElement' in document
//     ) {
//         pointerLockRequested = window.confirm("Allow pointer-lock?");

//         const pointerLockEvent = new CustomEvent(
//             'pointerLockRequested', 
//             {
//                 detail: {
//                     requested: pointerLockRequested
//                 }
//             }
//         );

//         document.dispatchEvent(pointerLockEvent);
//     }
// }

document.querySelector('#play').addEventListener('click', (e) => {
    app.initialise();
    
    setTimeout(() => {
        app.requestPointerLock();
    }, 2000)
})

document.addEventListener('pointerLockRequested', (e) => {
    if (e.detail.requested === true) {
        window.canvas.requestPointerLock()
    }
})

