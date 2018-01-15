import React, { PropTypes } from 'react';
import { Loader } from '../component/loader';
import { getAuthUser } from '../redux/actions/auth-actions';
import { getAxiosGraphQLQuery } from '../../helper/api-helper';

import Chat from './partial/session/chat';

class SessionPage extends React.Component {
    constructor(props) {
        super(props);
        this.getChat = this.getChat.bind(this);
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
            recruiter{first_name last_name}
            student{first_name last_name}
            updated_at created_at started_at ended_at }}`;

        getAxiosGraphQLQuery(query).then((res) => {
            this.setState(() => {
                return { data: res.data.data.session, loading: false }
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
        if (this.user_id == data.host_id) {
            self_id = data.host_id;
            other_id = data.participant_id;
        }
        //default is student
        else {
            self_id = data.participant_id;
            other_id = data.host_id;
        }

        return <Chat self_id={self_id} other_id={other_id}></Chat>;
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
            var info = <div>
                Session:{session.ID},
                Host:{session.host_id},
                Participant:{session.participant_id},
                UserId:{this.user_id},
                Status:{session.status}
            </div>;

            view = <div>
                {info}
                {this.getChat(session)}
            </div>;
        }

        return (<div><h3>Session</h3>
            {view}
        </div>);
    }
}

export default SessionPage;
