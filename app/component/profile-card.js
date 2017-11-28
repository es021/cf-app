import React, { Component } from 'react';
import {ImgConfig} from '../../config/app-config';
import PropTypes from 'prop-types';

require("../css/profile-card.scss");

/*
 This Component will create a standardize circle picture and title and subtitle and also some children to be append to body
 */

export const PCType = {
    STUDENT: "student",
    RECRUITER: "recruiter",
    COMPANY: "company"
};


export default class ProfileCard extends React.Component {
    constructor(props) {
        super(props);
        this.getDefaultProfileImg = this.getDefaultProfileImg.bind(this);
    }

    getDefaultProfileImg() {
        var url = "";
        switch (this.props.type) {
            case PCType.STUDENT:
                url = ImgConfig.DefUser;
                break;
            case PCType.TYPE_RECRUITER:
                url = ImgConfig.DefUser;
                break;
            case PCType.TYPE_COMPANY:
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
        var styleParent = {
            color: (this.props.theme == "dark") ? "white" : "black",
        };

        var stylePicture = null;
        if (typeof this.props.img_url === "undefined" || this.props.img_url == null || this.props.img_url == "") {
            stylePicture = this.getDefaultProfileImg();
        } else {
            stylePicture = {
                backgroundImage: `url('${this.props.img_url}')`,
                backgroundSize: this.props.img_size,
                backgroundPosition: this.props.img_pos
            }
        }

        var dimension = (this.props.img_dimension) ? this.props.img_dimension : "100px";
        stylePicture["height"] = dimension;
        stylePicture["width"] = dimension;

        var pc = "pc-";
        return(<div className="profile-card" style={styleParent}>
            <div className={`${pc}picture`} style={stylePicture}></div>
            <div className={`${pc}title`}>{this.props.title}</div>
            {(this.props.subtitle) ? <div className={`${pc}subtitle`}>{this.props.subtitle}</div> : null}
            <div className={`${pc}body`}>
                {(this.props.body) ? this.props.body : null}
            </div>
        </div>);
    }
}

ProfileCard.propTypes = {
    type: PropTypes.oneOf([PCType.STUDENT, PCType.RECRUITER, PCType.COMPANY]).isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    img_url: PropTypes.string,
    img_pos: PropTypes.string,
    img_size: PropTypes.string,
    img_dimension: PropTypes.string,
    theme: PropTypes.oneOf(["dark"]),
    body: PropTypes.element // append to pc-body
};