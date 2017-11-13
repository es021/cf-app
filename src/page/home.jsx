import React, { Component } from 'react';
import {ButtonLink} from '../component/buttons';
import * as layoutActions from '../redux/actions/layout-actions';
import {store} from '../redux/store.js';
import UserPage from './user';

export default class HomePage extends React.Component {

    handleRedirect() {
        browserHistory.push('/');
    }

    render() {
        var line = <div>Line <br></br></div>;
        var lines = []
        for (var i = 0; i < 100; i++) {
            lines.push(line);
        }
        return (
            <div>
                Home Page New
                <ButtonLink onClick={() => store.dispatch(layoutActions.updateFocusCard(UserPage,{id:23}))} label="User 23"></ButtonLink>
                <ButtonLink onClick={() => store.dispatch(layoutActions.updateFocusCard(UserPage,{id:24}))} label="User 24"></ButtonLink>
            </div>
            );
    }
}


