import React, {Component} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {AppConfig} from '../../config/app-config';

// to divide in server folder directory
export const FileType = {
    IMG : "image",
    DOC : "document"
}

export function uploadFile(file, type, name){
    var data = new FormData();
    data.append(type, file, file.name);
    
    var config = {
        headers: { 'content-type': 'multipart/form-data' }
    }
    
    return axios.post(`${AppConfig.Api}/upload/${type}/${name}`, data, config);
}


export class Uploader extends React.Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.validateUpload = this.validateUpload.bind(this);
        this.VALID_IMG = ["jpeg", "jpg", "png"];
        this.VALID_DOC = ["pdf"];
        this.form = {};

        this.MAX_SIZE = 2; // in MB
        this.MB_TO_B = 1000000;
    }

    validateUpload(file) {
        console.log(this.props.type);
        var allowable_format;
        switch (this.props.type) {
            case FileType.IMG:
                allowable_format = this.VALID_IMG;
                break;
            case FileType.DOC:
                allowable_format = this.VALID_DOC;
                break;
        }


        var error = true;
        var nameSplit = file.name.split(".");
        var type = (file.type !== '') ? file.type.split("/")[1] : nameSplit[nameSplit.length - 1];
        if (file.size > this.MAX_SIZE * this.MB_TO_B) {
            error += "File is too big\n";
            error += "Maximum file size allowed is " + (this.MAX_SIZE) + " MB\n";
        }

        if (allowable_format.indexOf(type) < 0) {
            error += "File of type " + type + " is not supported. \n";
            error += 'Supported File : ' + JSON.stringify(allowable_format) + "\n";
        }

        return error;
    }

    onChange(event) {
        this.props.onChange(event);

        console.log(event);

        var files = event.target.files;

        console.log(files);
        if (files.length <= 0) {
            alert("Something went wrong. Please refresh page and try again.");
            return;
        }

        var file = files[0];

        console.log(file);

        var res = this.validateUpload(file);
        //valid file
        if (res === true) {
            console.log("valid");
            this.props.onSuccess(file);
            //this.previewImage(file, this.reposition);
            //this.initImageProperties();
        }
        //file not valid
        else {
            this.props.onError(res);
        }

    }

    onSubmit(ev) {
        ev.preventDefault();
    }

    render() {

        return(<form>
                <input 
                    name={this.props.name}
                    type="file"
                    onChange={this.onChange}
                    required={this.props.required}
                    ref={(v) => this.form[this.props.name] = v} />
                </form>
                );


    }
}

Uploader.propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf([FileType.IMG, FileType.DOC]),
    required: PropTypes.bool,
    onChange: PropTypes.func,
    onSuccess: PropTypes.func,
    onError: PropTypes.func
};