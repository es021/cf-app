import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DocLinkEnum } from '../../config/db-config';
import { ButtonIcon } from './buttons';
import { getParamUrl, scrollToX } from '../lib/util';


require("../css/gallery.scss");

export class Gallery extends React.Component {
    constructor(props) {
        super(props);

        this.REF_LIST = "galleryList";
        this.REF_ITEM = "galleryItem";
        this.currentScrollLeft = 0;
        this.CLICK_OFFSET = 200;
        this.listWidth = 0;
        this.offsets = [];
        this.state = {
            maxOffset: 0,
            currentItem: 0,
            hideLeft: true,
            hideRight: false,
        }

    }

    componentWillMount() {
    }

    componentDidMount() {
        var p = this.refs[this.REF_LIST];

        for (var i in this.refs) {
            var r = this.refs[i];
            if (i.indexOf(this.REF_ITEM) >= 0) {
                this.offsets.push(r.offsetLeft - p.offsetLeft);
            }
        }

        this.listWidth = p.clientWidth;
        this.setState((prevState) => {
            return { maxOffset: p.scrollLeftMax };
        })

    }

    getArrow(type) {
        if (this.state.maxOffset <= 0 || this.offsets.length <= 1) {
            return null;
        }


        const onClickArrow = (type) => {

            var scroll = this.currentScrollLeft;
            var p = this.refs[this.REF_LIST];
            var nextItem = this.state.currentItem;

            var hideLeft = false;
            var hideRight = false;

            if (type == "right") {
                scroll += this.CLICK_OFFSET;
                nextItem++;

            } else if (type == "left") {
                scroll -= this.CLICK_OFFSET;
                nextItem--;
            }

            if (nextItem >= this.offsets.length) {
                nextItem = this.offsets.length - 1;
            }
            if (nextItem < 0) {
                nextItem = 0;
            }

            scroll = this.offsets[nextItem];

            console.log(this.listWidth, this.offsets, nextItem);



            // max to right
            if (scroll >= p.scrollLeftMax || scroll == this.currentScrollLeft) {
                scroll = p.scrollLeftMax;
                hideRight = true;
            }

            // max to left
            if (scroll <= 0) {
                scroll = 0;
                hideLeft = true;
            }

            // p.scrollLeft = scroll;
            scrollToX(p, scroll, 200)

            if (scroll != this.currentScrollLeft) {
                this.setState((prevState) => {
                    return { currentItem: nextItem };
                })
            }

            this.setState((prevState) => {
                return { hideRight: hideRight, hideLeft: hideLeft };
            })

            this.currentScrollLeft = scroll;


        }

        var marginLeft = (type == "right") ? "5px" : "";
        var marginRight = (type == "right") ? "" : "5px";

        var isHidden = (this.state.hideLeft && type == "left") || (this.state.hideRight && type == "right");

        return isHidden ? <div style={{width:"28px", height:"50px"}}></div> :
            <ButtonIcon style={{ marginLeft: marginLeft, marginRight: marginRight }}
                onClick={() => onClickArrow(type)} icon={`arrow-circle-${type}`}
                size="lg">
            </ButtonIcon>
    }

    render() {
        var data = this.props.data;

        const GI_ICON = "gi-icon";
        const GI_IFRAME = "gi-iframe";

        var list = data.map((d, i) => {
            //var icon = (d.type === DocLinkEnum.TYPE_DOC) ? "file-text" : "link";
            var preview = null;
            var icon = null;
            var iconColor = null;
            var giClass = "";

            if (d.type == DocLinkEnum.TYPE_DOC) {
                preview = <iframe src={d.url} frameBorder="0"></iframe>;
            } else if (d.url.containText("youtube")) {
                //src="https://www.youtube.com/embed/tzayZzSebrY"
                var embed = getParamUrl(d.url, "v");
                var newUrl = "https://www.youtube.com/embed/" + embed;
                preview = <iframe src={newUrl} frameBorder="0"></iframe>;
            } else if (d.url.containText("facebook")) {
                icon = "facebook-f";
                iconColor = "#3B5998";
            } else if (d.url.containText("linkedin")) {
                icon = "linkedin";
                iconColor = "#0077B5";
            } else if (d.url.endsWith(".pdf")) {
                icon = "file-text";
                iconColor = "#dd7c29";
            } else if (d.url.containText("video") || d.label.containText("video")) {
                icon = "play";
                iconColor = "#e41f1f";
            } else {
                icon = "globe";
                iconColor = "#609399";
            }

            // for icon
            if (preview == null && icon !== null) {
                giClass = GI_ICON;
                preview = <div className="gallery-icon" style={{ background: iconColor, color: "white" }}>
                    <i className={`fa fa-${icon} fa-2x`}></i>
                </div>;
            } else {
                giClass = GI_IFRAME;
            }

            return <div className={`gallery-item ${giClass}`} ref={`${this.REF_ITEM}-${d.ID}`}>
                <div className="preview">{preview}</div>
                <a target='_blank' href={`${d.url}`}>
                    <div className="title">{d.label}</div>
                </a>
            </div>;
        });


        return <div className="gallery gallery-lg">
            {this.getArrow("left")}
            <div className="gallery-list" ref={this.REF_LIST}>
                {list}
            </div>
            {this.getArrow("right")}
        </div>;
    }
}

Gallery.propsType = {
    data: PropTypes.array.isRequired,
    size: PropTypes.string,
};

Gallery.defaultProps = {
    size: "lg"
};
