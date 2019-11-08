import React, { Component } from "react";
import { Uploader, uploadFile, FileType } from "./uploader";
import PropTypes from "prop-types";
import { postAxios } from "../../helper/api-helper";
import * as layoutActions from "../redux/actions/layout-actions";
import { AppConfig } from "../../config/app-config";

import { emitProgess, socketOn } from "../socket/socket-client";
import { BOTH } from "../../config/socket-config";

class UploaderVideoProgress extends React.Component {
  constructor(props) {
    super(props);

    this.PARSE_MAX_PERCENT = 100;
    this.INTERVAL_TIME = 10 * 1000;
    this.state = {
      progress: null // {bytesReceived, bytesExpected, parseCompleted, uploadCompleted}
    };
  }

  componentWillMount() {
    this.interval = setInterval(() => {
      emitProgess({ fileName: this.props.fileName });
    }, 5000);

    socketOn(BOTH.PROGRESS, data => {
      // console.log("from socket server", data);
      if (data.parseCompleted == true || data.uploadCompleted == true) {
        clearInterval(this.interval);
      }

      this.setState({ progress: data });
    });

    return;
    // var interval = setInterval(() => {
    //   postAxios(
    //     `${AppConfig.Api}/upload-progress/${this.props.fileName}`,
    //     {}
    //   ).then(res => {
    //     let progress = res.data;
    //     if (progress.uploadCompleted == true) {
    //       console.log("clear interval");
    //       clearInterval(interval);
    //     }
    //     this.setState({ progress: progress });
    //   });
    // }, this.INTERVAL_TIME);
  }

  getPercentage() {
    let percentage = this.percentage;
    if (this.state.progress) {
      if (this.state.progress.parseCompleted == true) {
        percentage = this.PARSE_MAX_PERCENT;
      } else if (this.state.progress.uploadCompleted == true) {
        percentage = "100";
      } else {
        try {
          percentage =
            (this.state.progress.bytesReceived /
              this.state.progress.bytesExpected) *
            100 *
            (this.PARSE_MAX_PERCENT / 100);
        } catch (err) {}
      }
    }
    this.percentage = percentage;
    // console.log("this.state.progress", this.state.progress);
    // console.log("percentage", percentage);

    return percentage;
  }
  render() {
    let percentage = this.getPercentage();
    let percentageView = [
      <br></br>,
      <div style={{ padding: `10px 15px` }}>
        <div className="progress" style={{ border : "#5f5f5f 1px solid" ,marginBottom: `0px` }}>
          <div
            className="progress-bar bg-warning"
            role="progressbar"
            style={{ width: `${percentage}%` }}
            aria-valuenow={percentage}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </div>
    ];

    return (
      <div>
        <br></br>
        <b>Uploading Video..</b>
        <br></br>
        This may take a while. Please don't close this window or hit refresh
        {percentageView}
      </div>
    );
  }
}

UploaderVideoProgress.propTypes = {
  fileName: PropTypes.string
};

export default class UploaderVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      currentFile: null,
      loading: false
      // success: null
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
      return { error: err, currentFile: null };
    });
  }

  uploaderOnSuccess(file) {
    // console.log("uploaderOnSuccess", file);
    this.setState(() => {
      return { error: null, currentFile: file };
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

    // let timestamp = Date.now();
    let fileName = `${this.props.entity}_${this.props.entity_id}_${this.props.meta_key}`;

    layoutActions.loadingBlockLoader(
      <UploaderVideoProgress fileName={fileName}></UploaderVideoProgress>
    );

    uploadFile(
      this.state.currentFile,
      FileType.VIDEO,
      fileName,
      extraParam
    ).then(res => {
      console.log(res);
      this.setState({
        loading: false,
        // success: "Video successfully uploaded!",
        error: null
      });
      layoutActions.successBlockLoader(
        <div>
          <br></br>
          <b>Video successfully uploaded.</b>
          <br></br>
          Refresh page to see changes.
        </div>
      );
    });
  }
  render() {
    return (
      <div className="uploader-video">
        {/* <UploaderVideoProgress fileName={"asdas"}></UploaderVideoProgress> */}

        <Uploader
          label={this.props.label}
          name={this.props.name}
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
  label: PropTypes.string,
  name: PropTypes.string
};
