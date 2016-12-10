import Parallax from '../components/parallax.js'

const ParallaxController = {
    init() {
        let parallaxEls = document.querySelectorAll('[data-parallax]')
        let parallaxObjs = []
        let options = {}

        parallaxEls.forEach((el, i) => {
            options = {
                name: 'parallax',
                element: el
            }

            parallaxObjs[i] = new Parallax(options)
            parallaxObjs[i].start()
        })
    }
}

export default ParallaxController
