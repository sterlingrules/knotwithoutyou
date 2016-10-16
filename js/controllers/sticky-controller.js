const STICKY_ATTRIBUTE = 'data-sticky'
const SCROLL_ATTRIBUTE = 'data-scroll'

const StickyController = {
    init() {
        this.stickyEl = document.querySelector(`[${STICKY_ATTRIBUTE}]`)
        this.scrollEl = document.querySelector(`[${SCROLL_ATTRIBUTE}]`)
        this.scrollTop = this.stickyEl.getBoundingClientRect().top + window.scrollY
        this.distance = this.scrollEl.offsetHeight
        this.stickyBottom = this.scrollTop + this.distance
        this.windowHeight = window.innerHeight

        this.setScrollPosition = this.setScrollPosition.bind(this)
        this.reset = this.reset.bind(this)
        this.setFixed = this.setFixed.bind(this)

        this.listen()
        this.update()
    },

    listen() {
        window.addEventListener('scroll', this.setScrollPosition, false)
    },

    update() {
        requestAnimationFrame(() => {
            let pastScrollTop = this.scrollPosition > this.scrollTop
            let pastScrollEnd = this.scrollPosition + this.windowHeight > this.stickyBottom
            let beforeScrollTop = this.scrollPosition < this.scrollTop
            let beforeScrollEnd = this.scrollPosition + this.windowHeight < this.stickyBottom

            if (beforeScrollTop) {
                this.reset()
            }

            if (pastScrollTop && beforeScrollEnd) {
                this.setFixed(true)
            }

            if (pastScrollEnd) {
                this.setFixed(false)
            }

            this.update()
        })
    },

    setFixed(state) {
        if (this.isFixed === state) return

        if (state) {
            this.stickyEl.style.position = 'fixed'
            this.stickyEl.style.top = '0'
            this.stickyEl.style.bottom = 'auto'
        } else {
            this.stickyEl.style.position = 'absolute'
            this.stickyEl.style.top = 'auto'
            this.stickyEl.style.bottom = '0'
        }

        this.isFixed = state
        this.isCleared = false
    },

    reset() {
        if (this.isCleared) return

        this.stickyEl.removeAttribute('style')

        this.isCleared = true
        this.isFixed = null
    },

    setScrollPosition() {
        // this.scrollposition = Math.round(window.scrollY - this.scrollTop)
        this.scrollPosition = Math.round(window.scrollY)
    }
}

export default StickyController
