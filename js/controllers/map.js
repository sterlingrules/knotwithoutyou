import _ from 'underscore'
import { MAPBOX_ACCESS_TOKEN } from '../constants.js'
import { delay } from '../helpers.js'
import { STORY_LOCATIONS, POI } from '../../data/geojson.js'

import MapboxGL from 'mapbox-gl'
import GalleryNav from '../components/gallery-navigation.js'
import WindowModel from '../models/window-model.js'

const SCROLL_ATTRIBUTE = 'data-scroll'
const DEFAULT = {
    type: 'main',
    attribute : 'main',
    moveType : 'fly',
    iconSize : [ 96, 96 ],
    bearing : 15,
    pitch : 7,
    zoom : 12,
    speed : 1.7,
    classes : [
        'marker-main'
    ]
}

const MARKER_COMPLETE = {
    large: {
        center: [ -80.1411887, 26.129876 ],
        zoom: 13
    },
    medium: {
        center: [ -80.1411887, 26.129876 ],
        zoom: 13
    },
    small: {
        center: [ -80.1411887, 26.140876 ],
        zoom: 12.2
    }
}

const MapController = {
    init() {
        MapboxGL.accessToken = MAPBOX_ACCESS_TOKEN

        this.checkinCount = STORY_LOCATIONS.length
        this.scrollEl = document.querySelector(`[${SCROLL_ATTRIBUTE}]`)

        if (!this.scrollEl) return

        this.window = new WindowModel()
        this.galleryNav = new GalleryNav({
            element: this.scrollEl.querySelector('.dotnav'),
            direction: 'vertical'
        })

        this._setMetrics = this._setMetrics.bind(this)

        this._setMetrics()
        this._listen()

        this.setup()
        this.start()
    },

    _listen() {
        this.window.on('resize', this._setMetrics)
    },

    setup() {
        let markerCompleteOpts
        let markerStartOpts = { offset: [ -48, -48 ] }
        let mapboxOpts = {
            container: 'mapview',
            style: 'mapbox://styles/sterlingrules/ciud64l78003u2ipmqp732l26?optimize=true',
            interactive: false
        }

        this.map = new MapboxGL.Map(mapboxOpts)
        // this.popup = new MapboxGL.Popup()
        this.marker = new MapboxGL.Marker(this._createMarker(STORY_LOCATIONS[0]), markerStartOpts)

        this.setMapView({
            center: STORY_LOCATIONS[0].center,
            bearing: STORY_LOCATIONS[0].bearing,
            pitch: STORY_LOCATIONS[0].pitch,
            zoom: STORY_LOCATIONS[0].zoom
        });

        this.marker
            .setLngLat(STORY_LOCATIONS[0].center)
            .addTo(this.map)

        //
        // Setup completed state
        //
        for (let i = 0; i < POI.length; i++) {
            markerCompleteOpts = { offset: [ -POI[i].iconSize[0] / 2, -POI[i].iconSize[1] / 2 ] }

            new MapboxGL.Marker(this._createMarker(POI[i]), markerCompleteOpts)
                .setLngLat(POI[i].center)
                .addTo(this.map)
        }
    },

    destroy() {
        this.map.remove()
        return this
    },

    start() {
        requestAnimationFrame(() => {
            let locationExists = (this.currentPosition < this.checkinCount)
            let notVisited = (this.currentPosition !== this.lastPosition)

            if (notVisited && locationExists) {
                this.setMapView(STORY_LOCATIONS[this.currentPosition])
                this.markerUpdate(this.currentPosition)
                this.galleryNav.setCurrentIndex(this.currentPosition)

                this.lastPosition = this.currentPosition
            }

            if (this.window.scrollPosition + this.window.height > this.elementBottom && !this.hasCompleted) {
                this.markerUpdate(this.checkinCount)
            }

            this.start()
        })
    },

    setMapView(location) {
        location = _.defaults(location, DEFAULT)

        let coords = [
            location.center[0],
            location.center[1]
        ]

        this.marker.setLngLat(coords)
            .addTo(this.map)

        this.map[`${location.moveType}To`](location)
    },


    //
    // Marker Handling
    //
    markerUpdate(index) {
        if (index < this.checkinCount || this.hasCompleted) {
            return this.markerReset()
        } else {
            return this.markerComplete()
        }
    },

    markerComplete() {
        this.setMapView({
            moveType: 'fly',
            center: MARKER_COMPLETE[this.window.viewport].center,
            bearing: 0,
            pitch: 0,
            speed: 3,
            zoom: MARKER_COMPLETE[this.window.viewport].zoom
        });

        this.scrollEl.classList.add('map-complete')
        this.hasCompleted = true
    },

    markerReset() {
        this.scrollEl.classList.remove('map-complete')
        this.hasCompleted = false
    },


    //
    // Getters
    //
    get currentPosition() {
        let scrollPosition = Math.round(this.window.scrollPosition - this.elementTop)
        let currentPosition = Math.round(scrollPosition * (this.checkinCount / this.distance))

        return Math.max(currentPosition, 0)
    },


    //
    // Private
    //
    _createMarker(marker) {
        marker = _.defaults(marker, DEFAULT)

        let el = document.createElement('div')

        _.each(marker.classes, (element) => {
            el.classList.add(element)
        })

        el.dataset.marker = marker.attribute
        el.style.width = `${marker.iconSize[0]}px`
        el.style.height = `${marker.iconSize[1]}px`

        return el
    },

    _setMetrics(evt) {
        this.elementTop = this.scrollEl.getBoundingClientRect().top + this.window.scrollPosition
        this.elementBottom = this.scrollEl.getBoundingClientRect().bottom + this.window.scrollPosition
        this.distance = this.scrollEl.offsetHeight - this.window.height
    }
}

export default MapController
