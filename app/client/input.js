class InputController
{
    static KEY_W = 87;

    static KEY_A = 65;

    static KEY_S = 83;

    static KEY_D = 68;

    constructor ()
    {
        window.debug = false;
        this.init()
    }

    init() 
    {
        this._state = {
            leftClick: false,
            rightClick: false,
            mouseX: 0,
            mouseY: 0,
            mouseXDelta: 0,
            mouseYDelta: 0,
        }

        this.previous = null

        this.keys = {}

        this.previousKeys = {}

        document.addEventListener('keydown', (e) => {this.onKeyDown(e)}, false)
        
        document.addEventListener('keyup', (e) => {this.onKeyUp(e)}, false)

        document.addEventListener('mousemove', (e) => {this.onMouseMove(e)}, false)
    }

    onKeyDown(e)
    {
        this.keys[e.keyCode] = true;
        // console.log(this.keys);
    }

    onKeyUp(e)
    {
        this.keys[e.keyCode] = false;
    }

    onMouseDown(e)
    {
        if (e.button == 0) {
            this._state.leftClick = true;
        }

        if (e.button == 2) {
            this._state.rightClick = true;
        } 
    }

    onMouseUp(e)
    {
        if (e.button == 0) {
            this._state.leftClick = false;
        } 

        if (e.button == 2) {
            this._state.rightClick = false;
        } 
    }

    onMouseMove(e)
    {
        this._state.mouseX = e.pageX - window.innerWidth / 2;
        this._state.mouseY = e.pageY - window.innerHeight / 2;

        if (this.previous === null) {
            this.previous = { ...this._state }
        }

        this._state.mouseXDelta = e.movementX;
        this._state.mouseYDelta = e.movementY;

        // debug
        if (window.debug === true) {
            console.log(`movementX ${e.movementX}\nmovementY ${e.movementY}`)
        }
    }

    update()
    {
        this.previous = { ...this._state }
    }
}

export { InputController }