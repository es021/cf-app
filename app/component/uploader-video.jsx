import React, { Component } from "react";
import { Uploader, uploadFile, FileType } from "./uploader";
import PropTypes from "prop-types";

export default class UploaderVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      currentFile: null,
      loading: false,
      success: null
    };

    this.uploadOnClick = this.uploadOnClick.bind(this);
    this.uploaderOnChange = this.uploaderOnChange.bind(this);
    this.uploaderOnError = this.uploaderOnError.bind(this);
    this.uploaderOnSuccess = this.uploaderOnSuccess.bind(this);
  }
  componentWillMount() {}
  uploaderOnChange(file) {
    // console.log("uploaderOnChange");
  }

  uploaderOnError(err) {
    // console.log("uploaderOnError", err);
    this.setState(() => {
      return { error: err, success: null, currentFile: null };
    });
  }

  uploaderOnSuccess(file) {
    // console.log("uploaderOnSuccess", file);
    this.setState(() => {
      return { error: null, success: null, currentFile: file };
    });
  }
  isUploadEnable() {
    return (
      this.state.currentFile != null &&
      this.state.error == null &&
      this.state.loading == false
    );
  }
  uploadOnClick() {
    this.setState({ loading: true, error: null });
    let extraParam = {
      entity: this.props.entity,
      entity_id: this.props.entity_id,
      meta_key: this.props.meta_key
    };

    let timestamp = Date.now();
    let fileName = `${this.props.entity}_${this.props.entity_id}_${this.props.meta_key}_${timestamp}`;

    uploadFile(
      this.state.currentFile,
      FileType.VIDEO,
      fileName,
      extraParam
    ).then(res => {
      console.log(res);
      this.setState({
        loading: false,
        success: "Video successfully uploaded!",
        error: null
      });
    });
  }
  render() {
    return (
      <div className="uploader-video">
        <Uploader
          label="Upload Video Resume"
          name="video-resume"
          type={FileType.VIDEO}
          onSuccess={this.uploaderOnSuccess}
          onChange={this.uploaderOnChange}
          onError={this.uploaderOnError}
        ></Uploader>
        <div className="error">{this.state.error}</div>
        <br></br>
        <button
          disabled={!this.isUploadEnable()}
          className="btn btn-blue"
          onClick={this.uploadOnClick}
        >
          Upload
        </button>
      </div>
    );
  }
}

UploaderVideo.propTypes = {
  entity: PropTypes.string,
  entity_id: PropTypes.number,
  meta_key: PropTypes.string,
  label: PropTypes.string
};
