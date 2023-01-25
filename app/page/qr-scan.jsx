import React, { PropTypes } from 'react';
//importing for list
import { postRequest } from '../../helper/api-helper';
import { isProd, SiteUrl, UploadUrl } from '../../config/app-config.js';
import { Loader } from '../component/loader.js';
import ProfileCard from '../component/profile-card.jsx';
import { getAuthUser, isAuthorized, getCF, isRoleOrganizer, isRoleAdmin, getUserId } from '../redux/actions/auth-actions.jsx';
import LoginPage from "../page/login";
import { getRedirectFrom, getRedirectLocation } from './view-helper/view-helper.jsx';
import { _GET } from '../lib/util';
import * as layoutActions from '../redux/actions/layout-actions';
import { getUnixTimestampNow } from '../../helper/general-helper';
import { Time } from "../lib/time";
import { openUserPopup } from './users';

export default class QrScan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: null,
            error: null,
            loading_check_in: true,
        };
    }

    componentWillMount() {
        this.code = this.props.match.params.code;
        this.load();
    }

    load() {
        postRequest(SiteUrl + "/qr/get-qr-detail",
            { code: this.code, }
        ).then(res => {
            console.log("ReS", res);
            this.setState({ data: res.data, loading: false });
            postRequest(SiteUrl + "/qr/scan",
                {
                    qr_id: this.state.data.qr_id,
                    user_id: getAuthUser() ? getAuthUser().ID : null,
                    cf: getCF(),
                }
            )
        }).catch(err => {
            this.setState({ error: err.toString(), loading: false, });
        })
    }

    isTypeUser() {
        return this.state.data && this.state.data["qr_type"] == "user";
    }
    isTypeCompany() {
        return this.state.data && this.state.data["qr_type"] == "company";
    }
    getBodyCompany() {
        return <div>redirect to company page</div>
    }
    getBodyUser() {
        let data = this.state.data;
        let u = data["user"];

        let checkinButton = null;
        let successCheckIn = null;
        let detailButton = <div className="btn btn-lg btn-blue-light btn-round-10 mt-10 px-10 w-80"
            onClick={() => {
                openUserPopup(u)
            }}><i className="fa fa-eye pr-4"></i>View Detail
        </div>

        if (isRoleOrganizer() || isRoleAdmin()) {
            if (data["checked_in_at"]) {
                successCheckIn = <div>
                    <div className="text-green-600 mt-10 px-10" >
                        Checked in on {Time.getString(data["checked_in_at"])} <i className="fa fa-check-circle pr-4"></i>
                    </div>
                </div>
            } else {
                checkinButton = <div>
                    <div className="btn btn-lg btn-green btn-round-10 mt-5 px-10 w-80" onClick={async () => {
                        layoutActions.loadingBlockLoader();
                        postRequest(SiteUrl + "/qr/do-check-in", { user_id: u["ID"], checked_in_by: getUserId(), cf: getCF() }
                        ).then(res => {
                            layoutActions.storeHideBlockLoader();
                            layoutActions.successBlockLoader(<div>
                                Successfully checked in <b>{u.first_name} {u.last_name}</b>
                            </div>)
                            this.setState((prevState) => {
                                return { data: { ...prevState.data, checked_in_at: Time.getUnixTimestampNow() } }
                            });

                        }).catch(err => {
                            layoutActions.storeHideBlockLoader();
                            layoutActions.errorBlockLoader(<div>
                                {err.toString}
                            </div>)
                        })
                    }}><i className="fa fa-sign-in pr-4"></i>Check In</div>
                </div>
            }
        }

        return <div>
            <br></br>
            {successCheckIn}
            <ProfileCard
                type="student"
                img_url={u.img_url}
                img_pos={u.img_pos}
                img_size={u.img_size}
                body={null}
            ></ProfileCard>
            <div style={{ fontSize: '25px' }}><b>{u.first_name}</b></div>
            <div className="text-muted" style={{ fontSize: '20px' }}>{u.last_name}</div>
            <br></br>
            <div>
                <i className="fa fa-envelope pr-3 text-muted"></i>{u.user_email}<br></br>
                <i className="fa fa-phone pr-3 text-muted"></i>{u.phone_number}
            </div>
            {detailButton}
            {checkinButton}
        </div>;
    }
    getBody() {
        if (this.isTypeUser()) return this.getBodyUser();
        if (this.isTypeCompany()) return this.getBodyCompany();
        return null;
    }

    render() {
        document.setTitle("Career Fair");
        let v;
        if (this.state.loading) {
            v = <Loader />;
        } else {
            if (this.state.error) {
                v = <div style={{ color: "red" }}>Invalid QR<br></br><b>{this.state.error}</b></div>
            } else {
                let cf = this.state.data.cf;

                if (!isAuthorized()) {
                    // http://localhost:8080/app/qr-scan/bph0i65ph7s975v?cf=TEST
                    // http://localhost:8080/app/qr-scan/bph0i65ph7s975v
                    // redirect to correct cf
                    let redirect = getRedirectFrom(this);
                    // console.log("redirect1", redirect)
                    redirect = redirect.pathname;
                    if (!redirect || redirect == "/app/") {
                        redirect = _GET("redirect")
                    }
                    // console.log("redirect1 2", redirect)
                    if (cf != getCF()) {
                        window.location = `${location.pathname}?cf=AIRBUS&redirect=${redirect}`
                    }
                    v = <div>
                        <h3>Scanning Qr Code</h3>
                        <img src={UploadUrl + "/" + this.state.data.qr_img_url} height="300px" />
                        <div className="pt-12 pb-6 font-bold text-3xl text-orange-500">Please login to continue</div>
                        {/* {location.pathname}
                        {cf} */}
                        <LoginPage title={<div />} location={getRedirectLocation(this, redirect)} />
                    </div>
                } else {
                    v = this.getBody();
                }
            }
        }
        return (<div>
            {/* {JSON.stringify(this.state.data)} */}
            {v}
        </div>);

    }
}

