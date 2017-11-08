import React, { Component }
from 'react';

import { render }
from 'react-dom';

import { BrowserRouter, Route, NavLink, Switch, Redirect}
from 'react-router-dom'

import { Provider }
from 'react-redux'

import { store }
from './redux/store.js';

import HomePage from './page/home';
import LoginPage from './page/login';
import AboutPage from './page/about';
import LogoutPage from './page/logout';
import UserPage from './page/user';
import UsersPage from './page/users';
import HallPage from './page/hall';

require("./css/app.css");
require("./css/left_bar.css");
require("./lib/font-awesome-4.7.0/css/font-awesome.css");

import ProfileCard from './component/profile-card';
class LeftBar extends React.Component{
    constructor(props){
        super(props);
    }
    render() {
           
        var user = {
            email:"zulsarhan.shaari@gmail.com",
            first_name:"Zulsarhan",
            last_name:"Shaaari"
        };
        
        var profile = <div className="left_bar_profile">
                <ProfileCard user={user}></ProfileCard>
            </div>;
        
        var nav = <div className="left_bar_nav">
                {this.props.menuList}
            </div>;
        
        return(<left_bar>
                {profile}
                {nav}
                </left_bar>);
    }
}

class PrimaryLayout extends React.Component{
    render() {
        //console.log("from PrimaryLayout");
        //console.log(this.props); 

        var path = this.props.match.path;
        const isApp = (path === '/app');

        var title = (isApp) ? 'App Layout' : 'Auth Layout';

        var menuList = (isApp) 
        ?   <ul>
                <NavLink to={`${path}/`} exact activeClassName="active"><li>Home</li></NavLink>
                <NavLink to={`${path}/about`} activeClassName="active"><li>About</li></NavLink>
                <NavLink to={`${path}/users`} activeClassName="active"><li>Users</li></NavLink>
                <NavLink to={`${path}/hall`} activeClassName="active"><li>Hall</li></NavLink>
                <NavLink to={`${path}/logout`} activeClassName="active"><li>Logout</li></NavLink>
            </ul>
        :   <ul>
                <NavLink to={`${path}/`} exact activeClassName="active"><li>Home</li></NavLink>
                <NavLink to={`${path}/about`} activeClassName="active"><li>About</li></NavLink>
                <NavLink to={`${path}/hall`} activeClassName="active"><li>Hall</li></NavLink>
                <NavLink to={`${path}/login`} activeClassName="active"><li>Login</li></NavLink>
            </ul>
        ;

        var route = (isApp) 
        ?   <Switch>
                <Route path={`${path}/`} exact component={HomePage} />
                <Route path={`${path}/about`} component={AboutPage} />
                <Route path={`${path}/logout`} component={LogoutPage} />
                <Route path={`${path}/users`} component={UsersPage} />
                <Route path={`${path}/user/:id`} component={UserPage} />
            </Switch>
        :   <Switch>
                <Route path={`${path}/`} exact component={HomePage} />
                <Route path={`${path}/hall`} component={HallPage} />
                <Route path={`${path}/login`} component={LoginPage} />
                <Route path={`${path}/about`} component={AboutPage} />
            </Switch>
        ;

        return(<div className="primary-layout">
            <header>
                {title}
            </header>
            <LeftBar menuList={menuList}></LeftBar>        
            <div className="content">
            {route}
            </div>
            <footer>
                This is Footer
            </footer>
        </div>);
    }
};

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