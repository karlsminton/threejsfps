import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { FirstPersonCameraController } from '/app/client/camera_controller.js'

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

document.body.appendChild(renderer.domElement);

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

const controller = new FirstPersonCameraController(camera);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    // camera.rotation.y += 0.1;
    controller.update();
    // console.log(camera.quaternion);
}

animate();