import React, { Component } from 'react';

export default class UserPage extends Component {
    handleRedirect() {
        browserHistory.push('/user');
    }
    render() {
        const id = this.props.match.params.id;
        return (
                <div> 
                    User : {id}
                </div>
                );
    }
};