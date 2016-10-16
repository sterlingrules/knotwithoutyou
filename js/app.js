import MapController from './controllers/map-controller.js'
import StickyController from './controllers/sticky-controller.js'

const App = {
    init() {

        MapController.init()
        StickyController.init()

        return this
    }
}

App.init()
