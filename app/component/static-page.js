import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getStaticAxios } from '../../helper/api-helper';
import { Loader } from './loader';
import {ImageUrl} from '../../config/app-config'

export default class StaticPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            content: null
        };
    }

    componentWillMount() {
        getStaticAxios(this.props.filename, this.props.version).then((res) => {
            this.setState(() => {
                return { loading: false, content: res };
            });
        });
    }

    render() {
        var view = null;

        if (this.state.loading) {
            view = <Loader size="3" text="Loading Page.."></Loader>;
        } else {
            console.log(ImageUrl);
            var content = this.state.content.replaceAll("{ImageUrl}",ImageUrl);
            view = <div dangerouslySetInnerHTML={{ __html: content}}></div>;
        }

        return (<div>
            {view}
        </div>);
    }
}

StaticPage.propTypes = {
    filename: PropTypes.string.isRequired,
    version : PropTypes.string
};

StaticPage.defaultProps = {
    version : null
};