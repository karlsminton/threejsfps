class InputController
{
    constructor ()
    {
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

        if (this.previous === null) {
            this.previous = { ...this._state }
        }

        this._state.mouseXDelta = this._state.mouseX - this.previous.mouseX;
        this._state.mouseYDelta = this._state.mouseY - this.previous.mouseY;

        // debug
        console.log()
        console.log('Current MouseX ', this._state.mouseX)
        console.log('Current MouseY ', this._state.mouseY)

        console.log('Previous MouseX ', this.previous.mouseX)
        console.log('Previous MouseY ', this.previous.mouseY)

        console.log('Mouse X Delta ', this._state.mouseXDelta)
        console.log('Mouse Y Delta ', this._state.mouseYDelta)
        console.log()
    }

    update()
    {
        this.previous = { ...this._state }
    }
}

export { InputController }