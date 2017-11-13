import React, { Component } from 'react';

export default class UserPage extends Component {
    handleRedirect() {
        browserHistory.push('/user');
    }

    componentWillMount() {
        console.log("UserPage", "componentWillMount");
        var time = new Date();
        this.test = time.getTime();
        console.log(this.test);
    }


    render() {
        var id = null;
        if (this.props.match) {
            id = this.props.match.params.id
        } else {
            id = this.props.id;
        }
        return (
                <div> 
                    User : {id}
                    UserName : {this.test}
                </div>
                );
    }
};