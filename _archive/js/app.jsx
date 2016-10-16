import { STAMPLAY_APP_ID } from './constants.jsx'

import React from 'react'
import ReactDOM from 'react-dom'

import User from './models/user.jsx'

import Invitation from './components/invitation.jsx'
import { Modals, Modal } from './components/modals.jsx'

Stamplay.init(STAMPLAY_APP_ID)

const initialize = () => {
    User.getCurrent((user) => {
        console.log(user);

        ReactDOM.render((
            <Invitation />
        ), document.querySelector('#invitation'))

        ReactDOM.render((
            <Modals />
        ), document.querySelector('#modals'))
    })

}

initialize()
