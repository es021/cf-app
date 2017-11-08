import React, { Component } from 'react';

export default class ProfileCard extends React.Component{
    constructor(props){
        super(props);
    }
    render() {

        var user = this.props.user;
        
        console.log(user);
        var styleParent = {
            color : "white"
        };
        
        var styleFirstName = {
            fontSize: "30px"
        };
        
        var styleLastName = {
        };
            
        var styleEmail = {
        };
      
        
        return(<div>
                <div style={styleFirstName}>{user.first_name}</div>
                <div style={styleLastName}>{user.last_name}</div>
                <div style={styleEmail}>{user.email}</div>
            </div>);
    }
}