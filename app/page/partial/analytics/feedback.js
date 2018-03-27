import React, { PropTypes } from 'react';
import GeneralFormPage from '../../../component/general-form';
import { getAxiosGraphQLQuery } from '../../../../helper/api-helper';
import { UserEnum, FeedbackQs } from '../../../../config/db-config';
import { getAuthUser } from '../../../redux/actions/auth-actions';

export class ManageFeedback extends React.Component {
    constructor(props) {
        super(props);
        this.authUser = getAuthUser();
    }

    componentWillMount() {
        this.ROLE_DATA = [UserEnum.ROLE_STUDENT, UserEnum.ROLE_RECRUITER];
        this.offset = 20;
        this.tableHeader = <thead>
            <tr>
                <th>ID</th>
                <th>User</th>
                <th>Question</th>
            </tr>
        </thead>;

        //##########################################
        //  search
        this.searchParams = "";
        this.search = {};
        this.searchFormItem = [{ header: "Enter Your Search Query" },
        {
            label: "Feedback For",
            name: "user_role",
            type: "select",
            data: this.ROLE_DATA
        }];

        this.searchFormOnSubmit = (d) => {
            this.search = d;
            this.searchParams = "";
            if (d != null) {
                this.searchParams += (d.user_role) ? `user_role:"${d.user_role}",` : "";
            }
        };

        this.loadData = (page, offset) => {
            return getAxiosGraphQLQuery(`query{
                feedback_qs (${this.searchParams} order_by:"is_disabled asc, ID"
                ,page:${page}, offset:${offset}){
                  ID
                  user_role
                  question
                  is_disabled
                }
              }`);
        };

        // create form add new default
        this.newFormDefault = {};
        this.newFormDefault["created_by"] = this.authUser.ID;

        this.getFormItem = (edit) => {
            var ret = [{ header: "Feeback Question Form" }];
            ret.push(...[
                {
                    label: "Question",
                    name: FeedbackQs.QUESTION,
                    type: "textarea",
                    required: true,
                    placeholder: "Write feedback question here.."
                }, {
                    label: "For User",
                    name: FeedbackQs.USER_ROLE,
                    type: "select",
                    data: this.ROLE_DATA,
                    required: true
                }
            ]);

            if (edit) {
                ret.push(
                    {
                        label: "Is Active",
                        name: FeedbackQs.IS_DISABLED,
                        type: "select",
                        data: [{ key: 0, label: "Yes" }, { key: 1, label: "No" }],
                        required: true
                    }
                );
            }

            return ret;
        }

        this.getEditFormDefault = (ID) => {
            const query = `query{
                feedback_qs (ID:${ID}){
                  ID
                  user_role
                  question
                  is_disabled
                }
              }`;

            return getAxiosGraphQLQuery(query).then((res) => {
                var qs = res.data.data.feedback_qs[0];
                return qs;
            });
        }

        this.renderRow = (d, i) => {
            var row = [];
            for (var key in d) {
                if (key == "is_disabled") {
                    var is_disabled = (d.is_disabled)
                        ? <label className="label label-danger">Not Active</label>
                        : <label className="label label-success">Active</label>;
                    row.push(<td className="text-center">{is_disabled}</td>);
                }
                else {
                    row.push(<td>{d[key]}</td>);
                }
            }
            return row;
        }

        this.getDataFromRes = (res) => {
            return res.data.data.feedback_qs;
        }
    }

    render() {
        document.setTitle("Manage Feedback");
        return (<div><h3>
            Manage Feedback
        </h3>
            <GeneralFormPage
                entity_singular="Feedback Question"
                entity="feedback_qs"
                addButtonText="Add New Feedback Question"
                dataTitle={this.dataTitle}
                getFormItem={this.getFormItem}
                newFormDefault={this.newFormDefault}
                getEditFormDefault={this.getEditFormDefault}
                noMutation={true}
                canEdit={true}
                canAdd={true}
                dataOffset={20}
                searchFormItem={this.searchFormItem}
                searchFormOnSubmit={this.searchFormOnSubmit}
                tableHeader={this.tableHeader}
                renderRow={this.renderRow}
                getDataFromRes={this.getDataFromRes}
                loadData={this.loadData}></GeneralFormPage>
        </div>);

    }
}