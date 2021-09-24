//Faizul Here

import React from "react";
import { getAuthUser, getCF, isRoleAdmin, isRecruiterCompany, getCfCustomMeta, isRoleOrganizer } from "../../../redux/actions/auth-actions";
import PropTypes from 'prop-types';

import * as layoutActions from "../../../redux/actions/layout-actions";
import { isRoleRec, isRoleStudent } from "../../../redux/actions/auth-actions";
import { getAxiosGraphQLQuery, graphql } from "../../../../helper/api-helper";
import ListBoard from "../../../component/list-board";
import VacancyPopup from "../popup/vacancy-popup";
import { Time } from "../../../lib/time";
import obj2arg from "graphql-obj2arg";

import { lang } from "../../../lib/lang.js";
import { GroupCallUserList } from "./group-call-user-list";
import GroupCallCreate from "./group-call-create";
import { getGroupCallAction } from "./group-call-helper";


export default class GroupCallList extends React.Component {
    constructor(props) {
        super(props);
        this.loadData = this.loadData.bind(this);
        this.renderList = this.renderList.bind(this);
        this.postRenderList = this.postRenderList.bind(this);
        this.getDataFromRes = this.getDataFromRes.bind(this);
        this.onClickUsers = this.onClickUsers.bind(this);
        this.authUser = getAuthUser();
        this.offset = 99999999;

        this.currentDate = null

        this.state = {
            listKey: 0
        }

    }

    loadData(page, offset) {
        let query = "";
        if (isRoleRec()) {
            query = `
            query{
                group_calls(${this.getMainQueryParam(page, offset)}){
                    ID
                    url
                    name
                    appointment_time
                    user_count
                    is_canceled

                    ${isRoleStudent()
                    ? `company {
                                ID
                                name
                                img_url
                                img_size
                                img_position
                            }`
                    : ``}
                        
                }
            }`;
        }
        return getAxiosGraphQLQuery(query);
    }
    getDataFromRes(res) {
        return res.data.data.group_calls;
    }
    componentWillMount() {

        this.getMainQueryParam = (page, offset) => {
            let param = { cf: getCF() };
            if (this.props.isForAddStudent) {
                param["is_canceled"] = 0;
            }
            if (isRoleRec() || isRoleOrganizer() || isRoleOrganizer()) {
                param["company_id"] = this.props.company_id;
            } else if (isRoleStudent()) {
                param["user_id"] = this.props.user_id;
            }
            return obj2arg(param, { noOuterBraces: true });
        }

        this.loadCount = () => {
            var query = `query{ group_calls_count(${this.getMainQueryParam()})}`;
            return getAxiosGraphQLQuery(query);
        };

        this.getCountFromRes = (res) => {
            return res.data.data.group_calls_count
        }

    }
    onClickUsers(d) {
        layoutActions.storeUpdateFocusCard(d.name, GroupCallUserList, {
            group_call_id: d.ID,
        });
    }
    isRecThisCompany() {
        isRecruiterCompany(this.props.company_id);
    }
    postRenderList(v, d, i) {
        let day = Time.getDateDayStr(d.appointment_time);
        let date = Time.getDate(d.appointment_time)
        let thisDate = `${date} - ${day}`;

        if (this.currentDate != thisDate) {
            this.currentDate = thisDate;

            v = [
                <div className="text-left lb-list-item"
                    style={{
                        background: "whitesmoke",
                        fontSize: "22px",
                        padding: '0px 15px', paddingTop: '25px', paddingBottom: '5px',
                    }}
                >
                    <b>{thisDate}</b>
                </div>,
                v
            ];
        }

        return v;

    }
    renderList(d, i) {
        let v = null;
        // let companyName = d.company.name;
        let notSpecified = <i className="text-muted">Not Speficied</i>;

        let include_timezone = false;
        let dateStr = d.appointment_time ? Time.getString(d.appointment_time, include_timezone) : notSpecified;

        // let pic = HallRecruiterHelper.getPicElement(d, "edit_event", "PIC");
        v = <div className="text-left flex-center"
            style={{ justifyContent: "flex-start", flexWrap: 'wrap' }}
        >
            <div className="" style={{ fontWeight: "", padding: "10px 15px", flexGrow: '3' }}>
                <b style={{ marginBottom: "8px", fontSize: "18px" }}>{d.name}</b>
                <div>
                    <div className="text-muted">
                        <i className="fa fa-clock-o left"></i>
                        {dateStr}
                    </div>
                </div>
                {this.getCancelCallView(d)}
            </div>
            <div className="" style={{ padding: '0px 20px' }}>
                <div className="hover-green" onClick={() => { this.onClickUsers(d) }} style={{ fontSize: '20px' }}>
                    <i className={`fa fa-user left`}></i>
                    {d.user_count}
                </div>
            </div>
            <div className="" style={{ padding: '20px 20px' }}>
                {this.getGroupCallRecruiterAction(d)}
            </div>
        </div>

        return v;
    }

    getCancelCallView(d) {
        if (d.is_canceled || this.props.isForAddStudent) {
            return null
        }

        return <a onClick={() => {
            layoutActions.confirmBlockLoader("Are you sure you want to cancel this group call?",
                () => {
                    layoutActions.loadingBlockLoader();
                    let q = `mutation{
                        edit_group_call(ID:${d.ID}, is_canceled:1, updated_by:${getAuthUser().ID}){
                            ID
                        }
                    }`
                    graphql(q).then(res => {
                        layoutActions.storeHideBlockLoader();
                        layoutActions.successBlockLoader("Group call canceled");
                        this.reloadData();
                    })
                })
        }}>
            <small><b>Cancel Call</b></small>
        </a>
    }

    getGroupCallRecruiterAction(d) {
        if (this.props.isForAddStudent) {
            return <a
                style={{ minWidth: '100px' }}
                className="btn btn-sm btn-green btn-block text-bold btn-round-5"
                onClick={() => { this.props.onAddStudent(d.ID) }}
            >
                <i className="fa fa-plus left"></i>
                {lang("Add")}
            </a>
        }

        return getGroupCallAction(d);
    }



    reloadData() {
        this.setState((prevState) => {
            return { listKey: prevState.listKey + 1 }
        })
    }

    getActionCreateNew() {
        return <a className="btn btn-md btn-round-5 btn-green-outline btn-bold"
            onClick={() => {
                layoutActions.storeUpdateFocusCard(
                    "Schedule New Group Call",
                    GroupCallCreate,
                    {
                        company_id: this.authUser.rec_company,
                        onDone: () => {
                            this.reloadData();
                            if (this.props.onDoneCreate) {
                                this.props.onDoneCreate();
                            }
                        }
                    })
            }}>
            <i className={`fa fa-plus left`}></i>
            Add Group Call
        </a>
    }

    render() {

        // kalau list semua
        let countParam = {
            loadCount: this.loadCount,
            getCountFromRes: this.getCountFromRes
        }

        return (
            <div style={this.props.isOnPopup ? { padding: '0px 15px' } : {}}>
                <ListBoard
                    key={this.state.listKey}
                    {...countParam}
                    title={lang('Group Call')}
                    postRenderList={this.postRenderList}
                    isAlwaysWhite={true}
                    isNoTitle={this.props.isNoTitle}
                    isOnPopup={this.props.isOnPopup}
                    isNoMarginBottom={this.props.isNoMarginBottom}
                    icon="group"
                    actionCustom={this.getActionCreateNew()}
                    appendText={"Load More"}
                    loadData={this.loadData}
                    getDataFromRes={this.getDataFromRes}
                    renderList={this.renderList}
                    offset={this.offset}
                />
            </div>
        );
    }
}

GroupCallList.propTypes = {
    company_id: PropTypes.number,
    user_id: PropTypes.number,

    isForAddStudent: PropTypes.bool,
    onAddStudent: PropTypes.func,
    onDoneCreate: PropTypes.func,
    isNoTitle: PropTypes.bool,
    isOnPopup: PropTypes.bool,
    isNoMarginBottom: PropTypes.bool,
}

GroupCallList.defaultProps = {
    isNoTitle: false,
    isOnPopup: false,
    isForAddStudent: false,
}