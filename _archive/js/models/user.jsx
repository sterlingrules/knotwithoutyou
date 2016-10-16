import { SOCIAL_LOGIN, PER_PAGE } from '../constants.jsx'
import { cloneObj } from '../helpers.jsx'

import Store from './store.jsx'

const User = {
    storeOpts: {
        type: 'user'
    },

    options: {
        page: 1,
        per_page: PER_PAGE
    },

    handleError(err) {
        events.publish('status', error(err))
    },

    getCurrent(callback) {
        let _storeOpts = cloneObj(this.storeOpts)
        let hasCallback = (typeof callback == 'function')
        let user = Store.get(_storeOpts)

        if (!this.isLoggedIn()) {
            return hasCallback ? callback({ id: null }) : { id: null }
        }

        this.isLoggingIn(false)

        if (user) return hasCallback ? callback(user) : user

        Stamplay.User.currentUser()
            .then((reply) => {
                reply.user = this._transform(reply.user)

                _storeOpts.data = reply.user || null
                Store.save(_storeOpts)

                // Analytics.trackUser(reply.user)

                return hasCallback ? callback(reply.user) : reply.user
            }, this.errorHandle)
    },

    login() {
        this.isLoggingIn(true)
        return Stamplay.User.socialLogin(SOCIAL_LOGIN)
    },

    logout(callback) {
        Stamplay.User.logout()

        delete localStorage.token
        localStorage.clear()

        if (callback) callback()
    },

    isLoggedIn() {
        let origin = window.location.origin
        return !!localStorage[origin + '-jwt']
    },

    isLoggingIn(state) {
        let ls = window.localStorage

        if (typeof state === 'boolean') {
            ls.setItem('login', state)
        } else {
            return ls.getItem('login')
        }
    },


    //
    // Private
    //

    _transform(user) {
        // Already signed up
        if (user.dt_create !== user.dt_update) {
            user.first_time = false
            return user
        }

        // New user
        if (user.identities) {
            let data = user.identities[SOCIAL_LOGIN]._json.data

            user.bio = data.bio
            user.instagram = data.username
            user.emailAddress = data.email
            user.website = data.website
            user.first_time = true

            this.update(user.id, user, (user) => {})
        }

        return user
    }
}

export default User
