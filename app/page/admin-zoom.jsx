import React, { PropTypes } from 'react';
import * as layoutActions from '../redux/actions/layout-actions';
import {
    ZoomCreateRoomUrl,
} from "../../config/app-config";
import axios from 'axios';

export default class AdminZoom extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            createData: null
        }
    }

    componentWillMount() {

    }

    createRoom() {
        layoutActions.loadingBlockLoader(
            "Creating Video Call Session. Please Do Not Close Window."
        );

        let postData = {
            isSkipLocalCreate: true
        }

        axios.post(ZoomCreateRoomUrl, postData)
            .then(data => {
                data = data.data;
                console.log("ZoomCreateRoomUrl", data);
                if (data == null || data == "" || typeof data != "object") {
                    layoutActions.errorBlockLoader(
                        "Failed to create video call session. Please check your internet connection"
                    );
                    return;
                }

                var body = (
                    <div>
                        <h4 className="text-primary">
                            Successfully Created Video Call Session
                        </h4>
                    </div>
                );
                layoutActions.customBlockLoader(body, null, null, null);

                this.setState({ createData: data });
            })
            .catch(err => {
                console.log("ZoomCreateRoomUrl", err);
                console.log("ZoomCreateRoomUrl", err.data);
                layoutActions.errorBlockLoader(
                    "Failed to create video call session. Please check your internet connection"
                );
                return;
            });
    }

    render() {
        document.setTitle("Zoom API");

        let v = null;
        if (this.state.createData) {
            let data = this.state.createData;
            v = <div>
                <b>Start Url :</b><br></br>
                <div>{data.start_url}</div>
                <br></br>
                <b>Join Url :</b><br></br>
                <div>{data.join_url}</div>
            </div>
        }

        return (<div><h3>Zoom API</h3>
            <br></br>
            <br></br>
            <button className="btn btn-lg btn-green" onClick={() => { this.createRoom() }}>Create Room</button>
            <br></br>
            <br></br>
            {v}
        </div>);

    }
}

