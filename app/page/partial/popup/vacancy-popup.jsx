import React, { Component } from "react";
import PropTypes from "prop-types";
import VacancyPage from "../../vacancy";

export default class VacancyPopup extends Component {
  render() {
    return <div style={{padding:"10px 20px", position:"relative"}} >
      <VacancyPage
        {...this.props}
        id={this.props.id}
        isPopup={true}
      ></VacancyPage>
    </div>;
  }
}

VacancyPopup.propTypes = {
  id: PropTypes.number
};

/*
import {Loader} from '../../../component/loader';
import {getAxiosGraphQLQuery} from '../../../../helper/api-helper';
import {DocLinkEnum} from '../../../../config/db-config';
import ProfileCard from '../../../component/profile-card.jsx';
import PageSection from '../../../component/page-section';
import {CustomList} from '../../../component/list';
class VacancyPopu111p extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: null,
            loading: true
        }
    }

    componentWillMount() {
        var id = null;

        if (this.props.match) {
            id = this.props.match.params.id
        } else {
            id = this.props.id;
        }

        var query = `query {
              vacancy(ID:${id}) {
                ID
                company_id
                title
                description
                requirement
                type
                application_url
                updated_at
            }}`;

        getAxiosGraphQLQuery(query).then((res) => {
            this.setState(() => {
                return {data: res.data.data.vacancy, loading: false}
            })
        });
    }

    render() {
        var id = null;
        var vacan = this.state.data;
        var view = null;

        if (this.state.loading) {
            view = <Loader size='3' text='Loading Vacancy Information...'></Loader>
        } else {
            var non = <div className="text-muted">Nothing To Show Here</div>;
            
            var items = [
                <span><i className="fa fa-hashtag left"></i>Vacancy Id - {vacan.ID}</span>,
                (vacan.type === "" || !vacan.type) ? null : <span><i className="fa fa-star left"></i>{vacan.type}</span>,
                <span><i className="fa fa-building left"></i>{this.props.company.name}</span>,
                (!vacan.application_url) ? null : <span><i className="fa fa-link left"></i>
                    <a target="_blank" href={vacan.application_url}>{vacan.application_url}</a></span>
            ];

            var about = <CustomList className="empty" items={items}></CustomList>;

            var desc = (vacan.description !== null) ? <p>{vacan.description}</p> : non;
            var req = (vacan.requirement !== null) ? <p>{vacan.requirement}</p> : non;

            view = <div>
                <PageSection className="left" title={vacan.title} body={about}></PageSection>
                <PageSection className="left" title="Description" body={desc}></PageSection>
                <PageSection className="left" title="Requirement" body={req}></PageSection>
            </div>;

        }

        return (view);
    }
};
*/
