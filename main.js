import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { FirstPersonCameraController } from '/app/client/camera_controller.js'

function initialise() {
    const scene = new THREE.Scene();
    // const loader = new FBXLoader();
    // loader.load('static/swat.fbx', (o) => scene.add(o))

    const camera = new THREE.PerspectiveCamera(
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
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    const cube = new THREE.Mesh(geometry, material);
    cube.position.y = 0.2;
    scene.add(cube);

    const light = new THREE.AmbientLight(0x404040);
    scene.add(light);

    const planeGeometry = new THREE.PlaneGeometry(20, 20);
    const planeMaterial = new THREE.MeshBasicMaterial({color: 0xffdda0000})
    planeMaterial.side = THREE.DoubleSide
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.z = -5;
    plane.position.y = -0.55;
    plane.rotation.x-=1.55;
    scene.add(plane);

    camera.position.z = 10;

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
        console.log(deltaTime)
        requestAnimationFrame(animate)
        renderer.render(scene, camera)
        controller.update(deltaTime)
    }

    animate(document.timeline.currentTime);

    // function animate() {
    //     requestAnimationFrame(animate);
    //     renderer.render(scene, camera);
    //     controller.update();
    // }

    // animate();
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

