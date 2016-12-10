import _ from 'underscore'
import WindowModel from './models/window-model.js'

const VIEWPORTS = [ 'large', 'medium', 'small' ]

const Head = {
    init() {
        this.window = new WindowModel()

        this.setViewportSize = this.setViewportSize.bind(this)

        this.setViewportSize()

        this.listen()

        return this
    },

    listen() {
        this.window.on('resize', this.setViewportSize)
    },

    setViewportSize() {
        let html = document.documentElement

        _.each(VIEWPORTS, (element, index) => {
            html.classList.remove(`viewport-${element}`)
        })

        html.classList.add(`viewport-${this.window.viewport}`)
    }
}

Head.init()
