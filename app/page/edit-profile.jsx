import React, { Component } from 'react';
//import { Redirect, NavLink } from 'react-router-dom';
import Form, { toggleSubmit, checkDiff } from '../component/form';
import { UserMeta, User, UserEnum, Skill, DocLink, DocLinkEnum } from '../../config/db-config';
//import { Month, Year, Sponsor, MasState, Country } from '../../config/data-config';
//import { ButtonLink } from '../component/buttons';
import { getAxiosGraphQLQuery } from '../../helper/api-helper';
import obj2arg from 'graphql-obj2arg';
import { getAuthUser, isRoleRec, isRoleStudent, updateAuthUser } from '../redux/actions/auth-actions';
import { Loader } from '../component/loader';
import ProfileCard from '../component/profile-card';
import SubNav from '../component/sub-nav';
import { CustomList } from '../component/list';
import * as layoutActions from '../redux/actions/layout-actions';
import ConfirmPopup from './partial/popup/confirm-popup';
import UserPopup from './partial/popup/user-popup';
//import { store } from '../redux/store';
import DocLinkPage from '../component/doc-link-form';
//import { SimpleListItem } from '../component/list';
import PasswordResetPage from './password-reset';
import AvailabilityView from './availability';
import { getEditProfileFormItem } from '../../config/user-config';

class StudentDocLink extends React.Component {
    render() {
        return <DocLinkPage entity="user" id={getAuthUser().ID}></DocLinkPage>;
    }
}

class Skills extends React.Component {
    constructor(props) {
        super(props);
        this.formOnSubmit = this.formOnSubmit.bind(this);
        this.state = {
            error: null,
            disableSubmit: false,
            success: null,
            loading: true,
            skills: [],
            loadingDelete: false
        };
    }

    loadSkills() {
        var query = `query{user(ID:${getAuthUser().ID}){skills{ID label}}}`;
        getAxiosGraphQLQuery(query).then((res) => {
            this.setState((prevState) => {
                return { skills: res.data.data.user.skills, loading: false };
            });
        });
    }

    componentWillMount() {
        this.loadSkills();
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
        var edit_query = `mutation{add_skill(${obj2arg(ins, { noOuterBraces: true })}) {ID label}}`;
        getAxiosGraphQLQuery(edit_query).then((res) => {
            var prevSkill = this.state.skills;
            prevSkill.unshift(res.data.data.add_skill);
            toggleSubmit(this, { error: null, skill: prevSkill, success: "Successfully Added New Skill" });
        }, (err) => {
            toggleSubmit(this, { error: err.response.data });
        });
    }

    onOperationSuccess() {
        layoutActions.storeHideFocusCard();
        this.loadSkills();
    }

    deletePopup(e) {
        var id = e.currentTarget.id;
        const onYes = () => {
            var del_query = `mutation{delete_skill(ID:${id})}`;
            layoutActions.storeUpdateProps({ loading: true });
            getAxiosGraphQLQuery(del_query).then((res) => {
                this.onOperationSuccess();
            }, (err) => {
                alert(err.response.data);
            });
        };
        var value = e.currentTarget.attributes.getNamedItem("label").value;
        layoutActions.storeUpdateFocusCard("Confirm Delete Item",
            ConfirmPopup,
            { title: `Continue delete skill '${value}'?`, onYes: onYes },
            "small");
    }

    render() {
        var view = null;
        var skills = (this.state.loading) ? <Loader size="2" text="Loading skills.."></Loader>
            : <div className="text-muted">Nothing To Show Here</div>;
        if (!this.state.loading && this.state.skills.length > 0) {

            var skillItems = this.state.skills.map((d, i) => {
                return <span>{`${d.label} `}
                    <span className="badge" id={d.ID} label={d.label}
                        onClick={this.deletePopup.bind(this)}
                    >X</span>
                </span>;
            });
            skills = <CustomList className="label" items={skillItems}></CustomList>;

        }

        var form = <Form className="form-row"
            items={this.formItems}
            onSubmit={this.formOnSubmit}
            submitText='Add Skill'
            disableSubmit={this.state.disableSubmit}
            error={this.state.error}
            emptyOnSuccess={true}
            success={this.state.success}></Form>;
        return (<div>
            <h3>Add New Skill</h3>
            {form}<br></br>
            <h3>My Skills</h3>
            <div>{skills}</div></div>);
    }
}

class EditProfile extends React.Component {
    constructor(props) {
        super(props);
        this.formOnSubmit = this.formOnSubmit.bind(this);
        this.state = {
            error: null,
            disableSubmit: false,
            init: true,
            user: null,
            success: null
        };
    }


    loadUser(id, role) {
        var extra = "";

        if (role === UserEnum.ROLE_STUDENT) {
            extra = `user_status
            university
            phone_number
            graduation_month
            graduation_year
            available_month
            available_year
            sponsor
            gender
            cgpa
            major
            minor
            mas_state
            mas_postcode
            relocate
            study_place
            looking_for`;

        } else if (role === UserEnum.ROLE_RECRUITER) {
            extra = `rec_position rec_company`;
        }

        var query = `query {
            user(ID:${id}) {
              ID
              user_email
              user_pass
              first_name
              last_name
              description
              role
              img_url
              img_pos
              img_size
              ${extra}
            }}`;

        return getAxiosGraphQLQuery(query);
    }

    componentWillMount() {
        this.authUser = getAuthUser();
        this.loadUser(this.authUser.ID, this.authUser.role).then((res) => {
            this.setState(() => {
                var user = res.data.data.user;
                return { user: user, init: false };
            });
        });
        this.formItems = getEditProfileFormItem(this.authUser.role);
        // this.formItems = [
        //     { header: "Basic Information" },
        //     {
        //         label: "First Name",
        //         name: UserMeta.FIRST_NAME,
        //         type: "text",
        //         placeholder: "John",
        //         required: true
        //     }, {
        //         label: "Last Name",
        //         name: UserMeta.LAST_NAME,
        //         type: "text",
        //         placeholder: "Doe",
        //         required: true
        //     }];

        // // for student
        // if (isRoleStudent()) {
        //     this.formItems.push(...[{
        //         label: "Phone Number",
        //         name: UserMeta.PHONE_NUMBER,
        //         type: "text",
        //         placeholder: "XXX-XXXXXXX",
        //         required: true
        //     },
        //     // {
        //     //     label: "Gender",
        //     //     name: UserMeta.GENDER,
        //     //     type: "select",
        //     //     data: ["", UserEnum.GENDER_MALE, UserEnum.GENDER_FEMALE],
        //     //     required: true
        //     // },
        //     { header: "Where Do You Reside In Malaysia?" },
        //     {
        //         label: "State",
        //         name: UserMeta.MAS_STATE,
        //         type: "select",
        //         data: MasState,
        //         required: true
        //     },
        //     // {
        //     //     label: "Postcode",
        //     //     name: UserMeta.MAS_POSTCODE,
        //     //     type: "text",
        //     //     required: true,
        //     //     placeholder: "20050"
        //     // },
        //     { header: "Degree Related Information" },
        //     {
        //         label: "Major",
        //         name: UserMeta.MAJOR,
        //         type: "text",
        //         multiple: true,
        //         required: true
        //     }, {
        //         label: "Minor",
        //         name: UserMeta.MINOR,
        //         type: "text",
        //         multiple: true,
        //         required: false
        //     }, {
        //         label: "University",
        //         name: UserMeta.UNIVERSITY,
        //         type: "text",
        //         required: true
        //     },
        //     {
        //         label: "Where Is Your University Located?",
        //         name: UserMeta.STUDY_PLACE,
        //         type: "select",
        //         data: Country,
        //         required: true
        //     },
        //     {
        //         label: "Current CGPA",
        //         name: UserMeta.CGPA,
        //         type: "number",
        //         step: "0.01",
        //         min: "0",
        //         required: false,
        //         sublabel: <ButtonLink label="Don't Use CGPA system?"
        //             target='_blank'
        //             href="https://www.foreigncredits.com/resources/gpa-calculator/">
        //         </ButtonLink>
        //     }, {
        //         label: "Expected Graduation",
        //         name: UserMeta.GRADUATION_MONTH,
        //         type: "select",
        //         data: Month,
        //         required: true

        //     }, {
        //         label: null,
        //         name: UserMeta.GRADUATION_YEAR,
        //         type: "select",
        //         data: Year,
        //         required: true

        //     },
        //     { header: "Future Employment Information" },
        //     {
        //         label: "Looking For",
        //         name: UserMeta.LOOKING_FOR,
        //         type: "select",
        //         data: ["", UserEnum.LOOK_FOR_FULL_TIME, UserEnum.LOOK_FOR_INTERN],
        //         required: true
        //     },
        //     // {
        //     //     label: "Work Availability Date",
        //     //     sublabel: "Select 'Available To Start Anytime' for both field below if you are ready to work anytime.",
        //     //     name: UserMeta.AVAILABLE_MONTH,
        //     //     type: "select",
        //     //     data: Array("Available To Start Anytime", ...Month),
        //     //     required: true
        //     // }, {
        //     //     label: null,
        //     //     name: UserMeta.AVAILABLE_YEAR,
        //     //     type: "select",
        //     //     data: Array("Available To Start Anytime", ...Year),
        //     //     required: true
        //     // }, 
        //     {
        //         label: "Are You Willing To Relocate?",
        //         name: UserMeta.RELOCATE,
        //         type: "select",
        //         data: Array("", "Yes", "No"),
        //         required: true
        //     },
        //     { header: "Additional Information" },
        //     {
        //         label: "Sponsor",
        //         name: UserMeta.SPONSOR,
        //         type: "select",
        //         data: Sponsor,
        //         required: false,
        //         sublabel: "This information will not be displayed in your profile."

        //     }, {
        //         label: "Description",
        //         name: UserMeta.DESCRIPTION,
        //         type: "textarea",
        //         placeholder: "Tell More About Yourself",
        //         required: false,
        //         rows: 5
        //     }
        //     ]);
        // } else if (isRoleRec()) {
        //     this.formItems.push(...[{
        //         label: "Position",
        //         name: UserMeta.REC_POSITION,
        //         type: "text",
        //         placeholder: "HR Manager"
        //     }]);
        // }
    }

    //return string if there is error
    filterForm(d) {
        return 0;
    }

    formOnSubmit(d) {

        var err = this.filterForm(d);
        if (err === 0) {
            toggleSubmit(this, { error: null, success: null });
            //prepare data for edit
            d[UserMeta.MAJOR] = JSON.stringify(d[UserMeta.MAJOR]);
            d[UserMeta.MINOR] = JSON.stringify(d[UserMeta.MINOR]);
            var update = checkDiff(this, this.state.user, d);
            if (update === false) {
                return;
            }
            update[User.ID] = this.authUser[User.ID];

            if (update[UserMeta.CGPA] == "") {
                update[UserMeta.CGPA] = 0;
            }

            /* 
             var update = {};
             update[User.ID] = this.authUser[User.ID];
             var hasDiff = false;
             
             //get differences
             for (var k in d) {
             if (d[k] !== this.state.user[k]) {
             hasDiff = true;
             update[k] = d[k];
             }
             }
             console.log(update);
             //return;
             if (!hasDiff) {
             toggleSubmit(this, {error: "No Changes Has Been Made"});
             return;
             }*/

            var edit_query = `mutation{edit_user(${obj2arg(update, { noOuterBraces: true })}) {ID}}`;
            console.log(edit_query);
            getAxiosGraphQLQuery(edit_query).then((res) => {
                console.log(res.data);
                updateAuthUser(d);
                toggleSubmit(this, { user: d, error: null, success: "Your Change Has Been Saved!" });
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
            content = <Loader size="2" text="Loading User Information"></Loader>;
        } else {
            content = <div>
                <ProfileCard type="student"
                    id={this.authUser.ID}
                    add_img_ops={true}
                    title={<b>{this.authUser.user_email}</b>}
                    subtitle={<i>{this.authUser.role.capitalize()}</i>}
                    img_url={this.authUser.img_url} img_pos={this.authUser.img_pos} img_size={this.authUser.img_size}>
                </ProfileCard>

                <Form className="form-row"
                    items={this.formItems}
                    onSubmit={this.formOnSubmit}
                    submitText='Save Changes'
                    defaultValues={this.state.user}
                    disableSubmit={this.state.disableSubmit}
                    error={this.state.error}
                    success={this.state.success}>
                </Form>
            </div>;
        }

        return <div><h3>Edit Profile</h3>{content}</div>;
    }
}


// For Recruiter ------------------------------------------------------/

export default class EditProfilePage extends React.Component {
    componentWillMount() {
        this.item = {
            "profile": {
                label: "Edit Profile",
                component: EditProfile,
                icon: "edit"
            }
        };

        const authUser = getAuthUser();


        if (isRoleStudent()) {
            this.item["doc-link"] = {
                label: "Document & Link",
                component: StudentDocLink,
                icon: "file-text"
            };
            this.item["skills"] = {
                label: "Skills",
                component: Skills,
                icon: "th-list"
            };
            this.item["availability"] = {
                label: "Availability",
                component: AvailabilityView,
                props: {
                    user_id: authUser.ID,
                    set_only: true
                },
                icon: "clock-o"
            };
        }

        this.item["password-reset"] = {
            label: "Change Password",
            component: PasswordResetPage,
            icon: "lock"
        };

        this.item["view"] = {
            label: "View Profile",
            onClick: () => {
                layoutActions.storeUpdateFocusCard("My Profile", UserPopup, {
                    id: authUser.ID
                    , role: authUser.role
                });
            },
            component: null,
            icon: "eye"
        }
    }

    render() {

        var title = this.item[this.props.match.params.current].label;
        document.setTitle(title);
        return <SubNav route="edit-profile" items={this.item} defaultItem={this.props.match.params.current}></SubNav>;
    }
}
