import React, { Component } from 'react';
import {ImgConfig} from '../../config/app-config';
import PropTypes from 'prop-types';
import {ButtonIcon} from './buttons';
import * as layoutActions from '../redux/actions/layout-actions';
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
class ProfileCardImg extends  React.Component {
    constructor(props) {
        super(props);
        this.state = {
            backgroundImage: this.props.stylePicture.backgroundImage,
            backgroundSize: this.props.stylePicture.backgroundSize, //default : cover
            backgroundPosition: this.props.stylePicture.backgroundPosition // default : 50% 50%
        };

        this.editPos = this.editPos.bind(this);
        this.editSize = this.editSize.bind(this);
        this.ZOOM_IN = "ZI";
        this.ZOOM_OUT = "ZO";

        this.POS_X;
        this.POS_Y;
        this.SIZE_X;
        this.SIZE_Y;
        this.ZOOM_OFFSET = 5;
        this.MIN_POS_X = 0;
        this.MAX_POS_X = 100;
        this.MIN_POS_Y = 0;
        this.MAX_POS_Y = 100;
        this.POS_OFFSET = 1;
        this.EVENT_INTERVAL = 10;
        this.dimension_size = null;
    }

    componentWillMount() {
        this.initImageProperties();
    }

    initImageProperties() {
        this.SIZE_X = this.state.backgroundSize.split(" ")[0];
        this.SIZE_Y = this.state.backgroundSize.split(" ")[1];
        if (typeof this.SIZE_Y == 'undefined') {
            this.SIZE_X = "100%";
            this.SIZE_Y = "auto";
        }
        //set to dimension_size
        this.getImageDimension(this.props.img_url);

        this.POS_X = this.state.backgroundPosition.split(" ")[0];
        this.POS_Y = this.state.backgroundPosition.split(" ")[1];

        this.debug();
    }

    getImageDimension(url) {
        //if already set
        if (this.SIZE_X === "auto") {
            this.dimension_size = "y";
            return;
        } else if (this.SIZE_Y === "auto") {
            this.dimension_size = "x";
            return;
        }

        // new image
        var img = new Image();
        img.onload = () => {
            var height = img.height;
            var width = img.width;
            if (height < width) {
                this.dimension_size = "y";
            } else {
                this.dimension_size = "x";
            }

            console.log(this.dimension_size);

        };

        img.src = url;
    }

    debug() {
        console.log(this.POS_X);
        console.log(this.POS_Y);
        console.log(this.SIZE_X);
        console.log(this.SIZE_Y);
    }
    editPos() {

    }

    editSize(action) {
        this.setState((prevState) => {
            console.log(prevState);

            var offset = (action === this.ZOOM_IN) ? this.ZOOM_OFFSET : -1 * this.ZOOM_OFFSET;
            console.log(this.dimension_size);
            switch (this.dimension_size) {
                case 'x':
                    var temp_SIZE_X = "";
                    //temp_SIZE_X = dom.css("background-size").split("%")[0];
                    temp_SIZE_X = this.SIZE_X.split("%")[0];
                    temp_SIZE_X = Number(temp_SIZE_X) + offset;

                    if (isNaN(temp_SIZE_X)) {
                        console.log("Return 1");
                        this.dimension_size = 'y';
                        return;
                    }

                    if (temp_SIZE_X < this.MIN_SIZE || temp_SIZE_X > this.MAX_SIZE) {
                        console.log("Return 2");
                        return;
                    }

                    this.SIZE_X = temp_SIZE_X + "%";
                    this.SIZE_Y = "auto";
                    prevState["backgroundSize"] = this.SIZE_X + " " + this.SIZE_Y;
                    break;

                case 'y':
                    var temp_SIZE_Y = "";
                    //temp_SIZE_Y = dom.css("background-size").split(" ");
                    temp_SIZE_Y = this.SIZE_Y.split("%")[0];
                    temp_SIZE_Y = Number(temp_SIZE_Y) + offset;
                    if (isNaN(temp_SIZE_Y)) {
                        this.dimension_size = 'x';
                        return;
                    }

                    if (temp_SIZE_Y < this.MIN_SIZE || temp_SIZE_Y > this.MAX_SIZE) {
                        return;
                    }

                    this.SIZE_Y = temp_SIZE_Y + "%";
                    this.SIZE_X = "auto";
                    prevState["backgroundSize"] = this.SIZE_X + " " + this.SIZE_Y;
                    break;
            }

            console.log("finish");
            this.debug();
            console.log(prevState);

            return prevState;
        });
    }

    render() {
        var dimension = "150px";
        var stylePicture = this.state;
        stylePicture["height"] = dimension;
        stylePicture["width"] = dimension;
        var stylePictureBack = Object.assign({}, stylePicture);
        stylePictureBack["position"] = "absolute";
        stylePictureBack["opacity"] = "0.5";
//                <div style={stylePictureBack}></div>

        var btn_size = "20px";
        return (<div className="profile-card edit-img">
            <div className={`${pc}picture`} style={stylePicture}></div>
            <ButtonIcon size={btn_size} icon="search-plus" theme="dark" onClick={() => this.editSize(this.ZOOM_IN)}></ButtonIcon>
            <ButtonIcon  size={btn_size} icon="search-minus" theme="dark" onClick={() => this.editSize(this.ZOOM_OUT)}></ButtonIcon>
        </div>);
    }
}

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

    openPictureOps(stylePicture) {
        layoutActions.storeUpdateFocusCard("Edit Image", ProfileCardImg, {img_url: this.props.img_url,
            stylePicture: stylePicture});
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
        var img_ops = null;
        if (this.props.add_img_ops) {
            img_ops = <div className={`${pc}picture-ops`}>
                <ButtonIcon icon="edit" theme="dark" onClick={() => this.openPictureOps(stylePicture)}></ButtonIcon>
            </div>
        }

        this.openPictureOps(stylePicture);
        return(<div className="profile-card" style={styleParent}>
            {(this.props.header) ? this.props.header : null}
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
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    img_url: PropTypes.string,
    img_pos: PropTypes.string,
    img_size: PropTypes.string,
    add_img_ops: PropTypes.bool,
    img_dimension: PropTypes.string,
    theme: PropTypes.oneOf(["dark"]),
    header: PropTypes.element, // put as the first child of profile card,
    body: PropTypes.element // append to pc-body
};