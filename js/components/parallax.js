import Component from '../libs/component.js'

export default class ParallaxController extends Component {
    constructor(options) {
        super(options)

        this.start = this.start.bind(this)
        this._setMetrics = this._setMetrics.bind(this)

        this.unitChar = this.options.unit === 'percent' ? '%' : 'px'
        this.animation = this.options.animation || 'easeout'

        this.listen()
        this.init()
    }

    init() {
        this._setMetrics()
        this._setStyle()

        this.element.classList.add(`parallax--${this.animation}`)

        console.log(this)
    }

    listen() {
        window.addEventListener('resize', this._setMetrics, false)
    }

    start() {
        requestAnimationFrame(() => {
            let scrollBottom = this.window.scrollPosition + this.window.height
            let progress = (this.elementBottom - this.window.scrollPosition) / this.elementBottom
            let props = []

            let isVisible = (scrollBottom > this.elementTop && this.window.scrollPosition < this.elementBottom)

            if (isVisible && this._prevPosition !== this.window.scrollPosition) {
                props = [
                    this._getDistance(0, progress),
                    this._getDistance(1, progress)
                ]

                if (this.options.start.length === 3) {
                    props.push(this._getDistance(2, progress))
                }

                this._setStyle(props)
                this._prevPosition = this.window.scrollPosition
            }

            this.start()
        })
    }

    _setStyle(value = this.options.start) {
        let transformProps = this._getTransformProps(value)

        this.element.style['transform'] = transformProps
        this.element.style['-webkit-transform'] = transformProps
        this.element.style['-moz-transform'] = transformProps
    }

    _setMetrics() {
        this.elementTop = this.element.getBoundingClientRect().top + this.window.scrollPosition - this.options.start[1]
        this.elementBottom = this.element.getBoundingClientRect().bottom + this.window.scrollPosition - this.options.start[1]
    }

    _getDistance(index = 0, progress = 0) {
        // console.log(this.options.start[index] - this.options.end[index], ((this.options.start[index] - this.options.end[index]) * progress) + this.options.end[index])
        return ((this.options.start[index] - this.options.end[index]) * progress) + this.options.end[index]
    }

    _getTransformProps(values = [0, 0, 0]) {
        let prop = ''
        let props = ''
        let propsObj = []
        let unit

        for (let i = 0; i < values.length; i++) {
            unit = (this.unitChar === '%' && values[i] !== 0) ? '%' : 'px'

            props += prop = values[i]

            props += unit
            prop += unit

            props += (values.length - 1) === i ? '' : ', '

            propsObj.push(prop)
        }

        return propsObj.length === 3 ? `translate3d(${props})` : `translateX(${propsObj[0]}) translateY(${propsObj[1]})`
    }
}
