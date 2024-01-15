import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { FirstPersonCameraController } from '/app/client/camera_controller.js'
import { SceneManager } from './app/client/scene_manager';

class App {

    /**
     * threejs scene
     */
    scene;

    /**
     * threejs renderer
     */
    renderer;

    /**
     * FirstPersonCameraController
     */
    controller;

    /**
     * SceneManager
     */
    sceneManager;

    /**
     * @type int
     */
    time = null;

    initialise = () => {
        this.scene = new THREE.Scene();
        window.camera = new THREE.PerspectiveCamera(
            FirstPersonCameraController.FIELD_OF_VIEW,
            this.getAspectRatio(),
            FirstPersonCameraController.FRUSTUM_NEAR,
            FirstPersonCameraController.FRUSTUM_FAR
        );

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        window.canvas = this.renderer.domElement;
        document.body.appendChild(window.canvas);

        // TODO abstract making a map
        this.sceneManager = new SceneManager(this.scene);
        this.sceneManager.makeScene();
        
        // Extract the following into separate client code
        let fullscreenRequested = false;
        if (document.fullscreenEnabled) {
            fullscreenRequested = window.confirm("requestFullscreen");
        }

        if (fullscreenRequested) {
            window.canvas.requestFullscreen();
        }

        this.controller = new FirstPersonCameraController(camera);

        // TODO implement deltaTime and pass to update function
        this.animate(document.timeline.currentTime);
    }

    animate = (deltaTime) => {
        if (this.time === null) {
            this.time = new THREE.Clock();
        }
        const delta = this.time.getDelta();

        // console.log(`${deltaTime} \n${delta}`);
        this.renderer.render(this.scene, camera);

        this.controller.update(delta);

        this.sceneManager.update(delta);
        requestAnimationFrame(this.animate);
    }

    getAspectRatio = () => {
        return window.innerWidth / window.innerHeight;
    }

    requestPointerLock = () => {
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

document.querySelector('#play').addEventListener('click', (e) => {
    app.initialise();
    
    setTimeout(() => {
        alert('sup');
        app.requestPointerLock();
    }, 2000)
})

document.addEventListener('pointerLockRequested', (e) => {
    if (e.detail.requested === true) {
        window.canvas.requestPointerLock()
    }
})

