const Store = {
    // options.type {String}
    // options.key {String}
    // options.id {String}
    // options.data {Object}
    // options.expire {Boolean}

    save(options) {
        if (!options.data) return

        let term = this._formatTerm(options)
        let data = options.data

        if (options.expire) {
            options.data.expire_date = options.expire
        }

        localStorage.setItem(term, JSON.stringify(options.data))
    },

    get(options) {
        let term    = this._formatTerm(options)
        let data    = JSON.parse(localStorage.getItem(term))
        let expired = this._willExpire(data)

        if (expired) data = []

        return data
    },

    remove(term) {
        localStorage.removeItem(term)
    },

    _formatTerm(options) {
        let type = options.type
        let key  = options.key ? `:${options.key}` : ''
        let id   = options.id  ? `:${options.id}` : ''

        return `${type}${key}${id}`
    },

    _willExpire(data) {
        data = data || []
        let date = new Date().getTime()

        if (data.expire) {
            return data.expire_data < date
        }

        return false
    }
}

export default Store
