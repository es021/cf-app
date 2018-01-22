import React, { Component } from 'react';
import StaticPage from '../component/static-page';

export default class FaqPage extends React.Component {
    render() {
        document.setTitle("Frequently Asked Question");
        return <StaticPage filename="faq.html" version="1"></StaticPage>;
    }
}




