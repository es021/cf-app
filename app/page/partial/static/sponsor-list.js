import React, { Component } from 'react';
import { getAxiosGraphQLQuery } from '../../../../helper/api-helper';
import { CompanyEnum } from '../../../../config/db-config';
import PropTypes from 'prop-types';
import { Loader } from '../../../component/loader';
import { getCF } from '../../../redux/actions/auth-actions';
import { getStyleImageObj } from '../../../component/profile-card';
import { getCompanyCSSClass } from '../hall/companies';

require("../../../css/sponsor.scss");

export default class SponsorList extends React.Component {
    constructor(props) {
        super(props);
        this.CF = getCF();
        this.state = {
            coms: null,
            load_coms: true
        }
    }

    getDimensionFromSize(size) {
        switch (size) {
            case "lg":
                return "150px";
            case "md":
                return "100px";
            case "sm":
                return "50px";
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

    getSponsorItem(d, isSponsor = true) {
        var dimension = (isSponsor) ? this.getDimensionFromSize(this.props.sponsor_size) : this.getDimensionFromSize(this.props.part_com_size);
        var style = getStyleImageObj("company", d.img_url, d.img_size, d.img_pos, dimension);

        var className = getCompanyCSSClass(d.type);
        className += " " + ((isSponsor) ? this.props.sponsor_size : this.props.part_com_size);

        return <div className={`sponsor-card ${className}`}>
            <div className="image" style={style}></div>
            {(!isSponsor) ? null : <div className="title">{CompanyEnum.getTypeStr(d.type)}</div>}
        </div>;
    }

    render() {
        var sponsor = <Loader size="3" text="Loading sponsors.."></Loader>;
        var part_com = <Loader size="3" text="Loading companies.."></Loader>;
        if (!this.state.load_coms && this.state.coms != null) {
            sponsor = [];
            part_com = [];
            this.state.coms.map((d, i) => {
                if (d.type == CompanyEnum.TYPE_NORMAL) {
                    part_com.push(<li>{this.getSponsorItem(d, false)}</li>);
                } else {
                    sponsor.push(<li>{this.getSponsorItem(d)}</li>);
                }
            });
        }

        var parentStyle = {
            maxWidth: "800px",
            margin: "auto"
        };

        return (<div style={parentStyle}>
            <div>
                {(this.props.title) ? <h1>Sponsors</h1> : null}
                <ul className="sponsor-container">{sponsor}</ul>
            </div>
            {(!this.props.part_com) ? null :
                <div>
                    {(this.props.title) ? <h1>Participating Companies</h1> : null}
                    <ul className="sponsor-container">{part_com}</ul>
                </div>
            }
        </div>)
    }

}

SponsorList.propTypes = {
    type: PropTypes.oneOf(["landing", "coming-soon", "right-bar"]).isRequired,
    part_com: PropTypes.bool,
    title: PropTypes.bool,
    sponsor_size: PropTypes.oneOf("lg", "md", "sm"),
    part_com_size: PropTypes.oneOf("lg", "md", "sm"),
};

SponsorList.defaultProps = {
    sponsor_size: "lg",
    part_com_size: "md",
    part_com: true,
    title: true
}