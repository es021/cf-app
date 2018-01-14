import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader } from '../component/loader';
import { getAxiosGraphQLQuery } from '../../helper/api-helper';
import { DocLinkEnum } from '../../config/db-config';
import ProfileCard from '../component/profile-card';
import PageSection from '../component/page-section';
import { CustomList } from '../component/list';
import NotFoundPage from './not-found';
import FacebookProvider, { Page, ShareButton } from 'react-facebook';
import { AppConfig, RootPath, SiteUrl } from '../../config/app-config';
import { NavLink } from 'react-router-dom';

export default class VacancyPage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            data: null,
            loading: true,
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
                company {ID name}
                title
                description
                requirement
                type
                application_url
                updated_at
            }}`;

        getAxiosGraphQLQuery(query).then((res) => {
            this.setState(() => {
                return { data: res.data.data.vacancy, loading: false }
            })
        });
    }

    render() {
        var id = null;
        var vacan = this.state.data;
        var view = null;

        if (!this.props.isPopup) {
            document.setTitle("Vacancy");
        }

        if (this.state.loading) {
            view = <Loader size='3' text='Loading Vacancy Information...'></Loader>
        } else {
            if (this.state.data === null) {
                view = <NotFoundPage {...this.props} ></NotFoundPage>;

            } else {

                if (!this.props.isPopup) {
                    document.setTitle("Vacancy - " + vacan.title);
                }

                var non = <div className="text-muted">Nothing To Show Here</div>;

                var items = [
                    <span><i className="fa fa-hashtag left"></i>Vacancy Id - {vacan.ID}</span>,
                    (vacan.type === "" || !vacan.type) ? null : <span><i className="fa fa-star left"></i>{vacan.type}</span>,
                    <span><i className="fa fa-building left"></i>
                        {(!this.props.isPopup) ? <NavLink to={`${RootPath}/auth/company/${vacan.company.ID}`}>
                            {vacan.company.name}</NavLink> : vacan.company.name}
                    </span>,
                    (!vacan.application_url) ? null : <span><i className="fa fa-link left"></i>
                        <a target="_blank" href={vacan.application_url}>{vacan.application_url}</a></span>
                ];

                var share_url = `${SiteUrl}/auth/vacancy/${vacan.ID}`;
                //var share_url = window.location.href;
                console.log(share_url);

                var about = <div>
                    <CustomList className="empty" items={items}></CustomList>
                    <FacebookProvider appId={AppConfig.FbAppId}>
                        <ShareButton iconClassName="fa fa-facebook left" className="btn btn-blue btn-sm"
                            href={share_url}>Share</ShareButton>
                    </FacebookProvider>

                </div>;

                var desc = (vacan.description !== null) ? <p>{vacan.description}</p> : non;
                var req = (vacan.requirement !== null) ? <p>{vacan.requirement}</p> : non;

                view = <div>

                    <PageSection className="left" title={vacan.title} body={about}></PageSection>
                    <PageSection className="left" title="Description" body={desc}></PageSection>
                    <PageSection className="left" title="Requirement" body={req}></PageSection>
                </div>;

            }
        }

        return (view);
    }
}

VacancyPage.propTypes = {
    id: PropTypes.number,
    isPopup: PropTypes.bool
};