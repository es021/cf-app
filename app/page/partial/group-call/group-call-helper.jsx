import React from "react";
import * as layoutActions from "../../../redux/actions/layout-actions";
import { lang } from "../../../lib/lang.js";
import obj2arg from 'graphql-obj2arg';

import GroupCallList from "./group-call-list";
import { graphql } from "../../../../helper/api-helper";
import { getAuthUser } from "../../../redux/actions/auth-actions";
import { Time } from "../../../lib/time";

export function getGroupCallAction(d) {
    let action = null;

    // get five min before start in unix
    let fiveMinBeforeStart = null;
    try {
        fiveMinBeforeStart = d.appointment_time - (5 * 60);
    }
    catch (err) {
        fiveMinBeforeStart = d.appointment_time
    }

    if (d.is_canceled) {
        action = <a
            style={{ minWidth: '100px' }}
            className="btn btn-sm btn-red btn-disabled btn-block text-bold btn-round-5"
        >
            <div>
                {lang("Canceled")}
            </div>
        </a>
    }
    else if (d.url && Time.isPast(fiveMinBeforeStart)) {
        action = <div>
            <a
                style={{ minWidth: '100px' }}
                target="_blank"
                className="btn btn-sm btn-green btn-block text-bold btn-round-5"
                href={d.url}>
                <i className="fa fa-sign-in left"></i>
                {lang("Join")}
            </a>
        </div>;
    } else {
        action = <a
            style={{ minWidth: '100px' }}
            className="btn btn-sm btn-gray btn-disabled btn-block text-bold btn-round-5"
        >
            <div>
                {lang("Upcoming")}
            </div>
        </a>
    }


    return <div>
        {action}
    </div>;
}

export function openPopupScheduleGroupCall(company_id, student_id) {
    layoutActions.storeUpdateFocusCard(
        lang("Add To Group Call"),
        GroupCallList,
        {
            company_id: company_id,
            isForAddStudent: true,
            isOnPopup: true,
            onDoneCreate: () => {
                openPopupScheduleGroupCall(company_id, student_id);
            },
            onAddStudent: (group_call_id) => {
                let checkParam = {
                    ID: group_call_id,
                }
                let checkQuery = `query {group_call(${obj2arg(checkParam, { noOuterBraces: true })}) {users{user_id}} }`
                graphql(checkQuery).then(res => {
                    let users = res.data.data.group_call.users
                    let existed = false;
                    for (let u of users) {
                        if (u.user_id == student_id) {
                            existed = true;
                            break;
                        }
                    }

                    if (existed) {
                        layoutActions.errorBlockLoader("This candidate has already been added to this group call session.")
                        return;
                    }

                    let addParam = {
                        group_call_id: group_call_id,
                        user_id: student_id,
                        created_by: getAuthUser().ID
                    }
                    let addMutation = `mutation { add_group_call_user(${obj2arg(addParam, { noOuterBraces: true })}) { ID } } `;
                    graphql(addMutation).then(res => {
                        layoutActions.successBlockLoader("Successfully added to the group call session");
                        layoutActions.storeHideFocusCard();
                        openPopupScheduleGroupCall(company_id, student_id);
                    })
                });


            }
        }
    );
}