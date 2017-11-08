import React, {Component} from 'react';
import {render} from 'react-dom';
import {BrowserRouter, Route, NavLink, Switch, Redirect} from 'react-router-dom';
import {Provider} from 'react-redux';
import {store} from './redux/store.js';

require("./css/app.css");
require("./css/left_bar.css");
require("./lib/font-awesome-4.7.0/css/font-awesome.css");

import * as Navigation from './component/navigation';
import LeftBarLayout from './layout/left-bar-layout';

import {AppConfig} from './config';

class PrimaryLayout extends React.Component {
    render() {
        var path = this.props.match.path;
        var menuBar = Navigation.getBar(path);
        var route = Navigation.getRoute(path);

        return(<div className="primary-layout">
            <header>
                {AppConfig.Name}
            </header>
            <LeftBarLayout menuList={menuBar}></LeftBarLayout>        
            <div className="content">
                {route}
            </div>
            <footer>
                This is Footer
            </footer>
        </div>);
    }
}
;


import AuthorizedRoute from './component/authorize-route';
const App = () => (
            <Provider store={store}>
                <BrowserRouter>
                    <Switch>
                    <AuthorizedRoute path="/app" component={PrimaryLayout} />
                    <Route path="/auth" component={PrimaryLayout} />
                    </Switch>
                </BrowserRouter>
            </Provider>
            );

render(<App />, document.getElementById('app'));