import _ from 'underscore'

import { setStyle } from '../helpers.js'
import Component from '../libs/component.js'

const CLASS_ACTIVE = 'active'

class GalleryNav extends Component {
    constructor(options) {
        super(options)

        this.direction = options.direction
        this.navContainer = this.element.querySelector('ul')
        this.navItems = this.navContainer.querySelectorAll('li')

        if (this.direction === 'vertical') {
            this.stepDistance = this.navContainer.offsetHeight / this.navItems.length
        } else {
            this.stepDistance = this.navContainer.offsetWidth / this.navItems.length
        }
    }

    setCurrentIndex(currentIndex) {
        let props = this.getChangeProps(currentIndex)
        let method

        _.each(this.navItems, (element, index) => {
            method = (index === currentIndex) ? 'add' : 'remove'
            element.classList[method](CLASS_ACTIVE)
        })

        setStyle(this.navContainer, {
            '-webkit-transform' : props,
            transform : props
        })
    }

    getChangeProps(currentIndex) {
        if (this.direction === 'vertical') {
            return `translate3d(0px, -${this.stepDistance * currentIndex}px, 0px)`
        } else {
            return `translate3d(-${this.stepDistance * currentIndex}px, 0px, 0px)`
        }
    }
}

export default GalleryNav
