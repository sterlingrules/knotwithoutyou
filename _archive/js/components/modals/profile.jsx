import React from 'react'

import User from '../../models/user.jsx'
import { Modal } from '../modals.jsx'

const TextField = (props) => {
    return (
        props.value ? (
            <input type="text" className="form-item" name={props.name} value={props.value} onChange={props.onChange} placeholder={props.placeholder} />
        ) : (
            <input type="text" className="form-item" />
        )
    )
}

const RadioButton = (props) => {
    let regex = new RegExp(props.value, 'i')
    let checked = props.checked ? !!(props.checked.search(regex) >= 0) : false

    return (
        props.value ? (
            <div className="form-item">
                <input type="radio" className="btn btn-radio" name={props.name} value={props.value} onChange={props.onChange} placeholder={props.placeholder} checked={checked} />
                <label>{props.value}</label>
            </div>
        ) : (
            <input type="radio" className="btn btn-radio" />
        )
    )
}

const Button = (props) => {
    return (
        <div className="btn btn-action btn-fullwidth" onClick={props.onClick}>
             {props.value}
        </div>
    )
}

class Profile extends React.Component {
    constructor(props) {
        super(props)

        this.onChange = this.onChange.bind(this)

        this.state = {}
    }

    componentDidMount() {
        User.getCurrent((user) => {
            this.setState({ user: user })

            // Testing
            if (user.id) {
                setTimeout(() => Modal.show('profile'), 500)
            }
        })
    }

    onChange(evt) {
        let user = this.state.user

        user[evt.target.name] = evt.target.value

        this.setState({ user: user })
    }

    render() {
        let user = this.state.user || {}

        return (
            <div id="modal-profile" className="modal">
                <figure className="avatar" style={{ backgroundImage: `url(${user.profileImg}?type=large)` }}></figure>
                <form>
                    <TextField name="displayName" value={user.displayName} placeholder="Full Name" onChange={this.onChange} />
                    <TextField name="email" value={user.email} placeholder="Email" onChange={this.onChange} />

                    <address className="form-group">
                        <TextField name="address_one" value={user.address_one} placeholder="Address One" onChange={this.onChange} />
                        <TextField name="address_two" value={user.address_two} placeholder="Address Two" onChange={this.onChange} />
                        <fieldset className="citystate">
                            <TextField name="city" value={user.city} placeholder="City" onChange={this.onChange} />
                            <TextField name="state" value={user.state} placeholder="State" onChange={this.onChange} />
                            <TextField name="zip" value={user.zip} placeholder="Zipcode" onChange={this.onChange} />
                        </fieldset>
                    </address>

                    <fieldset className="form-group">
                        <label className="strong">Attending?</label>
                        <RadioButton name="attending" value="Yes" checked={user.attending} onChange={this.onChange} />
                        <RadioButton name="attending" value="No" checked={user.attending} onChange={this.onChange}  />
                        <RadioButton name="attending" value="Maybe" checked={user.attending} onChange={this.onChange}  />
                    </fieldset>

                    <fieldset className="modal-action text-right">
                        <p>Please look over the contact information we have for you.</p>
                        <br />
                        <Button value="Looks good" />
                    </fieldset>
                </form>
            </div>
        )
    }
}

export default Profile
