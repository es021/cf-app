import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';

export default class ProfileCard extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        var user = this.props.user;
        console.log(user);
        var styleParent = {
            color: (this.props.theme == "dark") ? "black" : "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            wordBreak: "break-all",
            margin: "20px 5px",
            lineHeight: "20px"
        };


        var dimension = "100px";
        var stylePicture = {
            height: dimension,
            width: dimension,
            backgroundImage: `url('${user.img_url}')`,
            backgroundSize: user.img_size,
            backgroundPosition: user.img_pos,
            backgroundColor: "white",
            borderRadius: "100%"
        }

        var style_h1 = {
            marginTop: "3px",
            fontSize: "16px"
        };

        var style_h2 = {
            fontSize: "13px",
            opacity: "0.80"
        };
        //activeClassName="active"
        return(<div style={styleParent}>
            <div style={stylePicture}></div>
            <div style={style_h1}>{user.first_name}</div>
            <div style={style_h2}>{user.last_name}</div>
            {(this.props.displayOnly) ? "" : <small><NavLink  to={`/app/profile_edit`} >Edit Profile</NavLink></small>}
        </div>);
    }
}