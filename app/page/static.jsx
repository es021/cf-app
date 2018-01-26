import React, { Component } from 'react';
import StaticPage from '../component/static-page';

export class AllowCachePage extends React.Component {
    render() {
        document.setTitle("Allow Cache");
        return <StaticPage filename="allow-cache.html" version="1"></StaticPage>;
    }
}

export class FaqPage extends React.Component {
    render() {
        document.setTitle("Frequently Asked Question");
        return <StaticPage filename="faq.html" version="1"></StaticPage>;
    }
}

export class ContactUsPage extends React.Component {
    render() {
        document.setTitle("Contact Us");
        return <StaticPage filename="contact-us.html" version="1"></StaticPage>;
    }
}

