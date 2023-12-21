class InputController
{
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
        // this._state.mouseX = e.movementX - window.innerWidth / 2;
        // this._state.mouseY = e.movementY - window.innerHeight / 2;

        console.log(`movementX ${e.movementX}
movementY ${e.movementY}`)

        if (this.previous === null) {
            this.previous = { ...this._state }
        }

        this._state.mouseXDelta = this._state.mouseX - this.previous.mouseX;
        this._state.mouseYDelta = this._state.mouseY - this.previous.mouseY;

        // debug
        if (window.debug === true) {
            var debugString = 
            `Current MouseX - ${this._state.mouseX}
Current MouseY - ${this._state.mouseY}

Previous MouseX - ${this.previous.mouseX}
Previous MouseY - ${this.previous.mouseY}

Mouse X Delta - ${this._state.mouseXDelta}
Mouse Y Delta - ${this._state.mouseYDelta}`
            console.log(debugString);
        }
    }

    update()
    {
        this.previous = { ...this._state }
    }
}

export { InputController }