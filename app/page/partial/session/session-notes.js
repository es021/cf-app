import React, { Component } from 'react';
import { getAxiosGraphQLQuery } from '../../../../helper/api-helper';
import obj2arg from 'graphql-obj2arg';
import PropTypes from 'prop-types';
import { Time } from '../../../lib/time';
import GeneralFormPage from '../../../component/general-form';
import { SessionNotes } from '../../../../config/db-config';

require("../../../css/session-note.scss");

export default class SessionNotesSection extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        //##########################################
        // List data properties
        this.renderRow = (d) => {

            return [
                <td><p>{d.note}</p>
                    <small className="text-muted">{Time.getString(d.updated_at)}</small></td>
            ];
        };

        this.tableHeader = null;

        this.loadData = (page, offset) => {
            var param = {
                session_id: this.props.session_id,
                page: page,
                offset: offset
            };

            var query = `query{session_notes(${obj2arg(param, { noOuterBraces: true })})
            {ID updated_at note}}`;
            return getAxiosGraphQLQuery(query);
        }

        // get actual data from loadData
        // can alter any data here too
        this.getDataFromRes = (res) => {
            return res.data.data.session_notes;
        }

        //##########################################
        // form operation properties

        // if ever needed
        // hook before submit
        this.formWillSubmit = (d, edit) => {
            return d;
        }

        this.getEditFormDefault = (ID) => {
            const query = `query{
                session_note(ID:${ID}) {
                  ID
                  note
                }
              }`;

            return getAxiosGraphQLQuery(query).then((res) => {
                var data = res.data.data.session_note;
                return data;
            });
        }

        // create form add new default
        this.newFormDefault = {};
        this.newFormDefault[SessionNotes.SESSION_ID] = this.props.session_id;
        this.newFormDefault[SessionNotes.REC_ID] = this.props.rec_id;
        this.newFormDefault[SessionNotes.STUDENT_ID] = this.props.student_id;

        this.getFormItem = (edit) => {
            var ret = [
                {
                    label: "Note",
                    name: SessionNotes.NOTE,
                    type: "textarea",
                    hideLabel: (!edit),
                    placeholder: "Add note about this student",
                    required: true
                },
                {
                    label: "Session ID",
                    name: SessionNotes.SESSION_ID,
                    type: "number",
                    disabled: true,
                    hidden: true,
                    required: (!edit)
                }, {
                    label: "Rec ID",
                    name: SessionNotes.REC_ID,
                    type: "number",
                    disabled: true,
                    hidden: true,
                    required: (!edit)
                }, {
                    label: "Student ID",
                    name: SessionNotes.STUDENT_ID,
                    type: "number",
                    disabled: true,
                    hidden: true,
                    required: (!edit)
                }
            ];

            if (edit) {
                ret.unshift({ header: `Edit Note` });
            }

            return ret;
        }
    }

    render() {
        return <GeneralFormPage
            dataTitle={null}
            addButtonText="Add New Note For This Student"
            entity="session_note"
            entity_singular="Note"
            btnColorClass="warning"
            dataOffset={3}
            showAddForm={true}
            tableHeader={this.tableHeader}
            newFormDefault={this.newFormDefault}
            getEditFormDefault={this.getEditFormDefault}
            getFormItem={this.getFormItem}
            renderRow={this.renderRow}
            getDataFromRes={this.getDataFromRes}
            loadData={this.loadData}
            formWillSubmit={this.formWillSubmit}
        ></GeneralFormPage>
    }
}

SessionNotesSection.PropTypes = {
    session_id: PropTypes.number.isRequired,
    rec_id: PropTypes.number.isRequired,
    student_id: PropTypes.number.isRequired
};
