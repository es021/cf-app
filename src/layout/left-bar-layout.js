import React, { Component } from 'react';

import ProfileCard from '../component/profile-card';

export default class LeftBarLayout extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        var user = {
            email: "zulsarhan.shaari@gmail.com",
            first_name: "Zulsarhan",
            last_name: "Shaari"
        };

        var profile = <div className="left_bar_profile">
            <ProfileCard user={user}></ProfileCard>
        </div>;

        var nav = <div className="left_bar_nav">
            {this.props.menuList}
        </div>;

        return(<left_bar>
            {profile}
            {nav}
        </left_bar>);
    }
}