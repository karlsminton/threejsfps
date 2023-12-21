import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { FirstPersonCameraController } from '/app/client/camera_controller.js'

function initialise() {
    const scene = new THREE.Scene();

    const loader = new FBXLoader();
    loader.load('static/swat.fbx', (o) => scene.add(o))

    // TODO fix magic numbers
    const camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);

    window.canvas = renderer.domElement;
    const canvas = window.canvas;
    document.body.appendChild(canvas);

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
    plane.position.z = 8;
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
        canvas.requestFullscreen();
    }

    // requestPointerLock();

    // if (pointerLockRequested) {
    //     alert('pointerLockRequested')
    //     canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
    //     canvas.requestPointerLock();
    // }


    const controller = new FirstPersonCameraController(camera);

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        controller.update();
    }

    animate();
}

function requestPointerLock() {
    let pointerLockRequested = false;
    if (
        'pointerLockElement' in document 
        || 'mozPointerLockElement' in document
        || 'webkitPointerLockElement' in document
    ) {
        // canvas.requestPointerLock();
        pointerLockRequested = window.confirm("requestPointerLock");

        // console.log(pointerLockRequested)

        const pointerLockEvent = new CustomEvent(
            'pointerLockRequested', 
            {
                detail: {
                    requested: true
                }
            }
        );

        document.dispatchEvent(pointerLockEvent);
    }
}

document.querySelector('#play').addEventListener('click', (e) => {
    // alert('SHUT THE FUCK UP OK?!')
    // requestPointerLock();
    initialise();
    
    setTimeout(() => {
        requestPointerLock();
    }, 2000)
})

document.addEventListener('pointerLockRequested', (e) => {
    console.log(e.detail.requested)
    alert(`
        pointerLockRequested ${e.detail.requested === true ? 'true' : 'false'}
    `)
    canvas.requestPointerLock()
})

