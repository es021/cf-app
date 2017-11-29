import React, { Component } from 'react';
import { Redirect, NavLink} from 'react-router-dom';
import Form, {toggleSubmit} from '../component/form';
import {UserMeta, User, UserEnum}  from '../../config/db-config';
import {Month, Year, Sponsor} from '../../config/data-config';
import {ButtonLink} from '../component/buttons';
import {getAxiosGraphQLQuery} from '../../helper/api-helper';
import obj2arg from 'graphql-obj2arg';
import {loadUser} from '../redux/actions/user-actions';
import {getAuthUser} from '../redux/actions/auth-actions';
import {Loader} from '../component/loader';

export default class EditProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.formOnSubmit = this.formOnSubmit.bind(this);

        this.state = {
            error: null,
            disableSubmit: false,
            init: true,
            user: null
        };
    }

    componentWillMount() {
        console.log("componentWillMount");

        const authUser = getAuthUser();

        loadUser(authUser[User.ID]).then((res) => {
            this.setState(() => {
                return {user: res.data.data.user, init: false}
            })
        });

        this.formItems = [
            {header: "Basic Information"},
            {
                label: "Email",
                name: User.EMAIL,
                type: "email",
                placeholder: "john.doe@gmail.com",
                required: true
            }, /*{
             label: "Password",
             name: User.PASSWORD,
             type: "password",
             placeholder: "*****",
             required: true
             }, {
             label: "Confirm Password",
             name: `${User.PASSWORD}-confirm`,
             type: "password",
             placeholder: "*****",
             required: true
             },*/ {
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

        var err = this.filterForm(d)
        if (err === 0) {

            //prepare data for edit
            d[UserMeta.MAJOR] = JSON.stringify(d[UserMeta.MAJOR]);
            d[UserMeta.MINOR] = JSON.stringify(d[UserMeta.MINOR]);


            var edit_query = `mutation{
                        edit_user(${obj2arg(d, {noOuterBraces: true})}) {
                          ID
                        }
                      }`;

            console.log(edit_query);

            return;
            toggleSubmit(this, {error: null});

            getAxiosGraphQLQuery(edit_query).then((res) => {
                console.log(res.data);
                toggleSubmit(this, {user: d, success: true});
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
        console.log(this.state);
        var content = null;
        if (this.state.init) {
            content = <Loader size="2" text="Loading User Information"></Loader>
        } else {
            content = <div>
            <Form className="form-row" 
                  items={this.formItems} 
                  onSubmit={this.formOnSubmit}
                  submitText='Save Changes'
                  defaultValues={this.state.user}
                  disableSubmit={this.state.disableSubmit} 
                  error={this.state.error}>
            </Form>
        </div>;
        }

        return <div><h3>Edit Profile</h3>{content}</div>;
    }
}


