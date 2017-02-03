import { delay } from '../helpers.js'
import WindowModel from '../models/window-model.js'

const STICKY_ATTRIBUTE = 'data-sticky'
const SCROLL_ATTRIBUTE = 'data-scroll'

const StickyController = {
    init() {
        this.html = document.documentElement
        this.stickyEl = document.querySelector(`[${STICKY_ATTRIBUTE}]`)
        this.scrollEl = document.querySelector(`[${SCROLL_ATTRIBUTE}]`)
        this.supportsSticky = this.html.classList.contains('webkit-sticky', 'sticky')

        if (!this.stickyEl) return

        this.window = new WindowModel()

        this.reset = this.reset.bind(this)
        this._setFixed = this._setFixed.bind(this)
        this._setMetrics = this._setMetrics.bind(this)

        this._setMetrics()
        this._listen()
        this.update()
    },

    _listen() {
        this.window.on('resize', () => {
            this.reset()._setMetrics()
            this.isFixed = null
        })
    },

    update() {
        if (this.supportsSticky) return

        requestAnimationFrame(() => {
            let scrollPosition = this.window.scrollPosition || 0

            let pastScrollTop = scrollPosition > this.scrollTop
            let pastScrollEnd = scrollPosition + this.window.height > this.stickyBottom
            let beforeScrollTop = scrollPosition < this.scrollTop
            let beforeScrollEnd = scrollPosition + this.window.height < this.stickyBottom

            if (beforeScrollTop) {
                this.reset()
            }

            if (pastScrollTop && beforeScrollEnd) {
                this._setFixed(true)
            }

            if (pastScrollEnd) {
                this._setFixed(false)
            }

            this.update()
        })
    },

    _setFixed(state) {
        if (this.isFixed === state) return

        if (state) {
            this.stickyEl.style.position = 'fixed'
            this.stickyEl.style.top = '0'
            this.stickyEl.style.bottom = 'auto'
        } else {
            this.stickyEl.style.position = 'absolute'
            this.stickyEl.style.top = 'auto'
            this.stickyEl.style.bottom = '0'
        }

        this.isFixed = state
        this.isCleared = false
    },

    reset() {
        if (this.isCleared) return this

        this.stickyEl.removeAttribute('style')

        this.isCleared = true
        this.isFixed = null

        return this
    },

    _setMetrics() {
        this.scrollTop = this.stickyEl.getBoundingClientRect().top + this.window.scrollPosition
        this.stickyBottom = this.scrollTop + this.scrollEl.offsetHeight
    }
}

export default StickyController
