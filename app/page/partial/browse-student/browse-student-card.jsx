import React, { PropTypes } from "react";
import { NavLink } from "react-router-dom";
import GeneralFormPage from "../../../component/general-form";
import { InterestedButton } from "../../../component/interested";
import BannerFloat from "../../../component/banner-float";
import { addIsSeen } from "../../../component/is-seen";
import { ButtonExport } from "../../../component/buttons.jsx";

import * as layoutActions from "../../../redux/actions/layout-actions";
import {
    isComingSoon,
    isRoleRec,
    isRoleStudent,
    getCF,
    getAuthUser,
    isRoleAdmin
} from "../../../redux/actions/auth-actions";
import { ProfileListWide } from "../../../component/list";
import { Time } from "../../../lib/time";
import { createUserTitle } from "../../users";
import {
    openSIFormAnytime
} from "../../partial/activity/scheduled-interview";
import { createUserDocLinkList } from "../popup/user-popup";
import { RootPath } from "../../../../config/app-config";
import {
    UserEnum,
    PrescreenEnum,
    CompanyEnum,
    IsSeenEnum
} from "../../../../config/db-config";
import { lang } from "../../../lib/lang";

import Tooltip from "../../../component/tooltip";
import { cfCustomFunnel } from "../../../../config/cf-custom-config";

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

        // create uni view
        // let uniView = this.notSpecifiedView("University");
        let uniView = null;
        if (d.student.university != null && d.student.university != "") {
            uniView = <b>{d.student.university}</b>;
        }

        let placeView = null;
        if (d.student.country_study != null && d.student.country_study != "") {
            placeView = <span>, {d.student.country_study}</span>;
        }


        let fieldStudyView = null;
        // @limit_field_of_study_2_before_deploy - comment
        // let field_study = d.student.field_study;
        // if (Array.isArray(field_study)) {
        //     fieldStudyView = field_study.map((d, i) => {
        //         if (i % 2 == 0) {
        //             return <span>{d.val}</span>;
        //         } else {
        //             return <span>, {d.val}</span>;
        //         }
        //     });

        //     if (field_study.length > 0) {
        //         fieldStudyView = (
        //             <i className="text-muted">
        //                 {fieldStudyView}
        //             </i>
        //         );
        //     }
        // }

        // @limit_field_of_study_2_before_deploy - uncomment 
        fieldStudyView = <div className="text-muted">
            <span>{d.student.field_study_main}</span>
            {d.student.field_study_secondary ? <span>, {d.student.field_study_secondary}</span> : null}
        </div>





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

        // let studentInfo = (
        //     <div style={{ lineHeight: "17px" }}>
        //         {scheduledView}
        //         {labelView}
        //         {uniView}
        //         {placeView}
        //         {fieldStudyView}
        //     </div>
        // );

        // var styleToggler = { marginLeft: "-12px", marginBottom: "-10px" };
        // var description = null;
        // if (d.student.description !== null && d.student.description != "") {
        //     if (!this.state.isShowMore) {
        //         description = (
        //             <div style={styleToggler}>
        //                 <a onClick={this.toggleShowMore} className="btn btn-link">
        //                     See More About This Student ...
        //       </a>
        //             </div>
        //         );
        //     } else {
        //         description = (
        //             <p style={{ marginTop: "7px" }}>
        //                 <b>
        //                     <u>{lang("About")} {d.student.first_name}</u>
        //                 </b>
        //                 <br />
        //                 <small>{d.student.description}</small>
        //                 <br />
        //                 <div style={styleToggler}>
        //                     <a onClick={this.toggleShowMore} className="btn btn-link">
        //                         {lang("See Less")}
        //                     </a>
        //                 </div>
        //             </p>
        //         );
        //     }
        // }

        // var details = (
        //     <div >
        //         {studentInfo}
        //         <div style={{ marginTop: "8px" }}>
        //             {createUserDocLinkList(
        //                 d.student.doc_links,
        //                 d.student_id,
        //                 false,
        //                 false,
        //                 false,
        //                 true
        //             )}
        //         </div>
        //         {description}
        //     </div>
        // );

        // action Start Chat
        // const action_disabled = !this.props.isRec;
        // const isNavLink = true;
        // var canSchedule = CompanyEnum.hasPriv(
        //     this.props.privs,
        //     CompanyEnum.PRIV.SCHEDULE_PRIVATE_SESSION
        // );
        // const action_handler = [
        //     () => { },
        //     () => {
        //         console.log("Schedule Call");
        //         if (canSchedule) {
        //             openSIFormAnytime(d.student_id, this.props.company_id);
        //         } else {
        //             // EUR FIX
        //             // See Availability
        //             layoutActions.errorBlockLoader(
        //                 "Opps.. It seems that you don't have privilege to schedule private session yet"
        //             );
        //         }
        //     }
        // ];
        // const action_color = ["blue", "success"]
        // const action_text = [
        //     <small>
        //         <i className="fa fa-comment left" />
        //         Start Chat
        //     </small>,
        //     <small>
        //         <i className="fa fa-video-camera left" />
        //         Schedule Call
        //     </small>
        // ];
        // const action_to = [`${RootPath}/app/student-chat/${d.student.ID}`, null];

        var canSchedule = CompanyEnum.hasPriv(
            this.props.privs,
            CompanyEnum.PRIV.SCHEDULE_PRIVATE_SESSION
        );

        // const actionChat = <NavLink to={`${RootPath}/app/student-chat/${d.student.ID}`}
        //     className="btn btn-round-5 btn-block btn-sm btn-blue-light text-bold">
        //     <i className="fa fa-comment left" />
        //     {lang("Start Chat")}
        // </NavLink>

        const actionSchedule = <button
            onClick={() => {
                console.log("Schedule Call");
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
            {lang("Schedule Call")}
        </button>

        // like button
        let actionShortlist = !this.props.isRec ? null : (
            <InterestedButton
                // tooltipObj={{
                //     left: "-36px",
                //     bottom: "26px",
                //     width: "97px",
                //     tooltip: "Shortlist student",
                //     debug: false
                // }}
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

        let viewLine2 = null;
        let viewLine3 = null;
        let customKeyLine2 = cfCustomFunnel({ action: "get_key_student_line2", cf: getCF() })
        let customKeyLine3 = cfCustomFunnel({ action: "get_key_student_line3", cf: getCF() })
        if (customKeyLine2) {
            customKeyLine2 = customKeyLine2(d.student);
            if (d.student[customKeyLine2]) {
                viewLine2 = <div><b>{d.student[customKeyLine2]}</b></div>
            }
        } else {
            viewLine2 = <div>
                {uniView}
                {placeView}
            </div>;
        }
        if (customKeyLine3) {
            customKeyLine3 = customKeyLine3(d.student);
            if (d.student[customKeyLine3]) {
                viewLine3 = <div className="text-muted"><i>{d.student[customKeyLine3]}</i></div>
            }
        } else {
            viewLine3 = fieldStudyView
        }

        let body = <div className="container-fluid">
            {isSeenView}
            <div className="row browse-student-card-body">
                <div className="col-md-9">
                    {scheduledView ? <div style={{ marginBottom: "10px" }} className="bsc-scheduled"><u>{scheduledView}</u></div> : null}
                    <div className="bsc-title">{title}</div>
                    {lookingForView ? <div style={{ margin: "10px 0px" }} className="bsc-looking-for">{lookingForView}</div> : null}
                    {viewLine2}
                    {viewLine3}
                </div>
                {this.props.isRec ?
                    <div className="col-md-3 center-on-md-and-less">
                        <div className="break-10-on-md-and-less"></div>
                        {actionSchedule}
                        {actionShortlist}
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
}

BrowseStudentCard.propTypes = {
    company_id: PropTypes.number,
    data: PropTypes.object,
    index: PropTypes.number,
    isRec: PropTypes.bool,
    search: PropTypes.string,
    privs: PropTypes.object
};