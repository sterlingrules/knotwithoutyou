import _ from 'underscore'
import Emitter from 'es6-event-emitter'
import { delay } from '../helpers.js'

const VIEWPORT_SIZES = [
    { name: 'large', min: 1025, max: 9999 },
    { name: 'medium', min: 768, max: 1024 },
    { name: 'small', min: 0, max: 767 }
]

export default class WindowModel extends Emitter {
    constructor() {
        super()

        this.setScrollPosition = this.setScrollPosition.bind(this)
        this._setWindowSize = this._setWindowSize.bind(this)
        this._setViewportSize = this._setViewportSize.bind(this)
        this._onResize = this._onResize.bind(this)

        this.setScrollPosition()
        this._setWindowSize()
        this._setViewportSize()

        this._listen()
    }

    _listen() {
        window.addEventListener('scroll', this.setScrollPosition, false)
        window.addEventListener('touchmove', this.setScrollPosition, false)
        window.addEventListener('resize', this._onResize, false)
    }

    _onResize(evt) {
        if (this.windowWidth === window.innerWidth) return

        this.setScrollPosition()
        this._setViewportSize()
        this._setWindowSize()

        this.trigger('resize')
    }

    // Setters
    setScrollPosition(evt) {
        if (evt && evt.scroll) {

            if (evt.animate) {
                this._animateScroll(evt)
            } else {
                window.scrollTo(evt.scroll[0], evt.scroll[1])
            }

        }

        this._scrollPosition = Math.round(window.scrollY)
        this.trigger('scroll', this._scrollPosition)
    }

    _animateScroll(evt) {
        let prevScrollPosition = this._scrollPosition
        let scrollChange = evt.scroll[1] - prevScrollPosition
        let frameCount = 20

        let scroll = (index = 1) => {
            let change = index / frameCount

            if (change === 1) return

            setTimeout(() => {
                window.scrollTo(evt.scroll[0], (scrollChange * change) + prevScrollPosition)
                index++

                scroll(index)
            }, evt.animate.duration / frameCount)
        }

        scroll()
    }

    _setViewportSize() {
        let w = this.windowWidth

        _.each(VIEWPORT_SIZES, (element, index) => {
            if (w > element.min && w < element.max) {
                this.viewportName = element.name
            }
        })
    }

    _setWindowSize() {
        this.windowHeight = window.innerHeight
        this.windowWidth = window.innerWidth
    }

    // Getters
    get scrollPosition() {
        return this._scrollPosition
    }

    get height() {
        return this.windowHeight
    }

    get width() {
        return this.windowWidth
    }

    get viewport() {
        return this.viewportName
    }
}
