import React, { PropTypes } from "react";
import { InterestedButton } from "../../../component/interested";
import BannerFloat from "../../../component/banner-float";
import { addIsSeen } from "../../../component/is-seen";
import * as layoutActions from "../../../redux/actions/layout-actions";
import {
    isRoleRec,
    getCF,
    getAuthUser,
    isRoleAdmin,
    getCfCustomMeta,
    isCfFeatureOn
} from "../../../redux/actions/auth-actions";
import { Time } from "../../../lib/time";
import { createUserTitle } from "../../users";
import {
    openSIFormAnytime
} from "../../partial/activity/scheduled-interview";
import { createUserDocLinkList } from "../popup/user-popup";
import {
    UserEnum,
    PrescreenEnum,
    CompanyEnum,
    IsSeenEnum,
    CFSMeta
} from "../../../../config/db-config";
import { lang } from "../../../lib/lang";
import UserFieldHelper from "../../../../helper/user-field-helper";

import Tooltip from "../../../component/tooltip";
import { cfCustomFunnel } from "../../../../config/cf-custom-config";
import { BrowseStudentNote } from "./browse-student-note";
import { openPopupScheduleGroupCall } from "../group-call/group-call-helper";

export class BrowseStudentCard extends React.Component {
    constructor(props) {
        super(props);
        this.openSIForm = this.openSIForm.bind(this);
        this.toggleShowMore = this.toggleShowMore.bind(this);
        this.triggerIsSeen = this.triggerIsSeen.bind(this);
        let is_seen = false;
        try {
            is_seen = this.props.data.is_seen.is_seen == 1;
        } catch (err) { }

        this.state = {
            isShowMore: false,
            is_seen: is_seen,
        };
    }

    triggerIsSeen() {
        if (!this.state.is_seen) {
            addIsSeen(getAuthUser().ID, IsSeenEnum.TYPE_BROWSE_STUDENT, this.props.data.student_id).then(res => {
                this.setState({ is_seen: true })
            })
        }
    }

    openSIForm(student_id) {
        openSIFormAnytime(student_id, this.props.company_id);
    }

    toggleShowMore() {
        this.setState(prevState => {
            return {
                isShowMore: !prevState.isShowMore
            };
        });
    }

    notSpecifiedView(entity) {
        return (
            <div className="text-muted">
                <i>{lang(entity)} {lang("Not Specifed")}</i>
            </div>
        );
    }

    getStudentInfoView(d) {
        let lookingForView = [];
        for (var i in d.student.looking_for_position) {
            let lfp = d.student.looking_for_position[i];
            lfp = lfp.val;
            var labelType = "";
            switch (lfp) {
                case UserEnum.LOOK_FOR_FULL_TIME:
                    labelType = "success";
                    break;
                case UserEnum.LOOK_FOR_PART_TIME:
                    labelType = "danger";
                    break;
                case UserEnum.LOOK_FOR_INTERN:
                    labelType = "info";
                    break;
            }

            lookingForView.push(
                <Tooltip
                    bottom="19px"
                    left="-19px"
                    width="114px"
                    alignCenter={true}
                    content={
                        <label
                            style={{ marginRight: "5px", fontSize: "13px" }}
                            className={`label label-light label-${labelType}`}
                        >
                            {lang(lfp)}
                        </label>
                    }
                    tooltip={null}
                />
            );
        }

        if (lookingForView.length > 0) {
            lookingForView = <div>{lookingForView}</div>
        } else {
            lookingForView = null;
        }

        let customCardItem = UserFieldHelper.getCardItems(getCF())

        let customView = [];

        for (let c of customCardItem) {
            let v = d.student[c.id];
            if (
                (c.only_when && v == c.only_when) ||
                (!c.only_when && v)
            )
                customView.push(
                    <div
                        style={{
                            fontWeight: c.bold ? 'bold' : '',
                            fontStyle: c.italic ? 'italic' : '',
                            color: c.color
                        }}>
                        {v}
                    </div>
                )
        }

        return <div>
            {lookingForView ? <div style={{ margin: "10px 0px" }} className="bsc-looking-for">{lookingForView}</div> : null}
            {customView}
            {/* {this.getViewLine(d, "2")}
            {this.getViewLine(d, "3")}
            {this.getViewLine(d, "4")}
            {this.getViewLine(d, "5")} */}
        </div >
    }

    render() {
        var i = this.props.index;
        var d = this.props.data;
        // var search = this.props.search;

        var title = createUserTitle(
            d.student,
            this.props.search,
            true, // hideEmail
            undefined, // nameBreakLine
            { companyPrivs: this.props.privs, company_id: this.props.company_id }, // otherPropForPopup
            true, // isFocusUnderline
            this.triggerIsSeen // postOnClick
        );

        var scheduledView = null;
        if (d.student.prescreens_for_student_listing
            && d.student.prescreens_for_student_listing.length > 0) {
            // find index yang tak DONE lagi
            let baIndex = 0;
            for (var ba in d.student.prescreens_for_student_listing) {
                baIndex = ba;
                let tempObj = d.student.prescreens_for_student_listing[ba];
                let psStatus = tempObj.status != null ? tempObj.status : null;
                if (psStatus != null && psStatus != PrescreenEnum.STATUS_DONE) {
                    break;
                }
            }

            // find yang tak DONE lagi
            let tempObj = d.student.prescreens_for_student_listing[baIndex];
            // let psStatus = tempObj.status != null ? tempObj.status : null;
            // {psStatus == PrescreenEnum.STATUS_STARTED
            //     ? "Session Created on "
            //     : "Scheduled Interview on "}
            scheduledView = (
                <div>
                    <i className="fa fa-check-circle left"></i>
                    {lang("Scheduled Interview on")} <b>{Time.getString(tempObj.appointment_time)}</b>
                </div>
            );
        }


        var canSchedule = CompanyEnum.hasPriv(
            this.props.privs,
            CompanyEnum.PRIV.SCHEDULE_PRIVATE_SESSION
        );

        const actionSchedule = <button
            onClick={() => {
                if (canSchedule) {
                    openSIFormAnytime(d.student_id, this.props.company_id);
                    this.triggerIsSeen();
                } else {
                    // EUR FIX
                    // See Availability
                    layoutActions.errorBlockLoader(
                        lang("Opps.. It seems that you don't have privilege to schedule private session yet")
                    );
                }
            }}
            className="btn btn-round-5 btn-block btn-sm btn-blue-light text-bold">
            <i className="fa fa-video-camera left" />
            {lang(getCfCustomMeta(CFSMeta.TEXT_SCHEDULE_CALL, `Schedule Call`))}
        </button>

        const actionScheduleGroupCall =
            isCfFeatureOn(CFSMeta.FEATURE_GROUP_CALL)
                ? <button
                    onClick={() => {
                        openPopupScheduleGroupCall(this.props.company_id, d.student_id);
                        this.triggerIsSeen();
                    }}
                    className="btn btn-round-5 btn-block btn-sm btn-red text-bold">
                    <i className="fa fa-users left" />
                    {lang(`Add To Group Call`)}
                </button>
                : null;

        // let actionAddNote = null
        let actionAddNote = isRoleRec()
            ? <BrowseStudentNote
                student_id={d.student.ID}
                current_note={d.student.student_note}
            /> : null;

        // like button
        let actionShortlist = !this.props.isRec ? null : (
            <InterestedButton
                customView={
                    ({
                        loading,
                        is_interested,
                        onClickModeAction
                    }) => {
                        let r = null;
                        if (loading) {
                            r = <button className="btn btn-grey btn-round-5 btn-block btn-sm text-bold" >
                                <i className="fa fa-spinner fa-pulse left"></i>{lang("Loading")}
                            </button>
                        } else if (is_interested) {
                            r = <button className="btn btn-green btn-round-5 btn-block btn-sm text-bold" onClick={onClickModeAction}>
                                <i className="fa fa-check left"></i>{lang("Shortlisted")}
                            </button>
                        } else {
                            r = <button className="btn btn-grey btn-round-5 btn-block btn-sm text-bold" onClick={onClickModeAction}>
                                <i className="fa fa-plus left"></i>{lang("Shortlist")}
                            </button>
                        }
                        return r
                    }
                }
                postOnClick={this.triggerIsSeen}
                isBottom={true}
                customUserId={this.props.company_id}

                isModeCount={false}
                isModeAction={true}
                isNonClickable={isRoleAdmin()}
                ID={d.student.student_listing_interested.ID}
                is_interested={d.student.student_listing_interested.is_interested}
                entity={"student_listing"}
                entity_id={d.student.ID}
            ></InterestedButton>
            // recruiter_id={getAuthUser().ID}
        );

        let doclinkView = createUserDocLinkList(
            d.student.doc_links,
            d.student_id,
            false,
            false,
            false,
            true,
            this.triggerIsSeen //postOnClick
        )

        let isSeenView = this.state.is_seen
            ? null
            : <BannerFloat
                body={[
                    <i className={`fa fa-user-circle left`}></i>,
                    "New Registration"
                ]}
                parentClass="row"
                parentStyle={{
                    marginLeft: "-25px",
                    marginBottom: "35px",
                    marginTop: "-26px",
                }}
            />;

        let body = <div className="container-fluid">
            {isSeenView}
            <div className="row browse-student-card-body">
                <div className="col-md-8">
                    {scheduledView ? <div style={{ marginBottom: "10px" }} className="bsc-scheduled"><u>{scheduledView}</u></div> : null}
                    <div className="bsc-title">{title}</div>
                    {this.getStudentInfoView(d)}
                </div>
                {this.props.isRec ?
                    <div className="col-md-4 center-on-md-and-less">
                        <div className="break-10-on-md-and-less"></div>
                        {actionSchedule}
                        {actionScheduleGroupCall}
                        <div className="row" style={{ marginTop: '5px', padding: '0px 15px' }}>
                            {actionAddNote
                                ? [
                                    <div className="col-xs-6 no-padding" style={{ paddingRight: '2.5px' }}>
                                        {actionAddNote}
                                    </div>,
                                    <div className="col-xs-6  no-padding" style={{ paddingLeft: '2.5px' }}>
                                        {actionShortlist}
                                    </div>
                                ]
                                : <div className="col-xs-12  no-padding">
                                    {actionShortlist}
                                </div>
                            }
                        </div>
                        <div className="break-10-on-md-and-less"></div>
                    </div>
                    : null}
            </div>
            <div className="row browse-student-card-footer">
                <div className="col-md-12">
                    {doclinkView}
                </div>
            </div>
        </div>
        var item = (
            <div key={i}>
                {body}
            </div>
            // <ProfileListWide
            //     // rootContent={likeButton}
            //     is_no_image={true}
            //     title={null}
            //     body={body}
            //     // isNavLink={null}
            //     action_disabled={true}
            //     // action_color={action_color}
            //     // action_to={action_to}
            //     // action_text={action_text}
            //     // action_handler={action_handler}
            //     type={"student"}
            //     key={i}
            // />
        );

        return <div className="browse-student-card">{item}</div>;
    }

    getViewLine(d, key) {
        let toRet = null

        let customKeyLine = cfCustomFunnel({ action: `get_key_student_line${key}`, cf: getCF() })
        let customRenderLine = cfCustomFunnel({ action: `get_key_student_line${key}Render`, cf: getCF() })

        if (customKeyLine) {
            customKeyLine = customKeyLine(d.student);
            let v = d.student[customKeyLine];
            if (v) {
                if (customRenderLine) {
                    toRet = <div dangerouslySetInnerHTML={{ __html: customRenderLine(v) }}></div>
                } else {
                    toRet = <div><b>{v}</b></div>
                }
            }
        } else {
            // default view on line 2
            if (key == "2") {
                let uniView = null;
                if (d.student.university != null && d.student.university != "") {
                    uniView = <b>{d.student.university}</b>;
                }

                let placeView = null;
                if (d.student.country_study != null && d.student.country_study != "") {
                    placeView = <span>, {d.student.country_study}</span>;
                }

                toRet = <div>
                    {uniView}
                    {placeView}
                </div>
            }
            // default view on line 3
            else if (key == "3") {
                let fieldStudyView = null;
                fieldStudyView = <div className="text-muted">
                    <span>{d.student.field_study_main}</span>
                    {d.student.field_study_secondary ? <span>, {d.student.field_study_secondary}</span> : null}
                </div>
                toRet = fieldStudyView
            }
        }

        return toRet;
    }
}

BrowseStudentCard.propTypes = {
    company_id: PropTypes.number,
    data: PropTypes.object,
    index: PropTypes.number,
    isRec: PropTypes.bool,
    search: PropTypes.string,
    privs: PropTypes.object
};