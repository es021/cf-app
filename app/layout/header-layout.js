import React, { Component } from 'react';
import {AppConfig} from '../../config/app-config';
import {ButtonIcon} from '../component/buttons';


export default class HeaderLayout extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(<header>
        <div className="img">
            <img src={AppConfig.Icon}></img>
        </div>
        <div className="title">
            <b>{AppConfig.Name}</b>
            <br></br>
            <small>{AppConfig.Desc}</small>
        </div>
        <div className="menu">
            {this.props.menuList}
        </div>
        <div className="menu-small">
            <ButtonIcon size="lg" icon="bars"></ButtonIcon>
            {this.props.menuList}
        </div>
    </header>);
    }
}