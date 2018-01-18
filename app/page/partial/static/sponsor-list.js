import React, { Component } from 'react';
import { getAxiosGraphQLQuery } from '../../../../helper/api-helper';
import { CompanyEnum } from '../../../../config/db-config';
import PropTypes from 'prop-types';
import { Loader } from '../../../component/loader';
import { getCF } from '../../../redux/actions/auth-actions';

export default class SponsorList extends React.Component {
    constructor(props) {
        super(props);
        this.CF = getCF();
        this.state = {
            coms: null,
            load_coms: true
        }
    }

    componentWillMount() {
        // create ignore type condition
        var ignore_types = [CompanyEnum.TYPE_SPECIAL];
        if (!this.props.part_com) {
            ignore_types.push(CompanyEnum.TYPE_NORMAL);
        }
        var ignore_type = "";
        ignore_types.map((d, i) => {
            ignore_type += `${d}`;
            if (i < ignore_types.length - 1) {
                ignore_type += ",";
            }
        })

        var query = `query{companies(cf:"${this.CF}", ignore_type:"(${ignore_type})", include_sponsor:1)
        {name cf type img_url img_position img_size}}`;

        getAxiosGraphQLQuery(query).then((res) => {
            this.setState(() => {
                return { coms: res.data.data.companies, load_coms: false };
            })
        });
    }

    render() {
        var sponsor = <Loader size="3" text="Loading sponsors.."></Loader>;
        var part_com = <Loader size="3" text="Loading companies.."></Loader>;
        if (!this.state.load_coms && this.state.coms != null) {
            sponsor = [];
            part_com = [];
            this.state.coms.map((d, i) => {
                if (d.type == CompanyEnum.TYPE_NORMAL) {
                    part_com.push(<li>{d.name}</li>);
                } else {
                    sponsor.push(<li>{d.name} - {CompanyEnum.getTypeStr(d.type)}</li>);
                }
            });
        }
        return (<div>
            <div>
                <h1>Sponsors</h1>
                <ul>{sponsor}</ul>
            </div>
            {(!this.props.part_com) ? null :
                <div>
                    <h1>Participating Companies</h1>
                    <ul>{part_com}</ul>
                </div>
            }
        </div>)
    }

}

SponsorList.propTypes = {
    type: PropTypes.oneOf(["landing", "coming-soon", "right-bar"]).isRequired,
    part_com: PropTypes.bool
};

SponsorList.defaultProps = {
    part_com: true,
}