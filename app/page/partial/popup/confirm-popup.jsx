import React, { Component } from 'react';
import * as layoutActions from '../../../redux/actions/layout-actions';
import {Loader} from '../../../component/loader'; 
import {store} from '../../../redux/store';
import PropTypes from 'prop-types';

export default class ConfirmPopup extends React.Component {
    render() {   
        console.log("render Confirm Popup");
        console.log(this.props); 
    var view = null; 
    if(this.props.loading){
        view =  <Loader size='3' text='Please Wait...'></Loader>;
    } else{
        view = <div>
            <button className="btn btn-primary btn-md" 
                    onClick={this.props.onYes}>
                {(this.props.yesText) ? (this.props.yesText) : "Yes"}
            </button>
            <button className="btn btn-default btn-md" 
                    onClick={() => store.dispatch(layoutActions.hideFocusCard())} >
                {(this.props.noText) ? (this.props.noText) : "No"}
            </button>
        </div>;
    }

        return <div> <h4>{this.props.title}</h4>
            {view}</div>;
    }
}

ConfirmPopup.propTypes = {
    onYes: PropTypes.func.isRequired,
    title: PropTypes.string,
    yesText: PropTypes.string,
    isConfirming: PropTypes.bool,
    noText: PropTypes.string
};
