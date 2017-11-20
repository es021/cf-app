import React, { Component } from 'react';
import * as axiosUser from '../redux/axios/user-axios';

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

        axiosUser.loadUser(id).then((res) => {
            this.setState(() => {
                return {data: res.data.data.user, loading: false}
            })
        });
    }

    render() {
        var id = null;
        console.log("render", "UserPage");

        var user = this.state.data;
        var view =
                (this.state.loading)
                ?
                <div>"Loading..."</div>
                :
                <div>
                    <ProfileCard type="student" displayOnly={true} theme='dark' data={user}></ProfileCard>
                    User : {user.ID}
                    , {user.first_name}
                    , {user.last_name}
                </div>

        return (view);
    }
};