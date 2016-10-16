import { MAPBOX_ACCESS_TOKEN } from '../constants.js'
import CHECKINS from '../../data/checkins-sterling.js'

import MapboxGL from 'mapbox-gl'

const SCROLL_ATTRIBUTE = 'data-scroll'

const MapController = {

    init() {
        MapboxGL.accessToken = MAPBOX_ACCESS_TOKEN

        this.map = new MapboxGL.Map({
            container: 'mapview',
            style: 'mapbox://styles/sterlingrules/cithkzuv7001n2ipk6nyydou8',
            interactive: false
        })

        this.marker = new MapboxGL.Marker()
        this.scrollEl = document.querySelector(`[${SCROLL_ATTRIBUTE}]`)
        this.scrollTop = this.scrollEl.getBoundingClientRect().top + window.scrollY
        this.distance = this.scrollEl.offsetHeight

        this.setScrollPosition = this.setScrollPosition.bind(this)

        this.map.jumpTo({
            center: [
                -80.1467262080208,
                26.120441835304543
            ],
            zoom: 10
        });

        this.marker.setLngLat([ -80.1467262080208, 26.120441835304543 ]).addTo(this.map)

        this.listen()
        this.updateMap()
    },

    listen() {
        window.addEventListener('scroll', this.setScrollPosition, false)
    },

    updateMap() {
        requestAnimationFrame(() => {
            let index = 0
            let lastPosition = 0
            let checkinCount = CHECKINS.checkins.length
            let currentPosition = Math.round(this.scrollposition * (this.distance / checkinCount))
            let location

            let locationExists = (currentPosition < checkinCount && currentPosition > 0)
            let notVisited = (currentPosition !== lastPosition)

            // console.log(this.scrollposition, currentPosition, lastPosition)

            if (notVisited && locationExists) {
                console.log(currentPosition, Math.round(this.scrollposition * (this.distance / checkinCount)))
                location = CHECKINS.checkins[checkinCount - currentPosition].labeledLatLngs

                this.map.jumpTo({
                    center: [
                        location[0].lng,
                        location[0].lat
                    ],
                    // bearing: 27,
                    // pitch: 45,
                    zoom: 12
                });

                this.marker.setLngLat([ location[0].lng, location[0].lat ]).addTo(this.map)

                lastPosition = currentPosition
            }

            this.updateMap()
        })
    },

    setScrollPosition(evt) {
        this.scrollposition = Math.round(window.scrollY - this.scrollTop)

        //
        // Foursquare Checkin API:
        //  https://api.foursquare.com/v2/users/self/checkins?offset=0&limit=250&oauth_token=R5VSUZ020YHDHGNUK2CBMXPRBUIRR15BCROTTQD4OLUVVUWF&v=20161015
        //
    }

}

export default MapController
