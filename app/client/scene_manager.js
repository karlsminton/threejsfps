import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import * as CANNON from 'cannon-es';

class SceneManager {
    
    scene;
    
    characterControls;

    physicsWorld;

    objectsToUpdate = [];
    
    constructor(scene)
    {
        this.scene = scene
        this.physicsWorld = new CANNON.World();
        this.physicsWorld.gravity.set(0, -20.00, 0);
    }

    makeScene()
    {
        const loader = new FBXLoader();
        loader.load('static/fastrun.fbx', (object) => {
            console.log(object);

            // model is massive - scale down
            object.scale.set(0.01, 0.01, 0.01);
            this.scene.add(object);

            const animations = object.animations;
            const mixer = new THREE.AnimationMixer(object);
            const animationsMap = new Map();

            animations.forEach((animation) => {
                animationsMap.set(animation.name, mixer.clipAction(animation));
            });

            animationsMap.forEach((v, k) => {
                v.play();
            });

            console.log(animations);

            this.characterControls = new AnimationController(mixer, animationsMap);
        });

        const lightColour = 0xffffff;
        const light = new THREE.AmbientLight(lightColour);
        this.scene.add(light);

        const planeGeometry = new THREE.PlaneGeometry(20, 20);
        const planeMaterial = new THREE.MeshBasicMaterial({color: 0xffdda0000})
        planeMaterial.side = THREE.DoubleSide

        window.window.plane = new THREE.Mesh(planeGeometry, planeMaterial);
        window.plane.position.z = -5;
        window.plane.position.y = 0;
        window.plane.rotation.x-=1.55;
        this.scene.add(window.plane);

        const sphereBody = new CANNON.Body({
            mass: 15,
            shape: new CANNON.Sphere(1)
        });

        sphereBody.position.set(0, 10, -5);
        this.physicsWorld.addBody(sphereBody);

        const groundBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Plane()
        });
        groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        this.physicsWorld.addBody(groundBody);

        const sphereGeometry = new THREE.SphereGeometry(1);
        const sphereMaterial = new THREE.MeshNormalMaterial();
        const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

        // add object to array for checking and updating position 
        // based on physics world
        this.objectsToUpdate = [...this.objectsToUpdate, {threeId: sphereMesh.id, cannonId: sphereBody.id}];

        this.scene.add(sphereMesh);

        // the below objects reference all entities in threejs / cannon
        // console.log(this.scene.children);
        // console.log(this.physicsWorld.bodies);
    }

    update(deltaTime) {
        if (this.characterControls !== undefined) {
            this.characterControls.update(deltaTime);
        }

        for (var key in this.objectsToUpdate) {
            var object = this.objectsToUpdate[key]
            var mesh = this.scene.getObjectById(object.threeId);
        
            if (mesh) {
                var physicsObject = this.physicsWorld.bodies.filter((item) => {
                    return item.id === object.cannonId;
                })[0];

                // console.log(physicsObject);
                // console.log(physicsObject.position);

                mesh.position.copy(physicsObject.position);
                mesh.quaternion.copy(physicsObject.quaternion);
            }
        }
        
        this.physicsWorld.fixedStep();
    }
}

class AnimationController {

    // _previousAction = '';

    isAnimated = false;

    mixer;

    animationsMap;

    constructor(
        mixer,
        animationsMap
    ) {
        this.mixer = mixer,
        this.animationsMap = animationsMap;
    }

    update(deltaTime) {
        const action = 'mixamo.com';

        // if (action !== this._previousAction) {
        //     const nextAnimation = this.animationsMap.get(action);
        //     const previousAnimation = this.animationsMap.get('mixamo.com');

        //     previousAnimation.fadeOut(0.2);
        //     nextAnimation.reset().fadeIn(0.2).play();

        //     this._previousAction = action;
        // }

        if (this.isAnimated !== true) {
            const animation = this.animationsMap.get(action);
            animation.reset().fadeIn(10).play()
            this.isAnimated = true;
        }

        this.mixer.update(deltaTime);
    }
}

export { SceneManager, AnimationController }
