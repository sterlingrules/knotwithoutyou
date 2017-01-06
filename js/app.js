import _ from 'underscore'
import Rellax from 'rellax'

import MapController from './controllers/map.js'
import StickyController from './controllers/sticky.js'
import POIController from './controllers/poi-gallery.js'
import TimelineComponent from './components/timeline.js'
// import ParallaxComponent from './components/parallax.js'
import CanvasComponent from './components/canvas.js'

const App = {
    init() {
        MapController.init()
        StickyController.init()
        POIController.init()

        this.setupTimeline()
        // this.setupParallax()
        this.setupCanvas()

        return this
    },

    setupTimeline() {
        let timelineEls = document.querySelectorAll('[data-timeline-component]')
        let TimelineComponents = []

        _.each(timelineEls, (element, index) => {
            TimelineComponents[index] = new TimelineComponent({
                name: 'timeline-component',
                element: element
            })
        })
    },

    // setupParallax() {
    //     let parallaxEls = document.querySelectorAll('[data-parallax-component]')
    //     let ParallaxComponents = []

    //     _.each(parallaxEls, (element, index) => {
    //         ParallaxComponents[index] = new ParallaxComponent({
    //             name: 'parallax-component',
    //             element: element
    //         })
    //     })
    // },

    setupCanvas() {
        let canvasEls = document.querySelectorAll('[data-canvas-component]')
        let CanvasComponents = []

        _.each(canvasEls, (element, index) => {
            CanvasComponents[index] = new CanvasComponent({
                name: 'canvas-component',
                element: element
            })
        })
    }
}

document.addEventListener('DOMContentLoaded', () => App.init())
