import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
// import * as Ammo from 'ammojs';


class SceneManager {
    
    scene;
    
    characterControls;

    physicsUniverse;

    rigidBodies;

    tmpTransformation;

    ammo;
    
    constructor(scene)
    {
        this.scene = scene;
        this.physicsUniverse = undefined;
        this.rigidBodies = [];
        this.tmpTransformation = undefined;
        this.ammo = undefined;
    }

    makeScene = () => {
        Ammo().then(this.instantiatePhysics);
        
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
        // window.plane.rotation.x-=1.55;

        this.createCube(1, {x: 1, y: 1, z: 1}, 1);

        this.scene.add(window.plane);
    }

    createCube = (scale, position, mass, rot_quaternion) => {
        let quaternion = undefined;

        if (rot_quaternion == null) {
            quaternion = {x: 0, y: 0, z: 0, w: 1};
        } else {
            quaternion = rot_quaternion;
        }

        let cube = new THREE.Mesh(
            // new THREE.BoxBufferGeometry(scale, scale, scale),
            new THREE.BoxGeometry(scale, scale, scale),
            new THREE.MeshPhongMaterial({color: Math.random() * 0xffffff})
        );

        cube.position.set(position.x, position.y, position.z);
        this.scene.add(cube);

        let transform = new this.ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));
        transform.setRotation(new Ammo.btQuaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w));

        let defaultMotionState = new Ammo.btDefaultMotionState(transform);

        let structColShape = new Ammo.btBoxShape(new Ammo.btVector3(scale * 0.5, scale * 0.5, scale * 0.5));
        structColShape.setMargin(0.05);

        let localInertia = new Ammo.btVector3(0, 0, 0);
        structColShape.calculateLocalInertia(mass, localInertia);

        let rigidBodyInfo = new Ammo.btRigidBodyConstructionInfo(
            mass, 
            defaultMotionState, 
            structColShape, 
            localInertia
        );

        let RigidBody = new Ammo.btRigidBody(rigidBodyInfo);

        this.physicsUniverse.addRigidBody(RigidBody);

        cube.userData.physicsBody = RigidBody;

        this.rigidBodies.push(cube);
    }

    instantiatePhysics = () => {
        alert('instantiated physics');
        this.ammo = Ammo;
        let collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
        new Ammo.btDefaultCollisionConfiguration
        let dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
        let overlappingPairCache = new Ammo.btDbvtBroadphase();
        let solver = new Ammo.btSequentialImpulseConstraintSolver();
        this.physicsUniverse = new Ammo.btDiscreteDynamicsWorld(
            dispatcher, 
            overlappingPairCache, 
            solver, 
            collisionConfiguration
        );

        this.physicsUniverse.setGravity(new Ammo.btVector3(0, -75, 0));

        this.tmpTransformation = Ammo.btTransform();
    }

    update(deltaTime) {
        if (this.characterControls !== undefined) {
            this.characterControls.update(deltaTime);
        }

        this.updatePhysicsUniverse(deltaTime);
    }

    updatePhysicsUniverse = (deltaTime) => {
        this.physicsUniverse.stepSimulation(deltaTime, 10);

        for (let i = 0; i < this.rigidBodies.length; i++) {
            let graphicsObject = this.rigidBodies[i];
            let physicsObject = graphicsObject.userData.physicsBody;

            let motionState = physicsObject.getMotionState();

            if (motionState) {
                motionState.getWorldTransform(this.tmpTransformation);
                let newPosition = this.tmpTransformation.getOrigin();
                let newQuaternion = this.tmpTransformation.getRotation();

                graphicsObject.position.set(
                    newPosition.x(),
                    newPosition.y(),
                    newPosition.z()
                );

                graphicsObject.quaternion.set(
                    newQuaternion.x(),
                    newQuaternion.y(),
                    newQuaternion.z(),
                    newQuaternion.w()
                );
            }
        }
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
            animation.reset().fadeIn(2).play()
            this.isAnimated = true;
        }

        this.mixer.update(deltaTime);
    }
}

export { SceneManager, AnimationController }