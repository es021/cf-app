import React, { PropTypes } from 'react';
import SignUpPage from './sign-up.jsx';


export default class AdminPreviewRegistration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    componentWillMount() {
    }
    render() {
        document.setTitle("Registration Preview");
        return (<div>
            <SignUpPage isPreview={true} />
        </div>);

    }
}

