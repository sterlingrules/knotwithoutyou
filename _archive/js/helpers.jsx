// import Analytics from './models/analytics.jsx'

export const delay = (function(){
    let timer = 0
    return (callback, ms) => {
        clearTimeout (timer)
        timer = setTimeout(callback, ms)
    }
})()

export const events = (function(){
    let topics = {}
    let hOP    = topics.hasOwnProperty

    return {
        subscribe: function(topic, listener) {
            // Create the topic's object if not yet created
            if (!hOP.call(topics, topic)) topics[topic] = []

            // Add the listener to queue
            let index = topics[topic].push(listener) -1

            // Provide handle back for removal of topic
            return {
                remove: function() {
                    delete topics[topic][index]
                }
            }
        },

        publish: function(topic, info) {
            // If the topic doesn't exist, or there's no listeners in queue, just leave
            if (!hOP.call(topics, topic)) return

            // Cycle through topics queue, fire!
            topics[topic].forEach(function(item) {
                let evt  = info != undefined ? info : {}
                let _evt = evt.topic = topic

                // Analytics.track('event', _evt)

                item(evt)
            })
        }
    }
})()

export const error = (err) => JSON.parse(err.message).error

export const arrayUnique = (array) => {
    var a = array.concat()

    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j]) {
                a.splice(j--, 1)
            }
        }
    }

    return a
}

export const defaults = (array1, array2) => {
    let keys1 = Object.keys(array1)
    let keys2 = Object.keys(array2)
    let keys = arrayUnique(keys1.concat(keys2))
    let defaults = {}

    for (let i = 0; i < keys.length; i++) {
        defaults[keys[i]] = array2[keys[i]]

        if (typeof array2[keys[i]] === 'undefined') {
            defaults[keys[i]] = array1[keys[i]]
        }
    }

    return defaults
}

export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


//
// Move these to the local Store model
//
export const setExpire = (daysFromNow = 1) => {
    return new Date((new Date()).getTime() + (daysFromNow * 86400000))
}

export const cloneObj = (obj) => {
    return JSON.parse(JSON.stringify(obj))
}
