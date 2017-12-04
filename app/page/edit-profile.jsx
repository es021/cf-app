import React, { Component } from 'react';
import { Redirect, NavLink} from 'react-router-dom';
import Form, {toggleSubmit, checkDiff} from '../component/form';
import {UserMeta, User, UserEnum}  from '../../config/db-config';
import {Month, Year, Sponsor} from '../../config/data-config';
import {ButtonLink} from '../component/buttons';
import {getAxiosGraphQLQuery} from '../../helper/api-helper';
import obj2arg from 'graphql-obj2arg';
import {loadUser} from '../redux/actions/user-actions';
import {getAuthUser, updateAuthUser} from '../redux/actions/auth-actions';
import {Loader} from '../component/loader';
import ProfileCard from '../component/profile-card';
import SubNav from '../component/sub-nav';


class Documents extends React.Component {
    render() {
        return <h3>Document</h3>;
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

    componentWillMount() {

        this.authUser = getAuthUser();

        loadUser(this.authUser[User.ID]).then((res) => {
            this.setState(() => {
                var user = res.data.data.user;
                return {user: user, init: false}
            })
        });

        this.formItems = [
            {header: "Basic Information"},
            {
                label: "First Name",
                name: UserMeta.FIRST_NAME,
                type: "text",
                placeholder: "John",
                required: true
            }, {
                label: "Last Name",
                name: UserMeta.LAST_NAME,
                type: "text",
                placeholder: "Doe",
                required: true
            }, {
                label: "Phone Number",
                name: UserMeta.PHONE_NUMBER,
                type: "text",
                placeholder: "XXX-XXXXXXX",
                required: true
            },
            {header: "Additional Information"},
            {
                label: "Major",
                name: UserMeta.MAJOR,
                type: "text",
                multiple: true,
                required: true
            }, {
                label: "Minor",
                name: UserMeta.MINOR,
                type: "text",
                multiple: true,
                required: false
            }, {
                label: "University",
                name: UserMeta.UNIVERSITY,
                type: "text",
                required: true
            }, {
                label: "Current CGPA",
                name: UserMeta.CGPA,
                type: "number",
                step: "0.01",
                min: "0",
                required: true,
                sublabel: <ButtonLink label="Don't Use CGPA system?" 
                            target='_blank'
                            href="https://www.foreigncredits.com/resources/gpa-calculator/">
                </ButtonLink>
            }, {
                label: "Expected Graduation",
                name: UserMeta.GRAD_MONTH,
                type: "select",
                data: Month,
                required: true

            }, {
                label: null,
                name: UserMeta.GRAD_YEAR,
                type: "select",
                data: Year,
                required: true

            }, {
                label: "Sponsor",
                name: UserMeta.SPONSOR,
                type: "select",
                data: Sponsor,
                required: true,
                sublabel: "This information will not be displayed in your profile."

            }, {
                label: "Description",
                name: UserMeta.DESCRIPTION,
                type: "textarea",
                placeholder: "Tell More About Yourself",
                required: false,
                rows: 5
            }
        ];

    }

    //return string if there is error
    filterForm(d) {
        return 0;
    }

    formOnSubmit(d) {

        var err = this.filterForm(d);
        if (err === 0) {
            toggleSubmit(this, {error: null, success: null});

            //prepare data for edit
            d[UserMeta.MAJOR] = JSON.stringify(d[UserMeta.MAJOR]);
            d[UserMeta.MINOR] = JSON.stringify(d[UserMeta.MINOR]);

            var update = checkDiff(this, this.state.user, d);
            if (update === false) {
                return;
            }
            update[User.ID] = this.authUser[User.ID];

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

            var edit_query = `mutation{edit_user(${obj2arg(update, {noOuterBraces: true})}) {ID}}`;

            console.log(edit_query);

            getAxiosGraphQLQuery(edit_query).then((res) => {
                console.log(res.data);
                updateAuthUser(d);
                toggleSubmit(this, {user: d, error: null, success: "Your Change Has Been Saved!"});
            }, (err) => {
                toggleSubmit(this, {error: err.response.data});
            });

        } else {
            //console.log("Err", err);
            this.setState(() => {
                return {error: err}
            });
        }
    }

    render() {
        var content = null;
        if (this.state.init) {
            content = <Loader size="2" text="Loading User Information"></Loader>
        } else {
            content = <div> 
            <ProfileCard type="student"
                         id ={this.authUser.ID}
                         add_img_ops ={true}
                         title={this.authUser.user_email} subtitle={""}
                         img_url={this.authUser.img_url} img_pos={this.authUser.img_pos} img_size={this.authUser.img_size}    
                         ></ProfileCard>
        
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



export default class EditProfilePage extends React.Component {
    componentWillMount() {
        this.defaultItem = "ep"
        this.item = {
            "ep": {
                label: "My Profile",
                component: EditProfile,
                icon: "user"
            },
            "doc": {
                label: "Documents",
                component: Documents,
                icon: "file-text"
            },
            "act": {
                label: "Activity",
                component: Documents,
                icon: "user"
            }
        }
    }

    render() {
        return <SubNav items={this.item} defaultItem={this.defaultItem}></SubNav>;
    }
}
