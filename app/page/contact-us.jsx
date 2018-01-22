import React, { Component } from 'react';
import StaticPage from '../component/static-page';

export default class ContactUsPage extends React.Component {
    render() {
        document.setTitle("Contact Us");
        return <StaticPage filename="contact-us.html" version="1"></StaticPage>;
    }
}




