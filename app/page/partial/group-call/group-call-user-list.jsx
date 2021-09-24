import React, { Component } from "react";
import PropTypes from "prop-types";
import { getAuthUser, getCF, isRoleAdmin } from "../../../redux/actions/auth-actions";
import { graphql } from "../../../../helper/api-helper";
import List from "../../../component/list";
import { PCType, createImageElement } from "../../../component/profile-card";
import { openUserPopup } from "../../users";

class InterestedUserCard extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
        };
    }

    render() {
        let d = this.props.data;
        let img = createImageElement(
            d.user.img_url,
            d.user.img_pos,
            d.user.img_size,
            "50px",
            "",
            PCType.STUDENT
        );

        let viewProfileButton = <a className="btn-link"
            onClick={() => {
                openUserPopup(d.user)
            }}>
            <b><small>View Profile</small></b>
        </a>;

        return (
            <div
                style={{
                    background: "white",
                    borderRadius: "10px", margin: "20px",
                    width: "400px",
                }}>
                <div
                    className="flex-center"
                    style={{
                        justifyContent: "flex-start",
                        padding: "0px 18px", width: "100%"
                    }}>
                    <div>{img}</div>
                    <div className="text-left" style={{ marginLeft: "10px" }}>
                        <div><b>{d.user.first_name}</b>{" "}{d.user.last_name}</div>
                        <div> {viewProfileButton}</div>
                    </div>
                </div>
            </div>
        );
    }
}
export class GroupCallUserList extends React.Component {
    constructor(props) {
        super(props);
        this.loadData = this.loadData.bind(this);
        this.renderList = this.renderList.bind(this);
        this.authUser = getAuthUser();
        this.offset = 99999999;
    }

    loadData(page, offset) {
        // description
        return graphql(`
        query{ 
            group_call(ID:${this.props.group_call_id}){
                users{  user {ID first_name last_name img_url img_pos img_size} }
        }}`);
    }

    componentWillMount() { }

    renderList(d, i) {
        return <InterestedUserCard data={d}></InterestedUserCard>
    }

    getDataFromRes(res) {
        return res.data.data.group_call.users;
    }


    render() {
        return (
            <div style={{ padding: "10px" }}>
                <List
                    isHidePagingTop={true}
                    isHidePagingBottom={true}
                    type="list"
                    listClass="flex-wrap-center"
                    pageClass="text-left"
                    getDataFromRes={this.getDataFromRes}
                    loadData={this.loadData}
                    offset={this.offset}
                    renderList={this.renderList}
                />
            </div>
        );
    }
}

GroupCallUserList.propTypes = {
    group_call_id: PropTypes.number,
};

GroupCallUserList.defaultProps = {
}