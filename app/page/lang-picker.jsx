import React, { Component } from 'react';
import { ImgConfig } from '../../config/app-config';
import { lang, MALAY, ENGLISH, getLangStore, isTranslateMalay, setLangStore, isHasOtherLang } from '../lib/lang.js';
// import { isMobileDevice } from "../lib/util";

// require('../css/forum.scss');
// require('../css/support-chat.scss');

// support chat floating at bottom right page
export class LangPicker extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.getOtherLang = this.getOtherLang.bind(this);
        this.MALAY = MALAY;
        this.ENGLISH = ENGLISH;

        if (isTranslateMalay()) {
            setLangStore(this.MALAY)
        }

        this.state = {
            current: getLangStore()
        }
    }
    getOtherLang() {
        if (this.state.current == this.ENGLISH) {
            return this.MALAY
        } else {
            return this.ENGLISH
        }
    }

    onClick() {
        let newLang = this.getOtherLang();
        // this.setState({ current: newLang });
        // console.log("newLang",newLang)
        setLangStore(newLang);
        location.reload();
    }

    getFlagSrc(v) {
        if (v == this.MALAY) {
            return ImgConfig.getFlag("Malaysia", 16);
        }
        if (v == this.ENGLISH) {
            return ImgConfig.getFlag("United Kingdom(Great Britain)", 16);
        }
    }

    render() {
        if (!isHasOtherLang()) {
            return null;
        }
        return <div className="lang-picker">
            <span style={{ marginRight: "20px" }}>
                <img src={this.getFlagSrc(this.state.current)}></img>
                {" "}{this.state.current}
            </span>
            <span>
                <img src={this.getFlagSrc(this.getOtherLang())}></img>
                {" "}<a onClick={this.onClick}>{this.getOtherLang()}</a>
            </span>

        </div>
    }
}
