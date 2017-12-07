import React, { Component } from 'react';
import {loadUser} from '../../../redux/actions/user-actions';
import PropTypes from 'prop-types';
import PageSection from '../../../component/page-section';
import {NavLink} from 'react-router-dom';
import {getAxiosGraphQLQuery} from '../../../../helper/api-helper';
import ProfileCard from '../../../component/profile-card';
import {SimpleListItem} from '../../../component/list';
import {Loader} from '../../../component/loader';

class VacanciesList extends Component {
    render() {
        if (this.props.list.length === 0) {
            return <div className="text-muted">Nothing To Show Here</div>;
        }

        var view = this.props.list.map((d, i) => {
            var title = <NavLink target='_blank' to={`/app/vacancy/${d.ID}`}>{d.title}</NavLink>;

            return <SimpleListItem title={title} subtitle={d.type} description={d.description} key={i}>
        </SimpleListItem>;
        });

        return (<div>{view}</div>);
    }
}

VacanciesList.propTypes = {
    list: PropTypes.array.isRequired
};

class RecList extends Component {
    render() {
    }
}

export default class CompanyPopup extends Component {
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
              company(ID:${id}) {
                ID
                name
                tagline
                description
                img_url
                img_position
                img_size
                vacancies{
                    ID
                    title
                    type
                    description
                }
            }}`;

        getAxiosGraphQLQuery(query).then((res) => {
            this.setState(() => {
                return {data: res.data.data.company, loading: false}
            })
        });
    }

    render() {
        var id = null;
        var data = this.state.data;
        var view = null;
        
        if (this.state.loading) {
            view = <Loader size='3' text='Loading Company Information...'></Loader>
        } else {

            const about = <p>{data.description}</p>;
            const vacancies = <VacanciesList list={data.vacancies}></VacanciesList>;
            var pcBody = <div>
                <PageSection title="About" body={about}></PageSection>
                <PageSection title="Vacancies" body={vacancies}></PageSection>
            </div>;


            view = <div>
                <ProfileCard type="student"
                             title={data.name} subtitle={data.tagline}
                             img_url={data.img_url} img_pos={data.img_position} img_size={data.img_size}
                             body={pcBody}></ProfileCard>
            </div>;
        }

        return (view);
    }
};


CompanyPopup.propTypes = {
    id: PropTypes.number
};