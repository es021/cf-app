import React, { Component } from 'react';
import {loadUser} from '../redux/actions/user-actions';
import PropTypes from 'prop-types';

import ProfileCard from '../component/profile-card';

export default class UserPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: null,
            loading: true,
        }
    }

    componentWillMount() {
        var id = null;

        if (this.props.match) {
            id = this.props.match.params.id
        } else {
            id = this.props.id;
        }

        console.log("UserPage", "componentWillMount");

        loadUser(id).then((res) => {
            this.setState(() => {
                return {data: res.data.data.user, loading: false}
            })
        });
    }

    render() {
        var id = null;
        var user = this.state.data;
        var view = null;

        if (this.state.loading) {
            view = <div>Loading...</div>
        } else {
            var pcBody = <div>
                User : {user.ID}
                , {user.first_name}
                , {user.last_name}
            </div>;
            view = <div>
                <ProfileCard type="student"
                             title={user.first_name} subtitle={user.last_name}
                             img_url={user.img_url} img_pos={user.img_pos} img_size={user.img_size}
                             body={pcBody}></ProfileCard>
            </div>;
        }

        return (view);
    }
};

UserPage.propTypes = {
    id: PropTypes.number
};