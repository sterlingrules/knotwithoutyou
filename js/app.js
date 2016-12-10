import _ from 'underscore'

import MapController from './controllers/map.js'
import StickyController from './controllers/sticky.js'
import POIController from './controllers/poi-gallery.js'
import Timeline from './components/timeline.js'

const App = {
    init() {
        MapController.init()
        StickyController.init()
        POIController.init()

        this.startTimelines()

        return this
    },

    startTimelines() {
        let timelineEls = document.querySelectorAll('[data-timeline-component]')
        let TimelineComponents = []

        _.each(timelineEls, (element, index) => {
            TimelineComponents[index] = new Timeline({
                name: 'timeline',
                element: element
            })
        })
    }
}

document.addEventListener('DOMContentLoaded', () => App.init())
