'use strict'

import Component from '../libs/component.js'
import Easing from '../libs/easing.js'
import { setStyle } from '../helpers.js'

// Constants
const EVENT_UPDATE = 'update'
const EVENT_SCROLL = 'scroll'

class Timeline extends Component {
    constructor(options) {
        super(options)

        this.canUpdate = true
        this._methods = []
        this._options = {
            start: 0,
            end: 1,
            offsetStart: null, // defaults to `window.innerHeight` on call
            offsetEnd: null, // defaults to `window.innerHeight` on call
            prerender: false
        }

        this._setupMethods()
        this._updateMetrics()
        this.listen()
        this.start()
    }

    start() {
        requestAnimationFrame(() => {
            this._update()
            this.start()
        })
    }

    listen() {
        this._updateMetrics = this._updateMetrics.bind(this)
        this._setProgress = this._setProgress.bind(this)

        this.on(EVENT_UPDATE, this._updateMetrics)
        this.window.on(EVENT_SCROLL, this._setProgress)
    }

    destroy() {
        this.canUpdate = false
    }

    activate() {
        this._updateMetrics()
    }


    //
    // Timeline Specific
    //
    _setupMethods() {
        this.timelineEls = this.element.querySelectorAll('[data-timeline]')

        var timelineOpts
        var data = null

        for(let i = 0; i < this.timelineEls.length; i++) {
            timelineOpts = JSON.parse(this.timelineEls[i].getAttribute('data-timeline'))
            timelineOpts.element = this.timelineEls[i]

            if (timelineOpts.events) {
                for (let e = 0; e < timelineOpts.events.length; e++) {

                    if (typeof timelineOpts.events[e].data !== undefined) {
                        data = timelineOpts.events[e].data
                    }

                    this._methods.push({
                        name: timelineOpts.events[e].name,
                        index: e,
                        start: timelineOpts.events[e].start,
                        end: timelineOpts.events[e].end,
                        easing: timelineOpts.events[e].easing,
                        element: timelineOpts.element,
                        data: data
                    })
                }

                continue
            }

            if (timelineOpts.name) {
                this._methods.push(timelineOpts)
            }
        }
    }

    // _prerender() {
    //     return new Promise(function(resolve, reject) {
    //         if (this._getInView() || !this._options.prerender) {
    //             return resolve()
    //         }

    //         var onComposite = function(frame, totalFrames) {
    //             if (frame > totalFrames) {
    //                 this._progress = 0
    //                 this._update()
    //                 return resolve()
    //             }

    //             this._progress = frame / totalFrames
    //             this._update()

    //             frame++

    //             requestAnimationFrame(function(frame, totalFrames) {
    //                 onComposite.call(this, frame, totalFrames)
    //             }.bind(this, frame, totalFrames))
    //         }

    //         onComposite.call(this, 0, 20)
    //     }.bind(this))
    // }

    _update() {
        if (!this.canUpdate || this._lastProgress === this._progress) return

        let data = null
        let event = {}
        let method

        for (let i = 0; i < this._methods.length; i++) {
            method = this._methods[i]

            method.progress = this._tween(
                method.start || this._options.start,
                method.end || this._options.end,
                this._progress,
                method.easing
            )

            this[method.name](method)
        }

        this._lastProgress = this._progress
    }

    _tween(start, end, progress, easeFunc) {
        var duration = end - start
        var value = progress <= start ? 0 : 1
        var easeFunc = easeFunc || 'linear'

        if (progress > start && progress < end) {
            value = (progress - start) / duration
        }

        return Easing[easeFunc](value)
    }

    _updateMetrics(evt) {
        let method
        let scrollY = evt ? evt.scroll : this.window.scrollPosition
        let scrollTop = evt ? evt.scrollTop : null

        this._setScrollTop(scrollTop)
        this._setProgress(scrollY)

        // Reset methods ability to update
        for (let i = 0; i < this._methods.length; i++) {
            method = this._methods[i]
        }

        this._update()
    }

    //
    // Setters
    //
    _setProgress(scrollPosition) {
        let offsetStart = this._options.offsetStart || this.window.height
        let offsetEnd = this._options.offsetEnd || this.window.height
        let elementTop = this.window.scrollPosition - this._elementScrollTop + offsetStart
        let elementHeight = this.element.offsetHeight + offsetEnd
        let progress = 0

        if (elementTop > 0) {
            progress = Math.round((elementTop / elementHeight) * 1000) / 1000
        }

        this._progress = Math.min(progress, 1)
    }

    _setScrollTop(scrollTop) {
        this._elementScrollTop = scrollTop || this.element.getBoundingClientRect().top + this.window.scrollPosition
    }

    //
    // Public Methods
    //
    parallaxHero(evt) {
        setStyle(evt.element, {
            transform: `translate3d(0, ${evt.progress * 10}vw, 0)`
        })
    }

    parallaxCouple(evt) {
        setStyle(evt.element, {
            transform: `translate3d(0, ${evt.progress * -160}px, 0)`
        })
    }

    gallerySlide(evt) {
        setStyle(evt.element, {
            transform: `translate3d(${evt.progress * -40}%, 0, 0)`
        })
    }
}

export default Timeline
