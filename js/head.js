import _ from 'underscore'
import WindowModel from './models/window-model.js'

const VIEWPORTS = [ 'large', 'medium', 'small' ]

const Head = {
    init() {
        this.window = new WindowModel()
        this.html = document.documentElement

        this.setViewportSize = this.setViewportSize.bind(this)

        this.setViewportSize()

        this.propertyDetect('webkit-sticky', {
            name: 'position',
            value: '-webkit-sticky'
        })

        this.propertyDetect('sticky', {
            name: 'position',
            value: 'sticky'
        })

        this.listen()

        return this
    },

    listen() {
        this.window.on('resize', this.setViewportSize)
    },

    setViewportSize() {
        _.each(VIEWPORTS, (element, index) => {
            this.html.classList.remove(`viewport-${element}`)
        })

        this.html.classList.add(`viewport-${this.window.viewport}`)
    },

    propertyDetect(name, property) {
        let el = document.createElement('div');
        el.style[property.name] = property.value;

        if (el.style[property.name] === property.value) {
            this.html.classList.add(name)
        } else {
            this.html.classList.add(`no-${name}`)
        }
    }
}

Head.init()
