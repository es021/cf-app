import React, { PropTypes } from 'react';
import { Loader } from '../component/loader';
import { getAuthUser } from '../redux/actions/auth-actions';
import { getAxiosGraphQLQuery } from '../../helper/api-helper';
import { SessionEnum } from '../../config/db-config';
import CompanyPopup from './partial/popup/company-popup';
import UserPopup from './partial/popup/user-popup';
import ConfirmPopup from './partial/popup/confirm-popup';
import * as layoutActions from '../redux/actions/layout-actions';
import { Time } from '../lib/time';
import Chat from './partial/session/chat';
import SessionNotesPage from './partial/session/session-notes';
import SessionRatingsPage from './partial/session/session-ratings';
import obj2arg from 'graphql-obj2arg';

class SessionPage extends React.Component {
    constructor(props) {
        super(props);
        this.getChat = this.getChat.bind(this);
        this.getMainView = this.getMainView.bind(this);
        this.endSession = this.endSession.bind(this);
        this.state = {
            data: null,
            loading: true
        };
        this.ID = this.props.match.params.id;
        this.user_id = getAuthUser().ID;
    }

    componentWillMount() {
        var query = `query{session(ID:${this.ID}) {
            ID host_id participant_id company_id status
            company{name}
            recruiter{ID first_name last_name img_url img_pos img_size}
            student{ID first_name last_name img_url img_pos img_size}
            updated_at created_at started_at ended_at }}`;

        getAxiosGraphQLQuery(query).then((res) => {
            this.setState(() => {
                var session = res.data.data.session;

                if (session != null) {
                    if (this.user_id == session.host_id) {
                        this.isRec = true;
                    } else {
                        this.isRec = false;
                    }
                }

                return { data: session, loading: false }
            });
        });
    }

    isAllowedHere() {
        return this.user_id == 1
            || this.state.data.host_id == this.user_id
            || this.state.data.participant_id == this.user_id;
    }

    getChat(data) {
        var self_id = null;
        var other_id = null;
        var other_data = null;
        var disableChat = (data.status == SessionEnum.STATUS_EXPIRED || data.status == SessionEnum.STATUS_LEFT);

        if (this.isRec) {
            self_id = data.host_id;
            other_id = data.participant_id;
            other_data = data.student;
        }
        //default is student
        else {
            self_id = data.participant_id;
            other_id = data.host_id;
            other_data = data.recruiter;
        }


        return <Chat self_id={self_id}
            isRec={this.isRec}
            disableChat={disableChat}
            other_id={other_id}
            other_data={other_data}></Chat>;
    }

    endSession(data) {
        const onYes = () => {
            layoutActions.loadingBlockLoader("Please Wait..");
            var update = {
                ID: this.state.data.ID,
                status: (this.isRec) ? SessionEnum.STATUS_EXPIRED : SessionEnum.STATUS_LEFT,
                ended_at: Time.getUnixTimestampNow()
            }
            var query = `mutation{edit_session(${obj2arg(update, { noOuterBraces: true })})
            {status ended_at ID}}`;
            getAxiosGraphQLQuery(query).then((res) => {
                this.setState((prevState) => {
                    var newData = Object.assign(prevState.data, res.data.data.edit_session);
                    layoutActions.storeHideBlockLoader();
                    return { data: newData };
                });
            });
        };

        var title = `Confirm ${(this.isRec) ? "End" : "Leave"} Session`;
        layoutActions.confirmBlockLoader(title
            , onYes);
    }

    getSessionHeader(data) {
  
        var title = null;
        if (this.isRec) {
            var label = data.student.first_name + " " + data.student.last_name;
            title = <a onClick={() => layoutActions.storeUpdateFocusCard(label, UserPopup, { id: data.student.ID })}>
                {label}
            </a>
        } else {
            var label = data.company.name;
            title = label;
            // title = <a onClick={() => layoutActions.storeUpdateFocusCard(label, CompanyPopup, { id: data.company_id })}>
            //     {label}
            // </a>
        }

        var status = "";
        if (data.status == SessionEnum.STATUS_EXPIRED) {
            status = "Session was ended by recruiter";
            if (data.ended_at != null) {
                status += ` on ${Time.getString(data.ended_at)}`;
            }
        }
        else if (data.status == SessionEnum.STATUS_LEFT) {
            status = "Session was left by student";
            if (data.ended_at != null) {
                status += ` on ${Time.getString(data.ended_at)}`;
            }
        }
        else {
            status = "Session Active";
            if (data.started_at != null) {
                status += ` - Started on ${Time.getString(data.started_at)}`;
            } else if (data.created_at != null) {
                status += ` - Created on ${Time.getString(data.created_at)}`;
            }
        }

        var endBtn = (data.status == SessionEnum.STATUS_EXPIRED || data.status == SessionEnum.STATUS_LEFT) ? null
            : <span> | <b><a onClick={() => { this.endSession() }}>{(this.isRec) ? "End" : "Leave"} Session</a></b></span>;

        return <div style={{ borderBottom: "#777 1px solid", marginBottom: "20px", paddingBottom: "10px" }}>
            <h3 className="text-left" style={{ margin: "0" }}>Session #{data.ID} - <b>{title}</b>
                <br></br>
                <small>{status} {endBtn}</small>
            </h3>
        </div>;
    }

    getMainView(session) {
        var chat = this.getChat(session);
        var view = [];

        // ########################
        // for rec
        if (this.isRec) {
            //chat
            view.push(<div className="col-md-8 no-padding padding-right">
                {chat}
            </div>);

            // session sessionNoteRating
            var sessionNoteRating = <div className="note_card"
                style={{
                    padding: "10px 14px"
                }}>
                <SessionRatingsPage rec_id={session.host_id}
                    student_id={session.participant_id}
                    session_id={session.ID}></SessionRatingsPage>
                    <br></br>
                <SessionNotesPage rec_id={session.host_id}
                    student_id={session.participant_id}
                    session_id={session.ID}></SessionNotesPage>
            </div>
            view.push(<div className="col-md-4 no-padding padding-left">
                {sessionNoteRating}
            </div>);
        }
        
        // ########################
        // for student
        else {
            //chat
            view.push(<div className="col-md-6 no-padding padding-right">
                {chat}
            </div>);

            // company profile
            if (session.company_id != null && session.company_id > 0) {
                view.push(<div className="col-md-6 no-padding padding-left">
                    <div style={{
                        padding: "0 14px",
                        border: "#6f7e95 solid 1px"
                    }}>
                        <CompanyPopup displayOnly={true} id={session.company_id}></CompanyPopup>
                    </div>
                </div>);
            }
        }

        return view;
    }

    render() {
        document.setTitle("Session");
        var view = null;
        var session = this.state.data;

        if (this.state.loading) {
            view = <Loader text="Loading session.." size="3" ></Loader>;
        } else if (session == null) {
            view = <div className="text-muted">Session ID Invalid</div>;
        } else if (!this.isAllowedHere()) {
            view = <div className="text-muted">Sorry. You Are Not Allowed Here</div>;
        } else {
            console.log(session);
            view = <div className="container-fluid no-padding">
                <div className="col-md-12 no-padding">
                    {this.getSessionHeader(session)}
                </div>
                {this.getMainView(session)}
            </div>;
        }

        return (<div>
            {view}
        </div>);
    }
}

export default SessionPage;
