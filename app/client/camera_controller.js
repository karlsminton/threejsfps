import * as THREE from 'three';
import { InputController } from '/app/client/input.js'

class FirstPersonCameraController
{
    static FIELD_OF_VIEW = 50;

    static FRUSTUM_NEAR = 0.1;

    static FRUSTUM_FAR = 1000;

    static HEAD_HEIGHT = 1.7;

    previousTimestamp = null;

    constructor(camera)
    {
        this.camera = camera;
        this.input = new InputController();
        this.rotation = new THREE.Quaternion();
        this.translation = new THREE.Vector3(0, 1.7, 0);
        this.phi = 0;
        this.theta = 0;
    }

    update(time) {
        const deltaTime = this.previousTimestamp - time

        this.updateRotation(deltaTime)
        this.camera.quaternion.copy(this.rotation)
        this.camera.position.copy(this.translation)
        this.input.update()
        this.updateTranslation(deltaTime)

        if (window.debug === true) {
            console.log(`deltaTime: ${deltaTime}`)
        }

        this.previousTimestamp = time
    }

    updateRotation(deltaTime) {
        const xh = this.input._state.mouseXDelta / window.innerWidth;
        const yh = this.input._state.mouseYDelta / window.innerHeight;

        this.input._state.mouseYDelta = 0;
        this.input._state.mouseXDelta = 0;

        // TODO understand what the actual fuck is going on at this point - complete breakdown
        // TODO also looks like this could be made cleaner & more readable
        this.phi += -xh * 5
        this.theta = this.clamp(this.theta + -yh * 5, -Math.PI / 3, Math.PI / 3);
        const qx = new THREE.Quaternion()
        qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi)
        const qz = new THREE.Quaternion()
        qz.setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.theta)

        const q = new THREE.Quaternion()
        q.multiply(qx)
        q.multiply(qz)

        this.rotation.copy(q)
    }

    updateTranslation(deltaTime) {
        const forwardVelocity = (this.input.keys[InputController.KEY_W] === true ? 1 : 0) + (this.input.keys[InputController.KEY_S] === true ? -1 : 0)
        const sidewaysVelocity = (this.input.keys[InputController.KEY_A] ? 1 : 0) + (this.input.keys[InputController.KEY_D] ? -1 : 0)

        const qx = new THREE.Quaternion();
        qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi)

        const forward = new THREE.Vector3(0, 0, 1)
        forward.applyQuaternion(qx)
        forward.multiplyScalar(forwardVelocity / deltaTime * 1);

        const left = new THREE.Vector3(1, 0, 0)
        left.applyQuaternion(qx)
        left.multiplyScalar(sidewaysVelocity / deltaTime * 1);

        this.translation.add(forward)
        this.translation.add(left)
    }

    clamp(x, a, b) {
        return Math.min(Math.max(x, a), b);
    }
}

export { FirstPersonCameraController }