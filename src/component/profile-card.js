import React, { Component } from 'react';
import {NavLink} from 'react-router-dom'
import {Config} from '../config';
export default class ProfileCard extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        var user = this.props.user;
        var styleParent = {
            color: "white",
            display:"flex",
            flexDirection:"column",
            alignItems:"center",
            wordBreak:"break-all",
            margin:"20px 5px",
            lineHeight:"20px"
        };


        var dimension = "75px";
        var stylePicture = {
            height: dimension,
            width: dimension,
            backgroundColor: "white",
            borderRadius: "100%"
        }

        var style_h1 = {
            marginTop:"3px",
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
            <small><NavLink  to={`/app/profile_edit`} >Edit Profile</NavLink></small>
        </div>);
    }
}