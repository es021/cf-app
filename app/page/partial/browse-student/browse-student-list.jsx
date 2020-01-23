import React, { PropTypes } from "react";
import List from "../../../component/list";
import { graphql } from "../../../../helper/api-helper";
import { BrowseStudentCard } from "./browse-student-card";

export class BrowseStudentList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            key: 1
        };

        this.offset = 10;
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

    getMainQueryParam(page, offset) {
        let toRet = ""
        if (this.props.isRec) {
            toRet = `company_id : ${this.props.company_id}`;
        }

        if (this.props.filterStr) {
            if (toRet != "") {
                toRet += ", ";
            }
            toRet += `${this.props.filterStr}`;
        }

        if (page && offset) {
            if (toRet != "") {
                toRet += ", ";
            }
            toRet += `, page: ${page}, offset:${offset}`;
        }

        if (toRet.trim() == "") {
            return "";
        } else {
            return `(${toRet})`;
        }
    }

    renderList(d, i) {
        return <div>
            <BrowseStudentCard
                company_id={this.props.company_id}
                privs={this.props.privs}
                isRec={this.props.isRec}
                data={d}
                index={i}
                search={""}
            ></BrowseStudentCard>
        </div>;
    }

    loadCount() {
        var query = `query{
                browse_student_count ${this.getMainQueryParam()} 
            }`;
        return graphql(query);
    }
    getCountFromRes(res) {
        return res.data.data.browse_student_count
    }

    loadData(page, offset) {
        var query = `query{
            browse_student ${this.getMainQueryParam(page, offset)} 
            {
                student_id
                student{
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
        return JSON.stringify(this.props.filterState);
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
                <h1>Student Listing</h1>
                {v}
            </div>
        );
    }
}


BrowseStudentList.propTypes = {
    filterStr: PropTypes.string,
    filterState: PropTypes.object,
    privs: PropTypes.object,
    company_id: PropTypes.number,
    isRec: PropTypes.bool
}

BrowseStudentList.defaultProps = {
    filterStr: null,
    filterState: {}
}
