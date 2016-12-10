import _ from 'underscore'

const prefixKeys = [
    'transform'
]

const _setPrefix = (element, value, key) => {
    if (prefixKeys.indexOf(key) >= 0) {
        element.style[`-webkit-${key}`] = value
        element.style[`-moz-${key}`] = value
    }
}

export const setStyle = (element, styles) => {
    _.each(styles, (value, key, list) => {
        element.style[key] = value
        _setPrefix(element, value, key)
    })
}

export const delay = (function(){
    let timer = 0
    return (callback, ms = 250) => {
        clearTimeout (timer)
        timer = setTimeout(callback, ms)
    }
})()
