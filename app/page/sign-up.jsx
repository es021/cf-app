import React, { Component } from 'react';
import { Redirect, NavLink } from 'react-router-dom';
import Form, { toggleSubmit, getDataCareerFair } from '../component/form';
import { UserMeta, User, UserEnum } from '../../config/db-config';
import { Month, Year, Sponsor, MasState, Country } from '../../config/data-config';
import { ButtonLink } from '../component/buttons';
import { register, getCF, getCFObj } from '../redux/actions/auth-actions';
import { RootPath, DocumentUrl, LandingUrl } from '../../config/app-config';
import AvailabilityView from './availability';

export default class SignUpPage extends React.Component {
    constructor(props) {
        super(props);
        this.formOnSubmit = this.formOnSubmit.bind(this);

        this.state = {
            confirmed: false,
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
            {
                label: "Gender",
                name: UserMeta.GENDER,
                type: "select",
                data: ["", UserEnum.GENDER_MALE, UserEnum.GENDER_FEMALE],
                required: true
            },
            { header: "Where Do You Reside In Malaysia?" },
            {
                label: "State",
                name: UserMeta.MAS_STATE,
                type: "select",
                data: MasState,
                required: true
            }, {
                label: "Postcode",
                name: UserMeta.MAS_POSTCODE,
                type: "text",
                required: true,
                placeholder: "20050"
            },
            { header: "Degree Related Information" },
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
            },
            {
                label: "Where Is Your University Located?",
                name: UserMeta.STUDY_PLACE,
                type: "select",
                data: Country,
                required: true
            },
            {
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

            },
            { header: "Future Employment Information" },
            {
                label: "Looking For",
                name: UserMeta.LOOKING_FOR,
                type: "select",
                data: ["", UserEnum.LOOK_FOR_FULL_TIME, UserEnum.LOOK_FOR_INTERN],
                required: true
            },
            {
                label: "Work Availability Date",
                sublabel: "Select 'Available To Start Anytime' for both field below if you are ready to work anytime.",
                name: UserMeta.AVAILABLE_MONTH,
                type: "select",
                data: Array(...Month),
                required: true

            },
            {
                label: null,
                name: UserMeta.AVAILABLE_YEAR,
                type: "select",
                data: Array(...Year),
                required: true
            },
            {
                label: "Are You Willing To Relocate?",
                name: UserMeta.RELOCATE,
                type: "select",
                data: Array("", "Yes", "No"),
                required: true
            },
            { header: "Additional Information" },
            {
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
            }, {
                label: null,
                name: "accept-policy",
                type: "checkbox",
                data: [{
                    key: "accepted",
                    label: <small>I agree to <a href={`${DocumentUrl}/privacy-policy.pdf`} target="_blank">terms and conditions</a></small>
                }],
                required: true
            }
        ];
    }

    //return string if there is error
    filterForm(d) {
        //check if both password is same
        if (d[User.PASSWORD] !== d[`${User.PASSWORD}-confirm`]) {
            return "Password not same";
        }

        // check if policy accepted
        if (typeof d["accept-policy"] === "undefined" || d["accept-policy"][0] != "accepted") {
            return "You must agree to terms and condition before continuing.";
        }

        return 0;
    }

    formOnSubmit(d) {
        console.log("sign up", d);
        var err = this.filterForm(d);

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
                d[User.ID] = res.data[User.ID];
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

    onConfirmClick() {
        this.setState((prevState) => {
            return { confirmed: true };
        });
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

        var user = this.state.user;
        // user = {
        //     "ID": 136,
        //     "first_name": "kakaka"
        // };

        if (this.state.confirmed) {
            window.scrollTo(0, 0);

            content = <div>
                <h3>Welcome {user[UserMeta.FIRST_NAME]} !  <i className="fa fa-smile-o"></i></h3>
                Your account has been successfully created<br></br>
                Please check your email (<b>{user[User.EMAIL]}</b>) for the activation link.
                <br></br>If you did not received any email, contact us at <b>innovaseedssolution@gmail.com</b>
                <br></br><small><i>** The email might take a few minutes to arrive **</i></small>
            </div>
        }
        else if (this.state.success) {
            window.scrollTo(0, 0);

            //scroll to top
            content = <div>
                <AvailabilityView for_sign_up={true} user_id={user[User.ID]} set_only={true}></AvailabilityView>
                <br></br>
                <button className="btn btn-success btn-lg" onClick={() => { this.onConfirmClick() }}>Confirm</button>
            </div>
        } else {
            content = <div>
                <h3>Student Registration<br></br></h3>
                <a target="_blank" href={`${LandingUrl}#Companies`}>Not A Student?</a>
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


