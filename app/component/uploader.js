import React, {
	Component
} from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
	AppConfig
} from "../../config/app-config";

// to divide in server folder directory
export const FileType = {
	IMG: "image",
	DOC: "document",
	VIDEO: "video",
	CUSTOM: "custom",
	ALL: "all",
};

export function uploadFile(file, type, name, extraParam = {}, onUploadProgress) {
	var data = new FormData();
	data.append(type, file, file.name);

	for (var k in extraParam) {
		data.append(k, extraParam[k]);
	}

	var config = {
		onUploadProgress: onUploadProgress,
		headers: {
			"content-type": "multipart/form-data"
		}
	};

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
		this.VALID_VIDEO = [
			"m4v",
			"mov",
			"quicktime", // mov will resolve to quicktime
			"mp4",
			// "flv", "x-flv" // not supported
			// "avi", // not supported
			//"wmv", // not supported
			// "x-ms-wmv" // not supported
		];
		this.form = {};

		this.MAX_SIZE = 2; // in MB
		this.MB_TO_B = 1000000;

		this.MAX_SIZE_VIDEO = 500;
	}

	validateUpload(file) {
		console.log(this.props.type);
		var allowable_format;
		let maxSize = this.MAX_SIZE;
		switch (this.props.type) {
			case FileType.IMG:
				allowable_format = this.VALID_IMG;
				break;
			case FileType.DOC:
				allowable_format = this.VALID_DOC;
				break;
			case FileType.VIDEO:
				allowable_format = this.VALID_VIDEO;
				maxSize = this.MAX_SIZE_VIDEO;
				break;
			case FileType.CUSTOM:
				allowable_format = this.props.getValidFormat();
				maxSize = this.props.getMaxSizeInMb();
				break;
		}

		var error = true;
		var nameSplit = file.name.split(".");
		var type =
			file.type !== "" ?
				file.type.split("/")[1] :
				nameSplit[nameSplit.length - 1];
		if (file.size > maxSize * this.MB_TO_B) {
			if (error === true) {
				error = "";
			}
			error += "File is too big\n";
			error += "Maximum file size allowed is " + maxSize + " MB\n";
		}

		if (allowable_format != FileType.ALL) {
			if (allowable_format.indexOf(type) < 0) {
				if (error === true) {
					error = "";
				}
				error += "File of type " + type + " is not supported. \n";
				error += "Supported File : " + JSON.stringify(allowable_format) + "\n";
			}
		}

		return error;
	}

	getFileNameWithoutType(fileName) {
		let toRet = fileName;
		if (typeof toRet === "string") {
			toRet = toRet.split(".");
			delete toRet[toRet.length - 1];
			toRet = toRet.join(".");
			toRet = toRet.substring(0, toRet.length - 1);
		}

		return toRet;
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
			let fileNameWithoutType = this.getFileNameWithoutType(file.name);
			this.props.onSuccess(file, fileNameWithoutType);
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

	// overflow: hidden;
	// text-overflow: ellipsis;
	render() {
		return (<form>
			<label>{this.props.label}</label>
			<input name={this.props.name} style={{ width: this.props.width, overflow: "hidden", textOverflow: "ellipsis" }}
				type="file"
				onChange={this.onChange}
				required={this.props.required}
				ref={v => (this.form[this.props.name] = v)} />
		</form>
		);
	}
}

Uploader.propTypes = {
	name: PropTypes.string.isRequired,
	label: PropTypes.string,
	width: PropTypes.string,
	type: PropTypes.oneOf([FileType.IMG, FileType.DOC]),
	required: PropTypes.bool,
	onChange: PropTypes.func,
	onSuccess: PropTypes.func,
	onError: PropTypes.func
};