import _ from 'underscore'

import MapController from './controllers/map.js'
import StickyController from './controllers/sticky.js'
import POIController from './controllers/poi-gallery.js'
import TimelineComponent from './components/timeline.js'
import CanvasComponent from './components/canvas.js'

const App = {
    init() {
        MapController.init()
        StickyController.init()
        POIController.init()

        this.setupTimeline()
        this.setupCanvas()

        return this
    },

    setupTimeline() {
        let timelineEls = document.querySelectorAll('[data-timeline-component]')
        let TimelineComponents = []

        if (!timelineEls.length) return

        _.each(timelineEls, (element, index) => {
            TimelineComponents[index] = new TimelineComponent({
                name: 'timeline-component',
                element: element
            })
        })
    },

    setupCanvas() {
        let canvasEls = document.querySelectorAll('[data-canvas-component]')
        let CanvasComponents = []

        if (!canvasEls.length) return

        _.each(canvasEls, (element, index) => {
            CanvasComponents[index] = new CanvasComponent({
                name: 'canvas-component',
                element: element
            })
        })
    }
}

document.addEventListener('DOMContentLoaded', () => App.init())
