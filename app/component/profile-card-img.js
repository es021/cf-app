import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {ButtonIcon} from './buttons';
import Form, {toggleSubmit, checkDiff} from './form';
import {User, UserMeta}  from '../../config/db-config';
import obj2arg from 'graphql-obj2arg';
import {getAxiosGraphQLQuery} from '../../helper/api-helper';

require("../css/profile-card.scss");

const pc = "pc-";

export default class ProfileCardImg extends  React.Component {
    constructor(props) {
        super(props);

        var fixedSize = this.props.stylePicture.backgroundSize.replace("100%", "101%");

        var dimension = "100px";
        this.state = {
            backgroundImage: this.props.stylePicture.backgroundImage,
            backgroundSize: fixedSize, //default : cover
            backgroundPosition: this.props.stylePicture.backgroundPosition, // default : 50% 50%
            height: dimension,
            width: dimension,

            error: null,
            disableSubmit: false,
            success: null
        };

        this.editPos = this.editPos.bind(this);
        this.editSize = this.editSize.bind(this);
        this.mouseDownPos = this.mouseDownPos.bind(this);
        this.mouseUpPos = this.mouseUpPos.bind(this);
        this.formOnSubmit = this.formOnSubmit.bind(this);
        this.mouseMovePos = this.mouseMovePos.bind(this);

        this.ZOOM_IN = "ZI";
        this.ZOOM_OUT = "ZO";
        this.LEFT = "left";
        this.RIGHT = "right";
        this.UP = "up";
        this.DOWN = "down";

        this.PAGE_X = null;
        this.PAGE_Y = null;

        this.POS_X;
        this.POS_Y;
        this.SIZE_X;
        this.SIZE_Y;
        this.ZOOM_OFFSET = 5;
        this.MIN_POS_X = 0;
        this.MAX_POS_X = 100;
        this.MIN_POS_Y = 0;
        this.MAX_POS_Y = 100;
        this.POS_OFFSET = 2;
        this.EVENT_INTERVAL = 10;
        this.dimension_size = null;

        this.EVENT_MOUSEDOWN = false;
    }

    componentWillMount() {

        this.formItems = [
            {
                label: "Img Url",
                name: "backgroundImage",
                type: "text",
                required: true
            }, {
                label: "Img Pos",
                name: "backgroundPosition",
                type: "text",
                required: true
            }, {
                label: "Img Size",
                name: "backgroundSize",
                type: "text",
                required: true
            }
        ];

        this.initImgProp();
    }

    initImgProp() {
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
        };

        img.src = url;
    }

    debug() {
        console.log(this.POS_X);
        console.log(this.POS_Y);
        console.log(this.SIZE_X);
        console.log(this.SIZE_Y);
    }

    mouseDownPos(event) {
        this.EVENT_MOUSEDOWN = true;
    }

    mouseUpPos(event) {
        this.EVENT_MOUSEDOWN = false;
    }

    mouseMovePos(event) {
        if (this.EVENT_MOUSEDOWN) {
            if (this.PAGE_X > event.pageX) {
                this.editPos(this.RIGHT);
            }

            if (this.PAGE_X < event.pageX) {
                this.editPos(this.LEFT);
            }

            if (this.PAGE_Y < event.pageY) {
                this.editPos(this.DOWN);
            }

            if (this.PAGE_Y > event.pageY) {
                this.editPos(this.UP);
            }
        }

        this.PAGE_X = event.pageX;
        this.PAGE_Y = event.pageY;
    }

    editPos(action) {

        var dimension;
        var direction;
        switch (action) {
            case this.RIGHT:
                dimension = "x";
                direction = "+";
                break;
            case this.LEFT:
                dimension = "x";
                direction = "-";
                break;
            case this.UP:
                dimension = "y";
                direction = "+";
                break;
            case this.DOWN:
                dimension = "y";
                direction = "-";
                break;
        }

        this.setState((prevState) => {

            //reposition.css("background-position", "50% 100%");
            // unit to be used in new app

            // if use px the display will vary based on picture dimension
            // so need to adjust it to fit 100px before save
            var unit = "px";

            // to override unit from old app
            if (prevState["backgroundPosition"].indexOf("%") >= 0) {
                this.POS_Y = "0px";
                this.POS_X = "0px";
                prevState["backgroundPosition"] = "0px 0px";
            }

            //var unit = "%";
            var temp = prevState["backgroundPosition"];
            temp = temp.split(unit);

            var temp_POS_X = Number(temp[0]);
            var temp_POS_Y = Number(temp[1].split(" ")[1]);

            var offset = (direction === '-') ? this.POS_OFFSET : -1 * this.POS_OFFSET;


            switch (dimension) {
                case 'x':
                    temp_POS_X = temp_POS_X + offset;
                    if (temp_POS_X < this.MIN_POS_X || temp_POS_X > this.MAX_POS_X) {
                        console.log("return 1");
                        //return;
                    }
                    this.POS_X = temp_POS_X + unit;
                    break;
                case 'y':
                    temp_POS_Y = temp_POS_Y + offset;
                    if (temp_POS_Y < this.MIN_POS_Y || temp_POS_Y > this.MAX_POS_Y) {
                        console.log("return 2");
                        //return;
                    }
                    this.POS_Y = temp_POS_Y + unit;
                    break;
            }

            prevState["backgroundPosition"] = this.POS_X + " " + this.POS_Y;
            this.debug();
            return prevState;
        });
    }

    editSize(action) {
        this.setState((prevState) => {
            var temp_SIZE_Y = "";
            var temp_SIZE_X = "";

            var offset = (action === this.ZOOM_IN) ? this.ZOOM_OFFSET : -1 * this.ZOOM_OFFSET;

            switch (this.dimension_size) {
                case 'x':
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

                    if (temp_SIZE_X == 100) {
                        temp_SIZE_X++;
                    }

                    this.SIZE_X = temp_SIZE_X + "%";
                    this.SIZE_Y = "auto";
                    prevState["backgroundSize"] = this.SIZE_X + " " + this.SIZE_Y;
                    break;

                case 'y':
                    temp_SIZE_Y = this.SIZE_Y.split("%")[0];
                    temp_SIZE_Y = Number(temp_SIZE_Y) + offset;
                    if (isNaN(temp_SIZE_Y)) {
                        this.dimension_size = 'x';
                        return;
                    }

                    if (temp_SIZE_Y < this.MIN_SIZE || temp_SIZE_Y > this.MAX_SIZE) {
                        return;
                    }

                    if (temp_SIZE_Y == 100) {
                        temp_SIZE_Y++;
                    }

                    this.SIZE_Y = temp_SIZE_Y + "%";
                    this.SIZE_X = "auto";
                    prevState["backgroundSize"] = this.SIZE_X + " " + this.SIZE_Y;
                    break;
            }
            return prevState;
        });
    }

    formOnSubmit(d) {
        toggleSubmit(this, {error: null});
        console.log("save current state", this.imgVal);

        var updateTemp = checkDiff(this, d, this.imgVal);
        if (updateTemp === false) {
            return;
        }

        //standardize prop 
        // handle diff in backend
        var update = {};
        update["ID"] = this.props.entity_id;
        update["img_url"] = updateTemp.backgroundImage;
        update["img_pos"] = updateTemp.backgroundPosition;
        update["img_size"] = updateTemp.backgroundSize;

        var edit_query = "";
        if (this.props.type == "user") {
            edit_query = `mutation{
                        edit_user(${obj2arg(update, {noOuterBraces: true})}) {
                          ID
                        }
                      }`;
        }

        console.log(edit_query);

        toggleSubmit(this, {error: null, success: "Your Change Has Been Saved!"});
        return;
        getAxiosGraphQLQuery(edit_query).then((res) => {
            console.log(res.data);
            updateAuthUser(d);
            toggleSubmit(this, {user: d, error: null, success: "Your Change Has Been Saved!"});
        }, (err) => {
            toggleSubmit(this, {error: err.response.data});
        });
    }

    render() {
        var stylePicture = this.state;

        var stylePictureBack = Object.assign({}, stylePicture);
        stylePictureBack["position"] = "absolute";
        stylePictureBack["opacity"] = "0.3";
        stylePictureBack["backgroundRepeat"] = "no-repeat";

        this.imgVal = {};
        this.imgVal.backgroundImage = stylePicture.backgroundImage;
        this.imgVal.backgroundPosition = stylePicture.backgroundPosition;
        this.imgVal.backgroundSize = stylePicture.backgroundSize;

        var btn_size = "20px";
        return (<div className="profile-card edit-img">
            <div style={stylePictureBack}></div>
            <div className={`${pc}picture`} style={stylePicture} 
                 onMouseMove={this.mouseMovePos} onMouseLeave={this.mouseUpPos}
                 onMouseUp={this.mouseUpPos} onMouseDown={this.mouseDownPos}></div>
            <ButtonIcon size={btn_size} icon="search-plus" theme="dark" onClick={() => this.editSize(this.ZOOM_IN)}></ButtonIcon>
            <ButtonIcon  size={btn_size} icon="search-minus" theme="dark" onClick={() => this.editSize(this.ZOOM_OUT)}></ButtonIcon>
        
            <ButtonIcon size={btn_size} icon="arrow-up" theme="dark" onClick={() => this.editPos(this.UP)}></ButtonIcon>
            <ButtonIcon  size={btn_size} icon="arrow-right" theme="dark" onClick={() => this.editPos(this.RIGHT)}></ButtonIcon>
            <ButtonIcon size={btn_size} icon="arrow-down" theme="dark" onClick={() => this.editPos(this.DOWN)}></ButtonIcon>
            <ButtonIcon  size={btn_size} icon="arrow-left" theme="dark" onClick={() => this.editPos(this.LEFT)}></ButtonIcon>
        
        
            <Form className="form-row" 
                  items={this.formItems} 
                  onSubmit={this.formOnSubmit}
                  submitText='Save'
                  defaultValues={this.imgVal}
                  disableSubmit={this.state.disableSubmit} 
                  error={this.state.error}
                  success={this.state.success}>
            </Form>
        </div>);
    }
}

ProfileCardImg.propsType = {
    img_url: PropTypes.string.isRequired, // to get image dimension
    id: PropTypes.number.isRequired,
    type: PropTypes.oneOf(["user", "company"]).isRequired,
    stylePicture: PropTypes.object.isRequired
};