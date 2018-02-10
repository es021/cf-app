import React, { Component } from 'react';
import { Redirect, NavLink } from 'react-router-dom';
import Form, { toggleSubmit, getDataCareerFair } from '../component/form';
import { UserMeta, User, UserEnum } from '../../config/db-config';
import { Month, Year, Sponsor } from '../../config/data-config';
import { ButtonLink } from '../component/buttons';
import { register, getCF, getCFObj } from '../redux/actions/auth-actions';
import { RootPath } from '../../config/app-config';

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
        this.CF = getCF();
        this.CFObj = getCFObj();

        if (!this.CFObj.can_register) {
            return;
        }

        this.defaultValues = {};
        this.defaultValues[User.CF] = this.CF;

        this.formItems = [
            { header: "Select Career Fair" },
            {
                name: User.CF,
                type: "radio",
                data: getDataCareerFair("register"),
                required: true
            },
            { header: "Basic Information" },
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
            { header: "Additional Information" },
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
                name: UserMeta.GRADUATION_MONTH,
                type: "select",
                data: Month,
                required: true

            }, {
                label: null,
                name: UserMeta.GRADUATION_YEAR,
                type: "select",
                data: Year,
                required: true

            }, {
                label: "Work Availability Date",
                sublabel: "Select 'Available To Start Anytime' for both field below if you are ready to work anytime.",
                name: UserMeta.AVAILABLE_MONTH,
                type: "select",
                data: Array("Available To Start Anytime", ...Month),
                required: true

            }, {
                label: null,
                name: UserMeta.AVAILABLE_YEAR,
                type: "select",
                data: Array("Available To Start Anytime", ...Year),
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

            //prepare data for registration
            d[UserMeta.MAJOR] = JSON.stringify(d[UserMeta.MAJOR]);
            d[UserMeta.MINOR] = JSON.stringify(d[UserMeta.MINOR]);
            d[User.LOGIN] = d[User.EMAIL];
            d[UserMeta.USER_STATUS] = UserEnum.STATUS_NOT_ACT;

            toggleSubmit(this, { error: null });

            // cf is set in this function
            register(d).then((res) => {
                console.log(res.data);
                toggleSubmit(this, { user: d, success: true });
            }, (err) => {
                toggleSubmit(this, { error: err.response.data });
            });

        } else {
            //console.log("Err", err);
            this.setState(() => {
                return { error: err }
            });
        }
    }

    render() {
        document.setTitle("Sign Up");

        if (!this.CFObj.can_register) {
            return <div>
                <h3>Registration for
                    <br></br><b>{this.CFObj.title}</b>
                    <br></br>is not open yet
                    <br></br>
                    <small>Stay Tuned For More Info</small>
                </h3>
            </div>;
        }

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
                <h3>Student Registration<br></br></h3>
                <NavLink to={`${RootPath}/auth/sign-up-recruiter`}>Not A Student?</NavLink>
                <Form className="form-row"
                    items={this.formItems}
                    onSubmit={this.formOnSubmit}
                    defaultValues={this.defaultValues}
                    submitText='Sign Me Up !'
                    disableSubmit={this.state.disableSubmit}
                    error={this.state.error}>
                </Form>
            </div>;
        }

        return content;
    }
}


