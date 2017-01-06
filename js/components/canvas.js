import Component from '../libs/component.js'

const ACTIVE_CLASS = 'canvas-active'

export default class CanvasComponent extends Component {
    constructor(options) {
        super(options)

        this._previousViewport = this.viewport

        this.initialize()
        this.listen()
    }

    initialize() {
        this.element.innerHTML = ''

        this.setImageStyles()
        this.appendCanvas()

        this.createImage(() => {
            this.drawImage()
            this.element.classList.add(ACTIVE_CLASS)
        })
    }

    listen() {
        this.window.on('resize', (viewport) => {
            if (this._previousViewport === viewport) return
            this.initialize()
        })
    }

    setImageStyles() {
        let style = getComputedStyle(this.element)

        this.imageSource = style.backgroundImage.replace(/(url\(\"|\)|\"|url\()/g, '')
    }

    appendCanvas() {
        let { viewport } = this.window

        this.canvas = document.createElement('canvas')
        this.canvas.width = this.options[viewport][0]
        this.canvas.height = this.options[viewport][1]

        this.element.appendChild(this.canvas)
    }

    createImage(callback) {
        this.image = new Image()
        this.image.src = this.imageSource
        this.image.onload = callback
    }

    drawImage() {
        let context = this.canvas.getContext('2d')
        let { viewport } = this.window

        context.drawImage(this.image, 0, 0, this.options[viewport][0], this.options[viewport][1])
    }
}
