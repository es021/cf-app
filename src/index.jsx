import React, {Component} from 'react';
import {render} from 'react-dom';
import {BrowserRouter, Route, NavLink, Switch, Redirect} from 'react-router-dom';
import {Provider} from 'react-redux';
import {store} from './redux/store.js';

require("./css/app.css");
require("./css/header.css");
require("./css/footer.css");
require("./css/left_bar.css");
require("./css/right_bar.css");
require("./lib/font-awesome-4.7.0/css/font-awesome.css");

import * as Navigation from './component/navigation';
import HeaderLayout from './layout/header-layout';
import FooterLayout from './layout/footer-layout';
import LeftBarLayout from './layout/left-bar-layout';
import RightBarLayout from './layout/right-bar-layout';


class PrimaryLayout extends React.Component {
    render() {
        var path = this.props.match.path;
        var headerMenu = Navigation.getBar(path, true);
        var sideMenu = Navigation.getBar(path);
        var route = Navigation.getRoute(path);

        return(<div className="primary-layout">
            <HeaderLayout menuList={headerMenu}></HeaderLayout>
            <LeftBarLayout menuList={sideMenu}></LeftBarLayout>        
            <div className="content">
                <div className="main">
                    {route}
                </div>
                <RightBarLayout></RightBarLayout>
            </div>
            <FooterLayout></FooterLayout>
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