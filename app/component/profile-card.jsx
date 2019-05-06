import React, { Component } from 'react';
import { ImgConfig } from '../../config/app-config';
import PropTypes from 'prop-types';
import { ButtonIcon } from './buttons';
import * as layoutActions from '../redux/actions/layout-actions';

import ProfileCardImg, { getPositionStr, getSizeStr, BANNER_HEIGHT } from '../component/profile-card-img';
import Form, { toggleSubmit } from '../component/form';

require("../css/profile-card.scss");
/*
 This Component will create a standardize circle picture and title and subtitle and also some children to be append to body
 */


export const PCType = {
    STUDENT: "student",
    RECRUITER: "recruiter",
    COMPANY: "company",
    BANNER: "banner",
};
const pc = "pc-";

// return in from {img_url, img_size, img_pos}
export const getImageObj = function (obj) {
    if (obj != null && typeof obj !== "undefined") {
        var r = {};
        r.img_url = obj.img_url;
        r.img_size = obj.img_size;
        r.img_pos = (typeof obj.img_pos != "undefined") ? obj.img_pos : obj.img_position;
        return r;
    } else {
        return getDefaultProfileImg(PCType.STUDENT);
    }
}

export const createImageElement = function (img_url, img_pos, img_size, img_dimension, className, type = PCType.STUDENT, customStyle) {
    return <ProfileCard type={type} img_url={img_url} img_pos={img_pos} img_size={img_size}
        title={null} body={null} subtitle={null} img_dimension={img_dimension}
        className={className} customStyle={customStyle}></ProfileCard>;
}

export const getDefaultProfileImg = function (type, url = null) {
    if (url == null || url == "null") {
        switch (type) {
            case PCType.STUDENT:
                url = ImgConfig.DefUser;
                break;
            case PCType.RECRUITER:
                url = ImgConfig.DefUser;
                break;
            case PCType.COMPANY:
                url = ImgConfig.DefCompany;
                break;
            case PCType.BANNER:
                url = ImgConfig.DefCompanyBanner;
                break;
        }
    }

    return {
        backgroundImage: `url('${url}')`,
        backgroundSize: "cover",
        backgroundPosition: "50% 50%"
    };
}

export const getStyleImageObj = function (type, img_url, img_size, img_pos, dimension) {

    var stylePicture = null;

    if (typeof img_url === "undefined" || img_url == null || img_url == "") {
        stylePicture = getDefaultProfileImg(type);
    } else {
        stylePicture = {
            backgroundImage: `url('${img_url}')`,
            backgroundSize: getSizeStr(img_size),
            backgroundPosition: getPositionStr(dimension, img_pos, "px", true)
        }
    }

    if (type == PCType.BANNER) {
        stylePicture["height"] = BANNER_HEIGHT + "px";
        stylePicture["width"] = "100%";
        stylePicture["borderRadius"] = "0%"
    } else {
        stylePicture["height"] = dimension
        stylePicture["width"] = dimension;
    }


    return stylePicture;
}

export default class ProfileCard extends React.Component {
    constructor(props) {
        super(props);
        this.openPictureOps = this.openPictureOps.bind(this);
    }

    openPictureOps(stylePicture) {
        var type = (this.props.type == PCType.COMPANY) ? "company" : "user";

        if (this.props.type == PCType.BANNER) {
            type = "banner";
        }

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
            width: this.props.custom_width
        };

        if (this.props.customStyleParent != null) {
            styleParent = {
                ...styleParent,
                ...this.props.customStyleParent
            }
        }

        var dimension = (this.props.img_dimension) ? this.props.img_dimension : "100px";

        var stylePicture = getStyleImageObj(this.props.type,
            this.props.img_url, this.props.img_size, this.props.img_pos, dimension);


        if (this.props.customStyle != null) {
            stylePicture = {
                ...stylePicture,
                ...this.props.customStyle
            }
        }

        // if (typeof this.props.img_url === "undefined" || this.props.img_url == null || this.props.img_url == "") {
        //     stylePicture = this.getDefaultProfileImg(this.props.type);
        // } else {
        //     stylePicture = {
        //         backgroundImage: `url('${this.props.img_url}')`,
        //         backgroundSize: getSizeStr(this.props.img_size),
        //         backgroundPosition: getPositionStr(dimension, this.props.img_pos, "px", true)
        //     }
        // }

        // stylePicture["height"] = dimension;
        // stylePicture["width"] = dimension;

        // bagde used in queue card
        var badge = null;
        if (this.props.badge != null) {

            badge = <div className={`${pc}badge ${(this.props.badge == "") ? "small" : ""}`}>
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

        // New Banner for profile pic
        let banner = null;
        if(this.props.addBanner){
            let dimensionBanner = {
                x : this.props.custom_width,
                y : this.props.banner_height
            }
            let styleBanner =  getStyleImageObj(PCType.BANNER, this.props.banner_url, 
                this.props.banner_size, this.props.banner_pos, dimensionBanner);
            styleBanner.height = this.props.banner_height;
            banner = <div className={`${pc}banner`} style={styleBanner}></div>
        }
       
        //this.openPictureOps(stylePicture);
        return (<div onClick={this.props.onClick} className={className} style={styleParent}>
            {banner}
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
    custom_width: PropTypes.string,
    type: PropTypes.oneOf([PCType.STUDENT, PCType.RECRUITER, PCType.COMPANY]).isRequired,
    id: PropTypes.number, // id to adjust save profile image
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.any,
    badge: PropTypes.string,
    badge_tooltip: PropTypes.string,
    onClick: PropTypes.func,

    addBanner : PropTypes.bool,
    banner_height : PropTypes.string,
    banner_url: PropTypes.string,
    banner_pos: PropTypes.string,
    banner_size: PropTypes.string,
    
    img_url: PropTypes.string,
    img_pos: PropTypes.string,
    img_size: PropTypes.string,
    add_img_ops: PropTypes.bool,
    img_dimension: PropTypes.string,
    customStyleParent : PropTypes.object,
    customStyle: PropTypes.object,
    className: PropTypes.string,
    theme: PropTypes.oneOf(["dark"]),
    header: PropTypes.element, // put as the first child of profile card,
    body: PropTypes.element // append to pc-body
};

ProfileCard.defaultProps = {
    addBanner : false,
    customStyle: null,
    customStyleParent : null
}
