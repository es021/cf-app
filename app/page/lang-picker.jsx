import React, { Component } from 'react';
import { ImgConfig } from '../../config/app-config';
import { lang, MALAY, ENGLISH, getLangStore, isTranslateMalay, setLangStore, isHasOtherLang } from '../lib/lang.js';
// import { isMobileDevice } from "../lib/util";

// require('../css/forum.scss');
// require('../css/support-chat.scss');

// support chat floating at bottom right page
export class LangPickerHeader extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        // this.showPopup = this.showPopup.bind(this);
        // this.hidePopup = this.hidePopup.bind(this);
        this.toggleInMain = this.toggleInMain.bind(this);
        this.toggleInPopup = this.toggleInPopup.bind(this);
        this.getOtherLang = this.getOtherLang.bind(this);
        this.MALAY = MALAY;
        this.ENGLISH = ENGLISH;
        this.TOTAL_OTHER_LANG = 1;

        if (isTranslateMalay()) {
            setLangStore(this.MALAY)
        }

        this.state = {
            current: getLangStore(),
            inMain: false,
            inPopup: false,
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
    toggleInMain() {
        this.setState((prevState) => {
            return { inMain: !prevState.inMain }
        });
    }
    toggleInPopup() {
        this.setState((prevState) => {
            return { inPopup: !prevState.inPopup }
        });
    }
    // showPopup() {
    //     this.setState({ isShowPopup: true });
    // }
    // hidePopup() {
    //     this.setState({ isShowPopup: false });
    // }
    render() {
        if (!isHasOtherLang()) {
            return null;
        }

        let isShow = this.state.inMain || this.state.inPopup;
        let popup = <div style={{ height: isShow ? `${27 * this.TOTAL_OTHER_LANG}px` : "0px" }} className="lang-picker-popup" onMouseEnter={this.toggleInMain} onMouseLeave={this.toggleInMain}>
            <div className="lang-picker-popup-item" onClick={this.onClick}>
                <img src={this.getFlagSrc(this.getOtherLang())}></img>
                {" "}{this.getOtherLang()}
            </div>
        </div>;

        return <a className="lang-picker-header" onMouseEnter={this.toggleInPopup} onMouseLeave={this.toggleInPopup}>
            <span className="lang-picker-main">
                <img src={this.getFlagSrc(this.state.current)}></img>
                {" "}{this.state.current}
            </span>
            {popup}
        </a>
    }
}


// export class LangPicker extends React.Component {
//     constructor(props) {
//         super(props);
//         this.onClick = this.onClick.bind(this);
//         this.getOtherLang = this.getOtherLang.bind(this);
//         this.MALAY = MALAY;
//         this.ENGLISH = ENGLISH;

//         if (isTranslateMalay()) {
//             setLangStore(this.MALAY)
//         }

//         this.state = {
//             current: getLangStore()
//         }
//     }
//     getOtherLang() {
//         if (this.state.current == this.ENGLISH) {
//             return this.MALAY
//         } else {
//             return this.ENGLISH
//         }
//     }

//     onClick() {
//         let newLang = this.getOtherLang();
//         // this.setState({ current: newLang });
//         // console.log("newLang",newLang)
//         setLangStore(newLang);
//         location.reload();
//     }

//     getFlagSrc(v) {
//         if (v == this.MALAY) {
//             return ImgConfig.getFlag("Malaysia", 24);
//         }
//         if (v == this.ENGLISH) {
//             return ImgConfig.getFlag("United Kingdom(Great Britain)", 24);
//         }
//     }

//     render() {
//         if (!isHasOtherLang()) {
//             return null;
//         }
//         return <div className="lang-picker">
//             <span style={{ marginRight: "20px" }}>
//                 <img src={this.getFlagSrc(this.state.current)}></img>
//                 {" "}{this.state.current}
//             </span>
//             <span>
//                 <img src={this.getFlagSrc(this.getOtherLang())}></img>
//                 {" "}<a onClick={this.onClick}>{this.getOtherLang()}</a>
//             </span>

//         </div>
//     }
// }
