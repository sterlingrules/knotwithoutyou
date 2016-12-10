import { lory } from 'lory.js'
import { POI } from '../../data/geojson.js'
import WindowModel from '../models/window-model.js'
import GalleryNav from '../components/gallery-navigation.js'
import _ from 'underscore'

const CLASS_ACTIVE = 'active'
const VIEW_OFFSET = {
    large: 90,
    medium: 90,
    small: 18
}

const POIController = {
    init() {
        this.element = document.querySelector('[data-poi]')
        this.slideEls = this.element.querySelectorAll('li')
        this.options = {
            infinite: false,
            enableMouseEvents: true
        }

        this.onChange = this.onChange.bind(this)

        this.poi = lory(this.element, this.options)
        this.galleryNav = new GalleryNav({ element: this.element.querySelector('.dotnav') })
        this.window = new WindowModel()

        this.listen()
        this.start()
    },

    start() {
        this.onChange({ detail: { currentSlide: 0 } })
    },

    listen() {
        this.element.addEventListener('after.lory.slide', this.onChange, false)
    },

    onChange(evt) {
        let currentIndex = evt.detail.currentSlide
        let type = this.slideEls[currentIndex].dataset.slide

        this.poiEls = this.poiEls || document.querySelectorAll(`[data-marker]`)

        if (!this.poiEls || !evt.type) return

        _.each(this.poiEls, (element, index) => {
            element.classList.remove(CLASS_ACTIVE)

            if (element.dataset.marker === type) {
                element.classList.add(CLASS_ACTIVE)
            }
        })

        this._updateScrollPosition()
        this.galleryNav.setCurrentIndex(currentIndex)
    },

    _updateScrollPosition() {
        let elementBottom = this.element.getBoundingClientRect().bottom + this.window.scrollPosition
        let offset = VIEW_OFFSET[this.window.viewport]
        let _scrollY = elementBottom - window.innerHeight + offset

        this.window.setScrollPosition({
            scroll: [ 0, _scrollY ],
            animate: {
                duration: 200
            }
        })
    }
}

export default POIController
