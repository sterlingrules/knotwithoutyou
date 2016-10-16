import React from 'react'

import Profile from './modals/profile.jsx'

import { events } from '../helpers.jsx'

const ACTIVE_CLASS = 'active'

export const Modal = (function() {
    return {
        init() {
            this.modalOverlay = document.getElementById('modal-overlay')

            this.modalOverlay.addEventListener('click', (evt) => {
                evt.target.classList.remove(ACTIVE_CLASS)
                this.hide()
            }, false)

            window.addEventListener('keyup', (evt) => {
                if (evt.keyCode == 27) {
                    this.hide()
                }
            }, false)
        },

        show(id) {
            this.modal = document.getElementById(`modal-${id}`)

            events.publish(id, { type: 'show' })

            document.body.classList.add(`modal-${ACTIVE_CLASS}`)
            this.modal.classList.add(ACTIVE_CLASS)
            this.modalOverlay.classList.add(ACTIVE_CLASS)
        },

        hide() {
            if (!this.modal) {
                return;
            }

            let modals = document.querySelectorAll('.modal.active')
            let name

            for (var i = 0; i < modals.length; i++) {
                name = modals[i].getAttribute('id')
                events.publish(name, { type: 'hide' })
            }

            document.body.classList.remove(`modal-${ACTIVE_CLASS}`)
            this.modal.classList.remove(ACTIVE_CLASS)
            this.modalOverlay.classList.remove(ACTIVE_CLASS)
            this.modal = null
        },

        toggle(id) {
            if (this.modal) {
                this.hide()
            } else {
                this.show(id)
            }
        }
    }
}())

export class Modals extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        Modal.init()
    }

    render() {
        return (
            <div>
                <Profile />
                <div id="modal-overlay" className="modal-overlay"></div>
            </div>
        )
    }
}
