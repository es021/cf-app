import React, { PropTypes } from "react";
import List from "../../../component/list";
import { graphql } from "../../../../helper/api-helper";
import { BrowseStudentCard } from "./browse-student-card";
import { getCfTitle, isRoleRec, isRoleAdmin } from "../../../redux/actions/auth-actions";

export class BrowseStudentList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            key: 1
        };

        this.offset = 10;
        // this.offset = 3;
        this.renderList = this.renderList.bind(this);
        this.loadCount = this.loadCount.bind(this);
        this.getCountFromRes = this.getCountFromRes.bind(this);
        this.getDataFromRes = this.getDataFromRes.bind(this);
        this.loadData = this.loadData.bind(this);

    }

    componentWillUpdate(oldProps) {
        if (oldProps.filterStr != this.props.filterStr) {
            this.setState((prevState) => {
                return { key: prevState.key + 1 }
            })
        }
    }

    renderList(d, i) {
        return <div>
            <BrowseStudentCard
                company_id={this.props.company_id}
                privs={this.props.privs}
                isRec={isRoleRec()}
                data={d}
                index={i}
                search={""}
            ></BrowseStudentCard>
        </div>;
    }

    getQueryParam(page, offset) {
        return this.props.getQueryParam({
            page: page,
            offset: offset,
            filterStr: this.props.filterStr,
            company_id: this.props.company_id
        })
    }

    loadCount() {
        var query = `query{
                browse_student_count ${this.getQueryParam()} 
            }`;
        return graphql(query);
    }
    getCountFromRes(res) {
        return res.data.data.browse_student_count
    }

    loadData(page, offset) {
        var query = `query{
            browse_student ${this.getQueryParam(page, offset)} 
            {
                student_id
                student{
                    ${this.props.isPageStudentListJobPost ? " interested_vacancies_by_company {ID title} " : ""}
                    student_listing_interested{ID is_interested}
                    prescreens_for_student_listing{status appointment_time}
                    university country_study available_month available_year
                    ID first_name last_name user_email description 
                    doc_links {type label url} field_study{val} looking_for_position{val}
          }}} `;

        return graphql(query);
    }

    getDataFromRes(res) {
        return res.data.data.browse_student;
    }
    getFilterDescription() {
        return null;
        // let cfList = [];
        // let cfs = this.props.filterState.cf;

        // if (!Array.isArray(cfs) || cfs.length <= 0) {
        //     if (!this.props.isRec) {
        //         cfs.push("All Career Fair");
        //     } else {
        //         cfs = this.props.company_cf
        //     }
        // }

        // if (Array.isArray(cfs)) {
        //     for (var i in cfs) {
        //         let title = getCfTitle(cfs[i]);
        //         if (title == null) {
        //             title = cfs[i]
        //         }

        //         cfList.push(<li>{title}</li>);
        //     }
        // }

        // return <div style={{ fontWeight: "10px", textAlign: "center" }}
        //     className="text-muted">
        //     <i>Showing students from</i>
        //     <ul>{cfList}</ul>
        // </div>;
    }
    render() {
        let v = null;
        v = <List
            key={this.state.key}
            type={"list"}
            loadCount={this.loadCount}
            getCountFromRes={this.getCountFromRes}
            getDataFromRes={this.getDataFromRes}
            loadData={this.loadData}
            offset={this.offset}
            renderList={this.renderList}
        ></List>

        return (
            <div className="browse-student-list">
                {/* <h1>
                    Student Listing {isRoleAdmin() ? <small><br></br>{this.props.company_name}</small> : ""}
                </h1> */}
                {this.getFilterDescription()}
                {v}
            </div>
        );
    }
}


BrowseStudentList.propTypes = {
    isPageStudentListJobPost: PropTypes.bool,
    isPageInterestedStudent: PropTypes.bool,
    filterStr: PropTypes.string,
    filterState: PropTypes.object,
    disabledFilter: PropTypes.object,
    privs: PropTypes.object,
    company_id: PropTypes.number,
    company_name: PropTypes.string,
    getQueryParam: PropTypes.func
}

BrowseStudentList.defaultProps = {
    filterStr: null,
    filterState: {},
    disabledFilter: {}
}
