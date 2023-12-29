import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { FirstPersonCameraController } from '/app/client/camera_controller.js'
import { SceneManager } from './app/client/scene_manager';

function initialise() {
    const scene = new THREE.Scene();
    window.camera = new THREE.PerspectiveCamera(
        FirstPersonCameraController.FIELD_OF_VIEW,
        getAspectRatio(),
        FirstPersonCameraController.FRUSTUM_NEAR,
        FirstPersonCameraController.FRUSTUM_FAR
    );

    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);

    window.canvas = renderer.domElement;
    document.body.appendChild(window.canvas);

    // TODO abstract making a map
    const sceneManager = new SceneManager(scene)
    sceneManager.makeScene()
    
    // Extract the following into separate client code
    let fullscreenRequested = false;
    if (document.fullscreenEnabled) {
        fullscreenRequested = window.confirm("requestFullscreen")
    }

    if (fullscreenRequested) {
        window.canvas.requestFullscreen();
    }

    const controller = new FirstPersonCameraController(camera);

    // TODO implement deltaTime and pass to update function

    function animate(deltaTime)
    {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        controller.update(deltaTime);
        sceneManager.update(deltaTime);
    }

    animate(document.timeline.currentTime);
}

function getAspectRatio()
{
    return window.innerWidth / window.innerHeight
}

function requestPointerLock() {
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

document.querySelector('#play').addEventListener('click', (e) => {
    initialise();
    
    setTimeout(() => {
        requestPointerLock();
    }, 2000)
})

document.addEventListener('pointerLockRequested', (e) => {
    if (e.detail.requested === true) {
        window.canvas.requestPointerLock()
    }
})

