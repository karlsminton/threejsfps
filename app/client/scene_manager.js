import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

class SceneManager {
    
    scene;
    
    characterControls;
    
    constructor(scene)
    {
        this.scene = scene
    }

    makeScene()
    {
        // var characterControls;
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
    }

    update(deltaTime) {
        if (this.characterControls !== undefined) {
            this.characterControls.update(deltaTime);
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
            animation.reset().fadeIn(10).play()
            this.isAnimated = true;
        }

        this.mixer.update(deltaTime);
    }
}

export { SceneManager, AnimationController }