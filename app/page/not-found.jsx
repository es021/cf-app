import React, { Component } from 'react';

export default class NotFoundPage extends React.Component {
    handleRedirect() {
    }
    render() {
        document.setTitle("Page Not Found");

        console.log(this.props.match.url);
        return (
                <div><b>{this.props.match.url}</b><br></br>Page Not Found</div>
                );
    }
}


