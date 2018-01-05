import React, { Component } from 'react';
import { Redirect, NavLink } from 'react-router-dom';
import Form, { toggleSubmit, checkDiff } from '../component/form';
import { UserMeta, User, UserEnum, Skill } from '../../config/db-config';
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
import { store } from '../redux/store';
import DocLinkPage from '../component/doc-link-form';
import { SimpleListItem } from '../component/list';
import PropTypes from 'prop-types';
import { RootPath } from '../../config/app-config';


const PageUrl = `${RootPath}/app/manage-company/vacancy`;

class GeneralFormPage extends React.Component {
    constructor(props) {
        super(props);
        this.formOnSubmit = this.formOnSubmit.bind(this);
        this.state = {
            error: null,
            disableSubmit: false,
            success: null,
            loading: true,
            key: 1,
            loadingDelete: false
        };
    }

    componentWillMount() {
        this.formItems = [
            {
                name: Skill.LABEL,
                type: "text",
                placeholder: "Web Development",
                required: true
            }];
    }

    formOnSubmit(d) {
        var ins = {
            user_id: getAuthUser().ID,
            label: d.label
        };
        toggleSubmit(this, { error: null, success: null });
        var add_query = `mutation{add_${this.props.entity}(${obj2arg(ins, { noOuterBraces: true })}) {ID label}}`;
        getAxiosGraphQLQuery(add_query).then((res) => {
            var prevSkill = this.state.skills;
            prevSkill.unshift(res.data.data.add_skill);
            toggleSubmit(this, { error: null, skill: prevSkill, success: "Successfully Added New Record" });
        }, (err) => {
            toggleSubmit(this, { error: err.response.data });
        });
    }

    deletePopup(e) {
        var id = e.currentTarget.id;
        const onYes = () => {
            var del_query = `mutation{delete_${this.props.entity}(ID:${id})}`;
            store.dispatch(layoutActions.updateProps({ loading: true }));
            getAxiosGraphQLQuery(del_query).then((res) => {
                store.dispatch(layoutActions.hideFocusCard());

                // this is how to update the child component use state keyy
                // damnnn
                this.setState((prevState) => {
                    return { key: prevState.key + 1 };
                })

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
                <a id={d.ID} label={d.label}
                    onClick={this.deletePopup.bind(this)}>Edit</a>
                {" | "}
                <a id={d.ID} label={d.label}
                    onClick={this.deletePopup.bind(this)}>Delete</a>
            </td>);
            return <tr>{row}</tr>;
        };

        // wrap data with key to force it recreate new component when needed
        var datas = <div key={this.state.key}>
            <List type="table"
                listClass="table table-responsive table-hover table-condensed text-left"
                tableHeader={this.props.tableHeader}
                getDataFromRes={this.props.getDataFromRes}
                loadData={this.props.loadData}
                offset={1}
                renderList={renderList}></List>
        </div>;


        var form = <Form className="form-row"
            items={this.formItems}
            onSubmit={this.formOnSubmit}
            submitText='Add Skill'
            disableSubmit={this.state.disableSubmit}
            error={this.state.error}
            emptyOnSuccess={true}
            success={this.state.success}></Form>;
        return (<div>
            <h3>Add New Vacancy</h3>
            {form}<br></br>
            <h3>{this.props.dataTitle}</h3>
            <div>{datas}</div>
        </div>);
    }
}

GeneralFormPage.propTypes = {
    entity: PropTypes.oneOf(["vacancy"]).isRequired,
    loadData: PropTypes.func.isRequired,
    renderRow: PropTypes.func.isRequired,
    tableHeader: PropTypes.element.isRequired,
    dataTitle: PropTypes.string.isRequired
}

// create Custom Table List.
// see user page?
class VacancySub extends React.Component {
    constructor(props) {
        super(props);
        this.company_id = getAuthUser().rec_company;

    }
    render() {
        const renderRow = (d) => {
            return [
                <td>{d.ID}</td>
                , <td>{d.title}</td>
                , <td>{d.type}</td>
            ];
        };

        const getDataFromRes = (res) => {
            return res.data.data.company.vacancies;
        }

        const loadData = (page, offset) => {
            var query = `query{company(ID:${this.company_id}){vacancies{ID title type}}}`;
            return getAxiosGraphQLQuery(query);
        }

        const tableHeader = <thead>
            <th>ID</th>
            <th>Title</th>
            <th>Type</th>
        </thead>;

        return <GeneralFormPage dataTitle="Vacancies" tableHeader={tableHeader}
            renderRow={renderRow} getDataFromRes={getDataFromRes} entity="vacancy" loadData={loadData}></GeneralFormPage>
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
