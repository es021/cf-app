import React, { PropTypes } from "react";
import { NavLink } from "react-router-dom";
import GeneralFormPage from "../../../component/general-form";
import { InterestedButton } from "../../../component/interested";
import { ButtonExport } from "../../../component/buttons.jsx";

import * as layoutActions from "../../../redux/actions/layout-actions";
import {
    isComingSoon,
    isRoleRec,
    isRoleStudent,
    getCF,
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
    CompanyEnum
} from "../../../../config/db-config";

import Tooltip from "../../../component/tooltip";

export class BrowseStudentCard extends React.Component {
    constructor(props) {
        super(props);
        this.openSIForm = this.openSIForm.bind(this);
        this.toggleShowMore = this.toggleShowMore.bind(this);
        this.state = {
            isShowMore: false
        };
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
                <i>{entity} Not Specifed</i>
            </div>
        );
    }

    render() {
        var i = this.props.index;
        var d = this.props.data;
        var search = this.props.search;

        var title = createUserTitle(
            d.student,
            search.search_student,
            true,
            undefined,
            { companyPrivs: this.props.privs, company_id: this.props.company_id }
        );

        // create uni view
        let uniView = this.notSpecifiedView("University");
        if (d.student.university != null && d.student.university != "") {
            uniView = <b>{d.student.university}</b>;
        }

        let placeView = null;
        if (d.student.country_study != null && d.student.country_study != "") {
            placeView = <small>, {d.student.country_study}</small>;
        }


        let fieldStudyView = this.notSpecifiedView("Major");
        let field_study = d.student.field_study;
        if (Array.isArray(field_study)) {
            fieldStudyView = field_study.map((d, i) => {
                if (i % 2 == 0) {
                    return <span>{d.val}</span>;
                } else {
                    return <span>, {d.val}</span>;
                }
            });

            if (field_study.length > 0) {
                fieldStudyView = (
                    <i>
                        <br />
                        {fieldStudyView}
                    </i>
                );
            }
        }

        var labelView = null;
        let lookingForView = [];
        var hasLookFor =
            Array.isArray(d.student.looking_for_position) &&
            d.student.looking_for_position.length >= 0;
        if (hasLookFor) {
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
                        labelType = "warning";
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
                                style={{ marginRight: "5px" }}
                                className={`label label-${labelType}`}
                            >
                                {lfp}
                            </label>
                        }
                        tooltip={null}
                    />
                );
            }

            labelView = (
                <div style={{ fontSize: "16px", margin: "6px 0px" }}>
                    {lookingForView}
                </div>
            );
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
            let psStatus = tempObj.status != null ? tempObj.status : null;
            scheduledView = (
                <div style={{ marginBottom: "8px", marginTop: "0px" }}>
                    <label className={`label label-success label-custom`}>
                        {psStatus == PrescreenEnum.STATUS_STARTED
                            ? "Session Created on "
                            : "Scheduled Interview on "}
                        <b>{Time.getString(tempObj.appointment_time)}</b>
                    </label>
                </div>
            );
        }

        let studentInfo = (
            <div style={{ lineHeight: "17px" }}>
                {scheduledView}
                {labelView}
                {uniView}
                {placeView}
                {fieldStudyView}
            </div>
        );

        var styleToggler = { marginLeft: "-12px", marginBottom: "-10px" };
        var description = null;
        if (d.student.description !== null && d.student.description != "") {
            if (!this.state.isShowMore) {
                description = (
                    <div style={styleToggler}>
                        <a onClick={this.toggleShowMore} className="btn btn-link">
                            See More About This Student ...
              </a>
                    </div>
                );
            } else {
                description = (
                    <p style={{ marginTop: "7px" }}>
                        <b>
                            <u>About {d.student.first_name}</u>
                        </b>
                        <br />
                        <small>{d.student.description}</small>
                        <br />
                        <div style={styleToggler}>
                            <a onClick={this.toggleShowMore} className="btn btn-link">
                                See Less
                </a>
                        </div>
                    </p>
                );
            }
        }

        var details = (
            <div>
                {studentInfo}
                <div style={{ marginTop: "8px" }}>
                    {createUserDocLinkList(
                        d.student.doc_links,
                        d.student_id,
                        false,
                        false,
                        false,
                        true
                    )}
                </div>
                {description}
            </div>
        );

        // action Start Chat
        const action_disabled = !this.props.isRec;
        const isNavLink = true;


        var canSchedule = CompanyEnum.hasPriv(
            this.props.privs,
            CompanyEnum.PRIV.SCHEDULE_PRIVATE_SESSION
        );
        const action_handler = [
            () => { },
            () => {
                console.log("Schedule Call");
                if (canSchedule) {
                    openSIFormAnytime(d.student_id, this.props.company_id);
                } else {
                    // EUR FIX
                    // See Availability
                    layoutActions.errorBlockLoader(
                        "Opps.. It seems that you don't have privilege to schedule private session yet"
                    );
                }
            }
        ];
        const action_color = ["blue", "success"]
        const action_text = [
            <small>
                <i className="fa fa-comment left" />
                Start Chat
            </small>,
            <small>
                <i className="fa fa-video-camera left" />
                Schedule Call
            </small>
        ];
        const action_to = [`${RootPath}/app/student-chat/${d.student.ID}`, null];

        // like button
        let likeButton = !this.props.isRec ? null : (
            <InterestedButton
                tooltipObj={{
                    left: "-36px",
                    bottom: "26px",
                    width: "97px",
                    tooltip: "Shortlist student",
                    debug: false
                }}
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

        var item = (
            <ProfileListWide
                action_disabled={action_disabled}
                rootContent={likeButton}
                is_no_image={true}
                title={title}
                body={details}
                isNavLink={isNavLink}
                action_color={action_color}
                action_to={action_to}
                action_text={action_text}
                action_handler={action_handler}
                type={"student"}
                key={i}
            />
        );

        return item;
    }
}

BrowseStudentCard.propTypes = {
    company_id: PropTypes.number,
    data: PropTypes.object,
    index: PropTypes.number,
    isRec: PropTypes.bool,
    search: PropTypes.object,
    privs: PropTypes.object
};