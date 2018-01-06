import React, { Component } from 'react';
import { Redirect, NavLink } from 'react-router-dom';
import Form, { toggleSubmit, checkDiff } from '../component/form';
import { UserMeta, User, Vacancy, VacancyEnum, UserEnum, Skill } from '../../config/db-config';
import { Company, CompanyEnum, DocLink, DocLinkEnum } from '../../config/db-config';
import { Month, Year, Sponsor } from '../../config/data-config';
import { ButtonLink } from '../component/buttons';
import { getAxiosGraphQLQuery } from '../../helper/api-helper';
import obj2arg from 'graphql-obj2arg';
import { loadUser } from '../redux/actions/user-actions';
import { getAuthUser, isRoleRec, updateAuthUser, isRoleAdmin } from '../redux/actions/auth-actions';
import { Loader } from '../component/loader';
import ProfileCard from '../component/profile-card';
import SubNav from '../component/sub-nav';
import List, { CustomList } from '../component/list';
import * as layoutActions from '../redux/actions/layout-actions';
import ConfirmPopup from './partial/popup/confirm-popup';
import CompanyPopup from './partial/popup/company-popup';
import VacancyPopup from './partial/popup/vacancy-popup';
import { store } from '../redux/store';
import DocLinkPage from '../component/doc-link-form';
import { SimpleListItem } from '../component/list';
import PropTypes from 'prop-types';
import { RootPath } from '../../config/app-config';
import { Time } from '../lib/time';

const PageUrl = `${RootPath}/app/manage-company/vacancy`;

class GeneralForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            disableSubmit: false,
            success: null,
            currentFile: null
        };
        this.formOnSubmit = this.formOnSubmit.bind(this);
        this.Entity = this.props.entity.capitalize();

    }

    componentWillMount() {
        this.formDefault = this.props.formDefault;
        this.formItem = this.props.formItem;
    }

    formOnSubmit(d) {
        toggleSubmit(this, { error: null });

        // empty field become null
        for (var i in d) {
            if (d[i] == "") {
                d[i] = null;
            }
        }

        // for edit
        if (this.props.edit) {
            var update = checkDiff(this, this.props.edit, d, ["ID"]);

            if (update === false) {
                return;
            }
            update.ID = this.props.edit.ID;
            d = update;
        }


        // hook before submit to alter the data one last time
        if (this.props.formWillSubmit) {
            d = this.props.formWillSubmit(d, this.props.edit);
        }

        var query = `mutation{${(this.props.edit) ? "edit" : "add"}_${this.props.entity} 
            (${obj2arg(d, { noOuterBraces: true })}){ID}}`

        getAxiosGraphQLQuery(query).then((res) => {

            var mes = (this.props.edit) ? `Successfully Edit ${this.Entity}!` : `Successfully Added New ${this.Entity}!`;
            toggleSubmit(this, { error: null, success: mes });
            if (this.props.onSuccessNew) {
                this.props.onSuccessNew();
            }
        }, (err) => {
            toggleSubmit(this, { error: err.response.data });
        });

    }

    render() {
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

        return (<div>{form}</div>);
    }
}

GeneralForm.propTypes = {
    entity: PropTypes.string.isRequired,
    formItem: PropTypes.array.isRequired,
    edit: PropTypes.obj, // edit object
    formDefault: PropTypes.object,
    onSuccessNew: PropTypes.func,
    formWillSubmit: PropTypes.func
};


class GeneralFormPage extends React.Component {
    constructor(props) {
        super(props);
        this.addPopup = this.addPopup.bind(this);
        this.onSuccessOperation = this.onSuccessOperation.bind(this);
        this.state = {
            error: null,
            disableSubmit: false,
            success: null,
            loading: true,
            key: 1,
            loadingDelete: false
        };
        this.Entity = this.props.entity.capitalize();
    }

    onSuccessOperation() {
        layoutActions.storeHideFocusCard();
        // this is how to update the child component use state keyy
        // damnnn
        this.setState((prevState) => {
            return { key: prevState.key + 1 };
        })
    }

    // create general form for add new record
    addPopup() {
        layoutActions.storeUpdateFocusCard(`Add ${this.Entity}`,
            GeneralForm,
            {
                entity: this.props.entity,
                formItem: this.props.getFormItem(false),
                formDefault: this.props.newFormDefault,
                onSuccessNew: this.onSuccessOperation,
                formWillSubmit: this.props.formWillSubmit
            }
        );
    }

    // create general form for edit record
    editPopup(e) {
        layoutActions.loadingBlockLoader("Fetching information..");
        const id = e.currentTarget.id;
        this.props.getEditFormDefault(id).then((res) => {
            console.log(res);
            layoutActions.storeHideBlockLoader();
            layoutActions.storeUpdateFocusCard(`Editing ${this.Entity} #${id}`,
                GeneralForm,
                {
                    entity: this.props.entity,
                    formItem: this.props.getFormItem(true),
                    formDefault: res,
                    onSuccessNew: this.onSuccessOperation,
                    formWillSubmit: this.props.formWillSubmit,
                    edit: res
                }
            );
        });
    }

    deletePopup(e) {
        var id = e.currentTarget.id;
        const onYes = () => {
            var del_query = `mutation{delete_${this.props.entity}(ID:${id})}`;
            store.dispatch(layoutActions.updateProps({ loading: true }));
            getAxiosGraphQLQuery(del_query).then((res) => {
                this.onSuccessOperation();
            }, (err) => {
                alert(err.response.data);
            });
        };

        layoutActions.storeUpdateFocusCard("Confirm Delete Item",
            ConfirmPopup,
            { title: `Continue delete this item ?`, onYes: onYes }, "small");
    }

    render() {
        var view = null;
        const renderList = (d, i) => {
            var row = this.props.renderRow(d);
            row.push(<td className="text-right">
                <a id={d.ID}
                    onClick={this.editPopup.bind(this)}>Edit</a>
                {" | "}
                <a id={d.ID}
                    onClick={this.deletePopup.bind(this)}>Delete</a>
            </td>);
            return <tr>{row}</tr>;
        };

        // wrap data with key to force it recreate new component when needed
        var datas = <div key={this.state.key}>
            <List type="table"
                listClass="table table-responsive table-striped table-bordered table-hover table-condensed text-left"
                tableHeader={this.props.tableHeader}
                getDataFromRes={this.props.getDataFromRes}
                loadData={this.props.loadData}
                offset={1}
                renderList={renderList}></List>
        </div>;



        return (<div>
            <h2>{this.props.dataTitle}</h2>
            <a className="btn btn-success btn-sm" onClick={this.addPopup}>Add New Vacancy</a>
            <br></br>
            <br></br>
            <div>{datas}</div>
        </div>);
    }
}

GeneralFormPage.propTypes = {
    entity: PropTypes.oneOf(["vacancy"]).isRequired,
    loadData: PropTypes.func.isRequired,
    renderRow: PropTypes.func.isRequired,
    tableHeader: PropTypes.element.isRequired,
    dataTitle: PropTypes.string.isRequired,
    getFormItem: PropTypes.func.isRequired,
    newFormDefault: PropTypes.array.isRequired,
    getEditFormDefault: PropTypes.func.isRequired,
    formWillSubmit: PropTypes.formWillSubmit
}

class VacancySub extends React.Component {
    constructor(props) {
        super(props);
        const authUser = getAuthUser();
        this.company_id = authUser.rec_company;
        this.user_id = authUser.ID;
    }

    componentWillMount() {
        //##########################################
        // List data properties
        this.renderRow = (d) => {
            var title = <a
                onClick={() => layoutActions.storeUpdateFocusCard(d.title, VacancyPopup, { id: d.ID })}
            >{d.title}</a>;

            return [
                <td>{d.ID}</td>
                , <td><b>{title}</b></td>
                , <td>{d.type}</td>
                , <td>{Time.getString(d.updated_at)}</td>
            ];
        };

        this.tableHeader = <thead>
            <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Type</th>
                <th>Last Updated</th>
            </tr>
        </thead>;

        this.loadData = (page, offset) => {
            var query = `query{company(ID:${this.company_id}){vacancies{ID title type updated_at}}}`;
            return getAxiosGraphQLQuery(query);
        }

        // get actual data from loadData
        // can alter any data here too
        this.getDataFromRes = (res) => {
            return res.data.data.company.vacancies;
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
                vacancy(ID:${ID}) {
                  ID
                  title
                  description
                  requirement
                  type
                  application_url
                }
              }`;

            return getAxiosGraphQLQuery(query).then((res) => {
                var vacan = res.data.data.vacancy;
                return vacan;
            });
        }

        // create form add new default
        this.newFormDefault = {};
        this.newFormDefault[Vacancy.COMPANY_ID] = this.company_id;
        this.newFormDefault[Vacancy.CREATED_BY] = this.user_id;

        this.getFormItem = (edit) => {
            return [
                { header: "Vacancy Form" },
                {
                    label: "Title",
                    name: Vacancy.TITLE,
                    type: "text",
                    placeholder: "Software Developer",
                    required: true
                }, {
                    label: "Company Id",
                    name: Vacancy.COMPANY_ID,
                    type: "number",
                    disabled: true,
                    hidden: true,
                    required: (!edit)
                }, {
                    label: "Created By",
                    name: Vacancy.CREATED_BY,
                    type: "number",
                    disabled: true,
                    hidden: true,
                    required: (!edit)
                }, {
                    label: "Type",
                    name: Vacancy.TYPE,
                    type: "select",
                    required: true,
                    data: [VacancyEnum.TYPE_FULL_TIME, VacancyEnum.TYPE_PART_TIME, VacancyEnum.TYPE_INTERN]
                }, {
                    label: "Application Url",
                    name: Vacancy.APPLICATION_URL,
                    type: "text"
                }, {
                    label: "Description",
                    name: Vacancy.DESCRIPTION,
                    type: "textarea",
                    placeholder: "Tell more about the vacancy"
                }, {
                    label: "Requirement",
                    name: Vacancy.REQUIREMENT,
                    type: "textarea",
                }
            ];
        }
    }

    render() {
        return <GeneralFormPage
            dataTitle="Vacancies"
            entity="vacancy"
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

class CompanyDocLink extends React.Component {
    render() {
        return <DocLinkPage entity="company" id={getAuthUser().rec_company}></DocLinkPage>;
    }
}

// TODO 
// adjust form
class AboutSub extends React.Component {
    constructor(props) {
        super(props);
        this.formOnSubmit = this.formOnSubmit.bind(this);
        this.state = {
            error: null,
            disableSubmit: false,
            init: true,
            data: null,
            success: null
        };
    }

    componentWillMount() {
        this.company_id = getAuthUser().rec_company;

        var query = `query {
            company(ID:${this.company_id}) {
              ID
              name
              type
              tagline
              description
              more_info
              img_url
              img_position
              img_size
          }}`;

        getAxiosGraphQLQuery(query).then((res) => {
            this.setState(() => {
                return { data: res.data.data.company, init: false }
            })
        });

        this.formItems = [];

        // for admin
        if (isRoleAdmin()) {
            this.formItems.push(...[
                { header: "Admin Only" },
                {
                    label: "Name",
                    name: Company.NAME,
                    type: "text",
                    placeholder: "Company Name",
                    required: true
                }, {
                    label: "Type",
                    name: Company.TYPE,
                    type: "select",
                    data: Month,
                    required: true
                }
            ]);
        }

        this.formItems.push(...[
            { header: "Basic Information" },
            {
                label: "Tagline",
                name: Company.TAGLINE,
                type: "text",
                placeholder: "Company Tagline"
            }, {
                label: "Description",
                name: Company.DESCRIPTION,
                type: "textarea",
                rows: 6,
                placeholder: "Tell more about your company"
            }, {
                label: "Additional Information",
                name: Company.MORE_INFO,
                type: "textarea",
                rows: 6,
                placeholder: "Anything you might want the student to know about the company. Upcoming events, benefits. culture, etc."
            }
        ]);
    }

    //return string if there is error
    filterForm(d) {
        return 0;
    }

    formOnSubmit(d) {
        var err = this.filterForm(d);
        if (err === 0) {
            toggleSubmit(this, { error: null, success: null });
            var update = checkDiff(this, this.state.data, d);
            // console.log(this.state.data.more_info);
            // console.log(d.more_info);
            // return;
            if (update === false) {
                return;
            }

            update[Company.ID] = this.company_id;

            var edit_query = `mutation{edit_company(${obj2arg(update, { noOuterBraces: true })}) {ID}}`;
            console.log(edit_query);
            getAxiosGraphQLQuery(edit_query).then((res) => {
                console.log(res.data);

                var newData = Object.assign(this.state.data, d);
                toggleSubmit(this, { data: newData, error: null, success: "Your Change Has Been Saved!" });
            }, (err) => {
                toggleSubmit(this, { error: err.response.data });
            });
        } else {
            //console.log("Err", err);
            this.setState(() => {
                return { error: err };
            });
        }
    }

    render() {
        var content = null;
        if (this.state.init) {
            content = <Loader size="2" text="Loading Company Information"></Loader>;
        } else {
            content = <div>
                <ProfileCard type="company"
                    id={this.state.data.ID}
                    add_img_ops={true}
                    title={this.state.data.name} subtitle={""}
                    img_url={this.state.data.img_url} img_pos={this.state.data.img_position} img_size={this.state.data.img_size}
                ></ProfileCard>

                <Form className="form-row"
                    items={this.formItems}
                    onSubmit={this.formOnSubmit}
                    submitText='Save Changes'
                    defaultValues={this.state.data}
                    disableSubmit={this.state.disableSubmit}
                    error={this.state.error}
                    success={this.state.success}>
                </Form>
            </div>;
        }

        return <div><h3>Edit Company</h3>{content}</div>;
    }
}


// For Recruiter ------------------------------------------------------/

export default class ManageCompanyPage extends React.Component {
    componentWillMount() {
        this.item = {
            "about": {
                label: "Edit Company",
                component: AboutSub,
                icon: "edit"
            },
            "vacancy": {
                label: "Vacancy",
                component: VacancySub,
                icon: "black-tie"
            },
            "doc-link": {
                label: "Document & Link",
                component: CompanyDocLink,
                icon: "file-text"
            }
        };

        const authUser = getAuthUser();

        this.item["view"] = {
            label: "View Company",
            onClick: () => {
                layoutActions.storeUpdateFocusCard("My Company", CompanyPopup, {
                    id: authUser.rec_company
                });
            },
            component: null,
            icon: "eye"
        }
    }

    render() {
        var path = (this.props.match.params.current) ? this.props.match.params.current : "about";
        var title = this.item[path].label;
        document.setTitle(title);
        return <SubNav route="manage-company" items={this.item} defaultItem={path}></SubNav>;
    }
}
