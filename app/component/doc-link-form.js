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
                type: "text",
                hidden: (type === DocLinkEnum.TYPE_LINK) ? false : true,
                required: (type === DocLinkEnum.TYPE_LINK) ? true : false
            }, {
                label: "Label",
                name: DocLink.LABEL,
                type: "text",
                required: true
            }, {
                label: "Description",
                name: DocLink.DESCRIPTION,
                type: "textarea"
            }
        ];

    }

    formOnSubmit(d) {
        console.log(d);
        if (this.props.type === DocLinkEnum.TYPE_DOC) {
            if (this.state.currentFile === null) {
                this.setState(() => {
                    return{error: "Please Select A File First"};
                });
            } else {
                var fileName = `${this.props.entity}-${this.props.id}`;
                toggleSubmit(this, {error: null});
                uploadFile(this.state.currentFile, FileType.DOC, fileName).then((res) => {
                    console.log(res.data.url);
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
        //console.log("save to db", d);
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

        var insert = d;
        var insert_query = `mutation{
                     add_doc_link(${obj2arg(insert, {noOuterBraces: true})}) {
                       ID
                     }
                   }`;

        getAxiosGraphQLQuery(insert_query).then((res) => {
            //console.log(res.data.data.add_doc_link);
            toggleSubmit(this, {error: null, success: `Successfully Added New ${this.props.type.capitalize()}!`});
            
            if(this.props.onSuccessNew){
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

        var uploader = (this.props.type === DocLinkEnum.TYPE_DOC) ? <Uploader label="Upload Document" name="new-document" type={FileType.DOC} onSuccess={this.uploaderOnSuccess} 
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
    entity: PropTypes.oneOf(["user", "company"]).isRequired,
    type: PropTypes.oneOf([DocLinkEnum.TYPE_DOC, DocLinkEnum.TYPE_LINK]).isRequired,
    onSuccessNew: PropTypes.func
};
