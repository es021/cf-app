import React, { Component } from 'react';
import SponsorList from './partial/static/sponsor-list';
import { getCF, getCFObj, isRoleStudent, getAuthUser } from '../redux/actions/auth-actions';
import { Time } from '../lib/time';
import PropTypes from 'prop-types';
import { getAxiosGraphQLQuery } from '../../helper/api-helper';

class RegisterPS extends React.Component {
    constructor(props) {
        super(props);

        this.CF = getCF();
        this.user_id = getAuthUser().ID;

        this.state = {
            coms: null,
            reg_ps: null,
            loading: true
        }
    }

    componentWillMount() {
        var coms = false;
        var reg_ps = false;

        function finishLoad() {
            if (coms !== false && student !== false) {
                this.setState(() => {
                    return {
                        coms: coms,
                        reg_ps: reg_ps,
                        loading: false
                    };
                });
            }
        }
        //load coms
        getAxiosGraphQLQuery(`query{companies(accept_prescreen:1){ID name}}`)
            .then((res) => {
                coms = res.data.data.companies;
                finishLoad();
            });

        //load student user(ID:235){
        getAxiosGraphQLQuery(`query{user(ID:${this.user_id})
            {registered_prescreens {ID company_id status} }}`)
            .then((res) => {
                reg_ps = res.data.data.user.registered_prescreens;
                finishLoad();
            });
    }

    render() {

        var view = null

        if (this.state.loading) {
            view = <Loader size="2" text="Loading Prescreen Companies.."></Loader>;
        } else {
            view = JSON.stringify(this.state.coms);
            view += JSON.stringify(this.state.reg_ps);
        }

        return <div>
            <h3>Pre-Screens Registration</h3>
            {view}
        </div>;
    }
}

export default class ComingSoonPage extends React.Component {
    constructor(props) {
        super(props);
        this.CFObj = getCFObj();
    }

    componentWillMount() {
        this.timeStr = Time.getPeriodString(this.CFObj.start, this.CFObj.end);
    }

    render() {
        document.setTitle("Coming Soon");
        return (<div>
            <h1>
                <small>Coming Soon</small>
                <br></br>
                {this.CFObj.title}
                <br></br>
                <small>{this.timeStr}</small>
            </h1>

            // TODO add timer

            {isRoleStudent() ? <RegisterPS></RegisterPS> : null}

            <SponsorList type="coming-soon"></SponsorList>
        </div>
        );
    }
}


