import React, { PropTypes } from 'react';
import { ButtonLink } from '../component/buttons.jsx';
import GeneralFormPage from '../component/general-form';
import * as layoutActions from '../redux/actions/layout-actions';
import UserPopup from './partial/popup/user-popup';

//importing for list
import List from '../component/list';
import { getAxiosGraphQLQuery, graphql, graphqlAttr, postRequest } from '../../helper/api-helper';
import { User, UserMeta, CFS, CFSMeta } from '../../config/db-config';
import { Time } from '../lib/time';
import { createUserTitle } from './users';
import { createCompanyTitle } from './admin-company';
import Form, { toggleSubmit } from '../component/form.js';
import { SiteUrl, AppPath } from '../../config/app-config.js';
import { NavLink } from 'react-router-dom';
import { Loader } from '../component/loader.js';
import ProfileCard from '../component/profile-card.jsx';
import { getAuthUser, getCF } from '../redux/actions/auth-actions.jsx';


export default class AdminQrCheckIn extends React.Component {
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

    checkIn() {
        postRequest(SiteUrl + "/qr/do-check-in",
            {
                qr_id: this.state.data.qr_id,
                user_id: getAuthUser() ? getAuthUser().ID : null,
                cf: getCF(),
            }
        ).then(res => {
        }).catch(err => {
        })
    }

    load() {
        postRequest(SiteUrl + "/qr/get-qr-detail",
            { code: this.code, }
        ).then(res => {
            console.log("ReS", res);
            this.setState({ data: res.data, loading: false, });
            this.checkIn();
        }).catch(err => {
            this.setState({ error: err.toString(), loading: false, });
        })
    }


    render() {
        document.setTitle("Career Fair");
        let v;
        let title = "QR Check In";
        if (this.state.loading) {
            v = <Loader />;
        } else {
            if (this.state.error) {
                v = <div style={{ color: "red" }}>Invalid QR<br></br><b>{this.state.error}</b></div>
            } else {
                let u = this.state.data.user;
                let cf = this.state.data.cf;
                title = cf.title ? cf.title : cf.cf;
                v = <div>
                    <br></br>
                    <ProfileCard
                        type="student"
                        img_url={u.img_url}
                        img_pos={u.img_pos}
                        img_size={u.img_size}
                        body={null}
                    ></ProfileCard>
                    <div style={{ fontSize: '25px' }}>
                        <div className="text-muted" style={{ fontSize: '20px' }}>Welcome,</div>
                        <b>{u.first_name} {u.last_name}</b>
                    </div>
                    <br></br>
                    <div>
                        <i>{u.user_email}</i><br></br>
                        <i>{u.phone_number}</i>
                    </div>
                </div>
            }
        }
        return (<div>
            <h2>{title}</h2>
            {v}
        </div>);

    }
}

