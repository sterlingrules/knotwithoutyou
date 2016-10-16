import React from 'react'

import User from '../models/user.jsx'

class Invitation extends React.Component {
    constructor(props) {
        super(props)
    }

    login(evt) {
        evt.preventDefault()

        if (User.isLoggedIn()) {
            User.logout()
        } else {
            User.login()
        }
    }

    render() {
        return (
            <div>
                <div className="invitation-scrim"></div>
                <div className="wrapper">
                    <a href="#" className="section-padding copy-margin color-cream" onClick={this.login}>
                        <div className="typography-subheadline copy-margin">
                            We are tying the knot, but
                        </div>
                        <div className="headline headline-alt typography-headline text-center letter-spacing-1">
                            kn<span className="letter-spacing-t">o</span>t w<span className="letter-spacing-t">i</span><span className="letter-spacing-2">th</span>o<span className="letter-spacing-t">u</span>t you
                        </div>
                        <div className="typography-subheadline copy-margin text-right">
                            <p>Please confirm your<br />contact information with</p>
                            {User.isLoggedIn() ? (
                                <div className="btn btn-cancel strong">
                                    Sign out
                                </div>
                            ) : (
                                <div className="btn btn-facebook strong">
                                    Facebook
                                </div>
                            )}
                        </div>
                    </a>
                </div>
            </div>
        )
    }
}

export default Invitation
