import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';
import {ImgConfig} from '../../config/app-config';

require("../css/profile-card.scss");

/*
 * displayOnly : bool
 * data : dataObject
 * type : student | recruiter | company
 */
export default class ProfileCard extends React.Component {
    constructor(props) {
        super(props);
        this.TYPE_STUDENT = "student";
        this.TYPE_RECRUITER = "recruiter";
        this.TYPE_COMPANY = "company";
        this.getDefaultProfileImg = this.getDefaultProfileImg.bind(this);
    }

    getDefaultProfileImg() {
        var url = "";
        switch (this.props.type) {
            case this.TYPE_STUDENT:
                url = ImgConfig.DefUser;
                break;
            case this.TYPE_RECRUITER:
                url = ImgConfig.DefUser;
                break;
            case this.TYPE_COMPANY:
                url = ImgConfig.DefCompany;
                break;
        }

        return {
            backgroundImage: `url('${url}')`,
            backgroundSize: "cover",
            backgroundPosition: "50% 50%"
        };
    }

    render() {
        console.log("Render ProfileCard");
        var data = this.props.data;
        var styleParent = {
            color: (this.props.theme == "dark") ? "black" : "white",
        };

        var stylePicture = null;
        if (typeof data.img_url === "undefined" || data.img_url == null || data.img_url == "") {
            stylePicture = this.getDefaultProfileImg();
        } else {
            stylePicture = {
                backgroundImage: `url('${data.img_url}')`,
                backgroundSize: data.img_size,
                backgroundPosition: data.img_pos
            }
        }

        var dimension = "100px";
        stylePicture["height"] = dimension;
        stylePicture["width"] = dimension;

        //activeClassName="active"
        return(<div className="profile-card" style={styleParent}>
            <div className="picture" style={stylePicture}></div>
            <div className="title">{data.first_name}</div>
            <div className="subtitle">{data.last_name}</div>
            <div className="body">
                {(this.props.displayOnly) ? "" : <small><NavLink  to={`/app/profile_edit`} >Edit Profile</NavLink></small>}
            </div>
        </div>);
    }
}