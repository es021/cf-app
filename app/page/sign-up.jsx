import React, { Component } from 'react';
import { Redirect, NavLink} from 'react-router-dom';
import Form, {toggleSubmit} from '../component/form';
import {UserMeta, User}  from '../../config/db-config';
import {Month, Year, Sponsor} from '../../config/data-config';
import {ButtonLink} from '../component/buttons';
import {register} from '../redux/actions/auth-actions';

export default class SignUpPage extends React.Component {
    constructor(props) {
        super(props);
        this.formOnSubmit = this.formOnSubmit.bind(this);

        this.state = {
            error: null,
            disableSubmit: false,
            success: false,
            user: null
        };
    }

    componentWillMount() {
        this.formItems = [
            {header: "Basic Information"},
            {
                label: "Email",
                name: User.EMAIL,
                type: "email",
                placeholder: "john.doe@gmail.com",
                required: true
            }, {
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
            }, {
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

        //check if both password is same
        if (d[User.PASSWORD] !== d[`${User.PASSWORD}-confirm`]) {
            return "Password not same";
        }

        return 0;

    }

    formOnSubmit(d) {
        console.log("sign up", d);

        var err = this.filterForm(d)
        if (err === 0) {
            toggleSubmit(this, {error: null});
            register(d).then((res) => {
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
        var content = null;
        if (this.state.success) {
            //scroll to top
            window.scrollTo(0, 0);
            
            console.log(this.state.user);
            var user = this.state.user;
            content = <div>
                <h3>Welcome {user[UserMeta.FIRST_NAME]} !  <i className="fa fa-smile-o"></i></h3>
                Your account has been successfully created<br></br>
                Please check your email (<b>{user[User.EMAIL]}</b>) for the activation link.
                <br></br>
                <small><i>** The email might take a few minutes to arrive **</i></small>
            </div>
        } else {
            content = <div>
                <h3>Student Registration</h3>
                <NavLink to={`/auth/sign-up-recruiter`}>Not A Student?</NavLink>
                <Form className="form-row" 
                      items={this.formItems} 
                      onSubmit={this.formOnSubmit}
                      submitText='Sign Me Up !'
                      disableSubmit={this.state.disableSubmit} 
                      error={this.state.error}>
                </Form>
            </div>;
        }

        return content;
    }
}


