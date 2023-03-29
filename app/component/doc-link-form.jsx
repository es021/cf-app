import React, { Component } from 'react';
import Form, { toggleSubmit, checkDiff } from './form';
import { DocLink, DocLinkEnum } from '../../config/db-config';
import { getAxiosGraphQLQuery } from '../../helper/api-helper';
import obj2arg from 'graphql-obj2arg';
import PropTypes from 'prop-types';
import { Uploader, uploadFile, FileType } from './uploader';
import { UploadUrl } from '../../config/app-config.js';
import { Loader } from './loader';
import { CustomList } from './list';
import * as layoutActions from '../redux/actions/layout-actions';
import ConfirmPopup from '../page/partial/popup/confirm-popup';
import { store } from '../redux/store';
import {
    _GET
} from '../lib/util';
import { lang } from '../lib/lang';

function hasDocLabel(dl, label, isExact) {
    isExact = typeof isExact === "undefined" ? false : isExact;
    if (typeof dl === "object") {
        for (var i in dl) {
            var d = dl[i];
            var docLabel = d.label;
            docLabel = typeof docLabel !== "string" ? "" : docLabel.toUpperCase();
            if (isExact) {
                if (docLabel == label.toUpperCase()) {
                    return true;
                }
            } else {
                if (docLabel.indexOf(label.toUpperCase()) >= 0) {
                    return true;
                }
            }

        }
    }

    return false;
}

export function hasCV(dl) {
    return hasDocLabel(dl, "CV", true) || hasDocLabel(dl, "Curriculum Vitae");
}

export function hasResume(dl) {
    return hasDocLabel(dl, DocLinkEnum.LABEL_RESUME);
}

export function hasAcademicTranscript(dl) {
    return hasDocLabel(dl, DocLinkEnum.LABEL_ACADEMIC_TRANS);
}

class DocLinkForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            disableSubmit: false,
            success: null,
            currentFile: null,
            labelText: false
        };
        this.isForCompany = this.isForCompany.bind(this);
        this.isForUser = this.isForUser.bind(this);
        this.formOnSubmit = this.formOnSubmit.bind(this);
        this.setLabelText = this.setLabelText.bind(this);
        this.uploaderOnChange = this.uploaderOnChange.bind(this);
        this.uploaderOnError = this.uploaderOnError.bind(this);
        this.uploaderOnSuccess = this.uploaderOnSuccess.bind(this);
    }

    componentWillMount() {
        this.formDefault = {};
        this.formDefault[DocLink.TYPE] = this.props.type;

        let _getLabel = _GET("label");
        if (_getLabel != null && this.props.type == DocLinkEnum.TYPE_DOC) {
            this.formDefault[DocLink.LABEL] = _getLabel;
        }

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

        //this.formItem = this.getFormItem(this.props.type);
    }

    isForUser() {
        return this.props.entity === "user";
    }

    isForCompany() {
        return !this.isForUser();
    }

    setLabelText(labelText) {
        this.setState(() => {
            return { labelText: labelText };
        })
    }

    getFormItem() {
        var CUSTOM = lang("Custom Label");
        var type = this.props.type;
        var labelData = [""];
        labelData.push(...(this.isForUser()) ? DocLinkEnum.USER_LABELS : DocLinkEnum.COMPANY_LABELS);
        labelData.push(CUSTOM);

        var formItem = [
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
                placeholder: (this.props.entity === "user") ? "https://www.linkedin.com/in/john-doe" : "https://www.company.com",
                type: "text",
                disabled: (this.props.edit && type === DocLinkEnum.TYPE_DOC) ? true : false,
                hidden: (type === DocLinkEnum.TYPE_LINK || this.props.edit) ? false : true,
                required: (type === DocLinkEnum.TYPE_LINK || this.props.edit) ? true : false
            }
            /*, {
                label: "Description",
                name: DocLink.DESCRIPTION,
                type: "textarea",
                rows: 2
            }*/
        ];


        // can toogle between select and text
        var labelObj = {
            label: "Label",
            name: DocLink.LABEL,
            type: "select",
            sublabel: `Select ${CUSTOM} to write a custom label`,
            onChange: (e) => {
                if (e.currentTarget.value == CUSTOM) {
                    this.setLabelText(true);
                }
            },
            data: labelData,
            required: true
        };

        if ((typeof this.state !== "undefined" && this.state.labelText)) {
            labelObj.type = "text";
            labelObj.sublabel = <span><a onClick={() => this.setLabelText(false)}>{lang("Select from dropdown")}</a></span>;
            labelObj.placeholder = lang("Write down custom label here");
            labelObj.onChange = false;
        }

        formItem.push(labelObj);
        return formItem;

    }

    formOnSubmit(d) {
        if (this.props.type === DocLinkEnum.TYPE_DOC && !this.props.edit) {
            if (this.state.currentFile === null) {
                this.setState(() => {
                    return { error: "Please Select A File First" };
                });
            } else {
                var fileName = `${this.props.entity}-${this.props.id}`;
                toggleSubmit(this, { error: null });
                uploadFile(this.state.currentFile, FileType.DOC, fileName).then((res) => {
                    if (res.data.url !== null) {
                        d.url = `${UploadUrl}/${res.data.url}`;
                        this.saveToDb(d);
                    }
                });
            }
        } else {
            toggleSubmit(this, { error: null });
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
                delete (d[DocLink.USER_ID]);
            }

            if (d[DocLink.COMPANY_ID] == 0) {
                delete (d[DocLink.COMPANY_ID]);
            }

            if (d[DocLink.DESCRIPTION] == "") {
                delete (d[DocLink.DESCRIPTION]);
            }
        }

        var query = `mutation{${(this.props.edit) ? "edit" : "add"}_doc_link 
            (${obj2arg(d, { noOuterBraces: true })}){ID}}`

        getAxiosGraphQLQuery(query).then((res) => {

            var mes = (this.props.edit) ? `Successfully Edit ${this.props.type.capitalize()}!` : `Successfully Added New ${this.props.type.capitalize()}!`;
            mes = lang(mes);
            toggleSubmit(this, { error: null, success: mes });
            if (this.props.onSuccessNew) {
                this.props.onSuccessNew();
            }
        }, (err) => {
            toggleSubmit(this, { error: err.response.data });
        });

    }

    /* props for Uploader --Start */
    uploaderOnChange(file) {
        console.log("uploaderOnChange");
    }

    uploaderOnError(err) {
        console.log("uploaderOnError", err);
        this.setState(() => {
            return { error: err, currentFile: null };
        });
    }

    uploaderOnSuccess(file) {
        console.log("uploaderOnSuccess", file);
        this.setState(() => {
            return { error: null, currentFile: file };
        });

    }

    render() {

        var uploader = (this.props.type === DocLinkEnum.TYPE_DOC && !this.props.edit)
            ? <Uploader label={lang("Upload Document")} name="new-document"
                type={this.props.isAllowImage ? FileType.IMG_AND_DOC : FileType.DOC} onSuccess={this.uploaderOnSuccess}
                onChange={this.uploaderOnChange}
                onError={this.uploaderOnError}></Uploader>
            : null;

        var form = <Form className="form-row"
            items={this.getFormItem()}
            onSubmit={this.formOnSubmit}
            submitText='Save'
            defaultValues={this.formDefault}
            disableSubmit={this.state.disableSubmit}
            error={this.state.error}
            errorPosition="top"
            emptyOnSuccess={true}
            success={this.state.success}></Form>;

        return (<div>{uploader}{form}</div>);
    }
}

DocLinkForm.propTypes = {
    id: PropTypes.number.isRequired,
    edit: PropTypes.obj,
    entity: PropTypes.oneOf(["user", "company"]).isRequired,
    type: PropTypes.oneOf([DocLinkEnum.TYPE_DOC, DocLinkEnum.TYPE_LINK]).isRequired,
    onSuccessNew: PropTypes.func,
    isAllowImage: PropTypes.bool
};



// refactor so that it works for user and company
// TODO
export default class DocLinkPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            map: {}, // for edit
            fetching: true
        };

        this.refresh = this.refresh.bind(this);
    }

    componentWillMount() {
        this.refresh();
    }

    closeFocusCardAndRefresh() {
        layoutActions.storeHideFocusCard();
        this.refresh();
    }

    refresh() {
        var query = `query{${this.props.entity}(ID:${this.props.id}){
        doc_links{
            ID
            user_id
            company_id
            type
            label
            url
            description
        }}}`;

        getAxiosGraphQLQuery(query).then((res) => {
            //console.log(res.data.data.user.doc_links);
            var datas = res.data.data[this.props.entity].doc_links;
            var map = {};
            for (var i in datas) {
                map[datas[i].ID] = i;
            }
            console.log(map);
            this.setState(() => {
                return { map: map, data: datas, fetching: false };
            });
        }, (err) => {
            alert(err);
        });
    }

    deletePopup(e) {
        console.log(e);

        var id = e.currentTarget.id;
        console.log(e.currentTarget);
        const onYes = () => {
            var del_query = `mutation{delete_doc_link(ID:${id})}`;
            store.dispatch(layoutActions.updateProps({ loading: true }));
            getAxiosGraphQLQuery(del_query).then((res) => {
                this.closeFocusCardAndRefresh();
            }, (err) => {
                alert(err.response.data);
            });
        };
        var value = e.currentTarget.attributes.getNamedItem("label").value;
        layoutActions.storeUpdateFocusCard("Confirm Delete Item",
            ConfirmPopup,
            { title: `Continue delete document '${value}'?`, onYes: onYes },
            "small");
    }

    getItemById(id) {
        return this.state.data[this.state.map[id]];
    }

    editPopup(e) {
        var id = e.currentTarget.id;
        var item = this.getItemById(id);
        var label = e.currentTarget.attributes.getNamedItem("label").value;

        const onYes = () => {
            var del_query = `mutation{delete_doc_link(ID:${id})}`;
            store.dispatch(layoutActions.updateProps({ loading: true }));
            getAxiosGraphQLQuery(del_query).then((res) => {
                window.location.reload();
            }, (err) => {
                alert(err.response.data);
            });
        };

        layoutActions.storeUpdateFocusCard(`Editing ${label}`,
            DocLinkForm,
            {
                id: this.props.id, type: item[DocLink.TYPE], edit: item, entity: this.props.entity,
                onSuccessNew: () => {
                    this.closeFocusCardAndRefresh();
                }
            }, "small");
    }

    render() {
        let maxWidth = "300px"
        var items = (this.state.data.length <= 0)
            ? <div className="text-muted">{lang("Nothing To Show Here")}</div>
            : this.state.data.map((d, i) => {
                //var title = <a target='_blank' href={`${d.url}`}>{d.label}</a>;
                //var onEdit = {label: d.label, id: d.ID, onClick: this.editPopup.bind(this)};
                var icon = (d.type === DocLinkEnum.TYPE_DOC) ? "file-text" : "link";
                return <div className="flex align-center content-center">
                    <i className={`fa left fa-${icon}`}></i>
                    <div className="pr-3" >
                        <a target='_blank' href={`${d.url}`}>
                            <div style={{ maxWidth: maxWidth, overflow: 'hidden', textOverflow: 'ellipsis' }}>{`${d.label} `} </div>
                        </a>
                    </div>
                    <div className="badge" id={d.ID} label={d.label}
                        onClick={this.editPopup.bind(this)}><i className="fa fa-edit"></i></div>
                    <div className="badge" id={d.ID} label={d.label}
                        onClick={this.deletePopup.bind(this)}><i className="fa fa-times"></i></div>
                </div>;
            });



        if (this.state.data.length > 0) {
            items = <CustomList className="label" items={items}></CustomList>;
        }

        var titleList = ((this.props.entity == "user") ? "My " : "") + "Document & Link";
        titleList = lang(titleList);

        return <div className="row container-fluid">
            <div className="col-sm-6">
                <h3 className="left">{lang(`Add New Document ${this.props.isAllowImage ? '/ Image' : ''}`)}</h3>
                <DocLinkForm id={this.props.id} onSuccessNew={this.refresh}
                    isAllowImage={this.props.isAllowImage}
                    type={DocLinkEnum.TYPE_DOC} entity={this.props.entity}></DocLinkForm>
            </div>
            <div className="col-sm-6">
                <h3 className="left">{lang("Add New Link")}</h3>
                <DocLinkForm id={this.props.id} onSuccessNew={this.refresh} type={DocLinkEnum.TYPE_LINK} entity={this.props.entity}></DocLinkForm>
            </div>
            <div className="col-sm-12">
                <br></br>
                <h3 className="left">{titleList}</h3>
                {(this.state.fetching) ? <Loader size="2" text={lang("Loading Document & Link..")}></Loader> : items}
                <br></br>
            </div>
        </div>;

    }
}

DocLinkPage.propTypes = {
    id: PropTypes.number.isRequired,
    isAllowImage: PropTypes.bool,
    entity: PropTypes.oneOf(["user", "company"]).isRequired
}

DocLinkPage.defaultProps = {
    isAllowImage: false,
}