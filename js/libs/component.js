import Emitter from 'es6-event-emitter'
import WindowModel from '../models/window-model.js'

class Component extends Emitter {
    constructor(options) {
        super(options)

        this.attr = `data-${options.name}`
        this.element = options.element
        this.options = this._cleanOptions(options)
        this.window = new WindowModel()

        this._setMetrics = this._setMetrics.bind(this)

        this._setMetrics()
        this._listen()
    }

    _listen() {
        this.window.on('resize', this._setMetrics)
    }

    _cleanOptions(options) {
        return JSON.parse(options.element.getAttribute(this.attr) || '{}')
    }

    _setMetrics() {
        this.elementTop = this.element.getBoundingClientRect().top
    }

    get scrollPosition() {
        return this.window.scrollPosition + this.elementTop
    }

    get height() {
        return this.element.offsetHeight
    }
}

export default Component
