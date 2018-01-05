import React, { Component } from 'react';
import { ImgConfig } from '../../config/app-config';
import PropTypes from 'prop-types';
import { ButtonIcon } from './buttons';
import * as layoutActions from '../redux/actions/layout-actions';

import ProfileCardImg, { getPositionStr } from '../component/profile-card-img';
import Form, { toggleSubmit } from '../component/form';

require("../css/profile-card.scss");
/*
 This Component will create a standardize circle picture and title and subtitle and also some children to be append to body
 */

export const PCType = {
    STUDENT: "student",
    RECRUITER: "recruiter",
    COMPANY: "company"
};
const pc = "pc-";


export default class ProfileCard extends React.Component {
    constructor(props) {
        super(props);
        this.getDefaultProfileImg = this.getDefaultProfileImg.bind(this);
        this.openPictureOps = this.openPictureOps.bind(this);
    }

    getDefaultProfileImg() {
        var url = "";
        switch (this.props.type) {
            case PCType.STUDENT:
                url = ImgConfig.DefUser;
                break;
            case PCType.RECRUITER:
                url = ImgConfig.DefUser;
                break;
            case PCType.COMPANY:
                url = ImgConfig.DefCompany;
                break;
        }

        return {
            backgroundImage: `url('${url}')`,
            backgroundSize: "cover",
            backgroundPosition: "50% 50%"
        };
    }

    openPictureOps(stylePicture) {
        var type = (this.props.type == PCType.COMPANY) ? "company" : "user";

        layoutActions.storeUpdateFocusCard("Edit Image", ProfileCardImg,
            {
                img_url: this.props.img_url,
                id: this.props.id,
                type: type,
                stylePicture: stylePicture
            }
        );
    }

    render() {
        var styleParent = {
            color: (this.props.theme == "dark") ? "white" : "black",
        };
        var stylePicture = null;
        var dimension = (this.props.img_dimension) ? this.props.img_dimension : "100px";

        if (typeof this.props.img_url === "undefined" || this.props.img_url == null || this.props.img_url == "") {
            stylePicture = this.getDefaultProfileImg();
        } else {
            stylePicture = {
                backgroundImage: `url('${this.props.img_url}')`,
                backgroundSize: this.props.img_size,
                backgroundPosition: getPositionStr(dimension, this.props.img_pos, "px", true)
            }
        }

        stylePicture["height"] = dimension;
        stylePicture["width"] = dimension;

        // bagde used in queue card
        var badge = null;
        if (this.props.badge) {
            badge = <div className={`${pc}badge`}>
                {(this.props.badge_tooltip) ?
                    <span>
                        <div className={`${pc}badge-tooltip-arrow`}></div>
                        <div className={`${pc}badge-tooltip`}>{this.props.badge_tooltip}</div>
                    </span> : null}
                {this.props.badge}
            </div>;
        }

        // only for edit profile and edit company
        var img_ops = null;
        if (this.props.add_img_ops) {
            img_ops = <div className={`${pc}picture-ops`}>
                <ButtonIcon icon="edit" theme="dark"
                    onClick={() => this.openPictureOps(stylePicture)}></ButtonIcon>
            </div>
        }
        var className = "profile-card";
        if (this.props.className) {
            className += " " + this.props.className;
        }

        //this.openPictureOps(stylePicture);
        return (<div onClick={this.props.onClick} className={className} style={styleParent}>
            {(this.props.header) ? this.props.header : null}
            {badge}
            <div className={`${pc}picture`} style={stylePicture}>
                {img_ops}
            </div>
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
    id: PropTypes.number, // id to adjust save profile image
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.any,
    badge: PropTypes.string,
    badge_tooltip: PropTypes.string,
    onClick: PropTypes.func,
    img_url: PropTypes.string,
    img_pos: PropTypes.string,
    img_size: PropTypes.string,
    add_img_ops: PropTypes.bool,
    img_dimension: PropTypes.string,
    className: PropTypes.string,
    theme: PropTypes.oneOf(["dark"]),
    header: PropTypes.element, // put as the first child of profile card,
    body: PropTypes.element // append to pc-body
};