import React, { Component } from 'react';
import Form, {toggleSubmit, checkDiff} from '../component/form';
import {DocLink, DocLinkEnum}  from '../../config/db-config';
import {getAxiosGraphQLQuery} from '../../helper/api-helper';
import obj2arg from 'graphql-obj2arg';
import PropTypes from 'prop-types';
import {Uploader, uploadFile, FileType} from '../component/uploader';
import {UploadUrl} from '../../config/app-config.js';

export default class DocLinkForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            disableSubmit: false,
            success: null,
            currentFile: null
        };
        this.formOnSubmit = this.formOnSubmit.bind(this);
        this.uploaderOnChange = this.uploaderOnChange.bind(this);
        this.uploaderOnError = this.uploaderOnError.bind(this);
        this.uploaderOnSuccess = this.uploaderOnSuccess.bind(this);
    }

    componentWillMount() {
        this.formDefault = {};
        this.formDefault[DocLink.TYPE] = this.props.type;

        if (this.props.entity === "user") {
            this.formDefault[DocLink.USER_ID] = this.props.id;
            this.formDefault[DocLink.COMPANY_ID] = 0;
        }

        if (this.props.entity === "company") {
            this.formDefault[DocLink.COMPANY_ID] = this.props.id;
            this.formDefault[DocLink.USER_ID] = 0;
        }

        if (this.props.edit) {
            this.formDefault[DocLink.URL] = this.props.edit[DocLink.URL];
            this.formDefault[DocLink.LABEL] = this.props.edit[DocLink.LABEL];
            this.formDefault[DocLink.DESCRIPTION] = this.props.edit[DocLink.DESCRIPTION];
        }

        this.formItem = this.getFormItem(this.props.type);
    }

    getFormItem(type) {
        return [
            {
                label: "Type",
                name: DocLink.TYPE,
                type: "text",
                required: true,
                disabled: true,
                hidden: true
            }, {
                label: "User Id",
                name: DocLink.USER_ID,
                type: "number",
                hidden: true,
                disabled: true
            }, {
                label: "Company Id",
                name: DocLink.COMPANY_ID,
                type: "number",
                hidden: true,
                disabled: true
            }, {
                label: "Url",
                name: DocLink.URL,
                placeholder: "https://www.linkedin.com/in/john-doe",
                type: "text",
                disabled: (this.props.edit && type === DocLinkEnum.TYPE_DOC) ? true : false,
                hidden: (type === DocLinkEnum.TYPE_LINK || this.props.edit) ? false : true,
                required: (type === DocLinkEnum.TYPE_LINK || this.props.edit) ? true : false
            }, {
                label: "Label",
                placeholder: (type === DocLinkEnum.TYPE_DOC) ? "Resume" : "LinkedIn",
                name: DocLink.LABEL,
                type: "text",
                required: true
            }, {
                label: "Description",
                name: DocLink.DESCRIPTION,
                type: "textarea",
                rows: 2
            }
        ];

    }

    formOnSubmit(d) {
        if (this.props.type === DocLinkEnum.TYPE_DOC && !this.props.edit) {
            if (this.state.currentFile === null) {
                this.setState(() => {
                    return{error: "Please Select A File First"};
                });
            } else {
                var fileName = `${this.props.entity}-${this.props.id}`;
                toggleSubmit(this, {error: null});
                uploadFile(this.state.currentFile, FileType.DOC, fileName).then((res) => {
                    if (res.data.url !== null) {
                        d.url = `${UploadUrl}/${res.data.url}`;
                        this.saveToDb(d);
                    }
                });
            }
        } else {
            toggleSubmit(this, {error: null});
            this.saveToDb(d);
        }
    }

    saveToDb(d) {

        if (this.props.edit) {
            var update = checkDiff(this, this.props.edit, d, [DocLink.USER_ID, DocLink.COMPANY_ID]);
            if (update === false) {
                return;
            }
            update[DocLink.ID] = this.props.edit[DocLink.ID];
            d = update;

        } else {
            d[DocLink.USER_ID] = Number.parseInt(d[DocLink.USER_ID]);
            d[DocLink.COMPANY_ID] = Number.parseInt(d[DocLink.COMPANY_ID]);

            if (d[DocLink.USER_ID] == 0) {
                delete(d[DocLink.USER_ID]);
            }

            if (d[DocLink.COMPANY_ID] == 0) {
                delete(d[DocLink.COMPANY_ID]);
            }

            if (d[DocLink.DESCRIPTION] == "") {
                delete(d[DocLink.DESCRIPTION]);
            }
        }

        var query = `mutation{${(this.props.edit) ? "edit" : "add"}_doc_link 
            (${obj2arg(d, {noOuterBraces: true})}){ID}}`

        getAxiosGraphQLQuery(query).then((res) => {

            var mes = (this.props.edit) ? `Successfully Edit ${this.props.type.capitalize()}!` : `Successfully Added New ${this.props.type.capitalize()}!`;
            toggleSubmit(this, {error: null, success: mes});
            if (this.props.onSuccessNew) {
                this.props.onSuccessNew();
            }
        }, (err) => {
            toggleSubmit(this, {error: err.response.data});
        });

    }

    /* props for Uploader --Start */
    uploaderOnChange(file) {
        console.log("uploaderOnChange");
    }

    uploaderOnError(err) {
        console.log("uploaderOnError", err);
        this.setState(() => {
            return{error: err, currentFile: null};
        });
    }

    uploaderOnSuccess(file) {
        console.log("uploaderOnSuccess", file);
        this.setState(() => {
            return{error: null, currentFile: file};
        });

    }

    render() {

        var uploader = (this.props.type === DocLinkEnum.TYPE_DOC && !this.props.edit) ? <Uploader label="Upload Document" name="new-document" type={FileType.DOC} onSuccess={this.uploaderOnSuccess} 
                  onChange={this.uploaderOnChange} onError={this.uploaderOnError}></Uploader> : null;

        var form = <Form className="form-row" 
          items={this.formItem} 
          onSubmit={this.formOnSubmit}
          submitText='Save'
          defaultValues={this.formDefault}
          disableSubmit={this.state.disableSubmit} 
          error={this.state.error}
          errorPosition="top"
          emptyOnSuccess={true}
          success={this.state.success}></Form>;

        return(<div>{uploader}{form}</div>);
    }
}

DocLinkForm.propTypes = {
    id: PropTypes.number.isRequired,
    edit: PropTypes.obj,
    entity: PropTypes.oneOf(["user", "company"]).isRequired,
    type: PropTypes.oneOf([DocLinkEnum.TYPE_DOC, DocLinkEnum.TYPE_LINK]).isRequired,
    onSuccessNew: PropTypes.func
};
