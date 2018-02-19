import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getStyleImageObj } from '../../../component/profile-card';
import { Loader } from '../../../component/loader';


export class StudentProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: null,
            loading: true,
        }
    }

    componentWillMount() {
        var id = this.props.id;

        var query = `query {
              user(ID:${id}) {
                ID
                user_email
                first_name
                last_name
                skills{label}
                doc_links{label url type}
                img_url
                img_pos
                img_size
                university
                phone_number
                graduation_month
                graduation_year
                available_month
                available_year
                major
                minor
            }}`;

        getAxiosGraphQLQuery(query).then((res) => {
            this.setState(() => {
                return { data: res.data.data.user, loading: false }
            })
        });
    }

    render() {

        var view = null;

        if (this.state.loading) {
            view = <Loader text="Fetching Student Information..."></Loader>
        } else {
            var s = this.state.data;
            view = <div>
                <div className="col-md-6 no-padding padding-right">
                    Student</div>
                <div className="col-md-6 no-padding padding-right"></div>
            </div>;
        }

        return <div className="row no-padding">
            {view}
        </div>;
    }
}

StudentProfile.propTypes = {
    id: PropTypes.number.isRequired
};