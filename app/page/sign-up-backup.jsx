import React, { Component } from 'react';
//import { Redirect, NavLink } from 'react-router-dom';
import Form, { toggleSubmit, getDataCareerFair } from '../component/form';
import { UserMeta, User, UserEnum } from '../../config/db-config';
//import { Month, Year, Sponsor, MasState, Country } from '../../config/data-config';
//import { ButtonLink } from '../component/buttons.jsx';
import { register, getCF, getCFObj } from '../redux/actions/auth-actions';
import { RootPath, DocumentUrl, LandingUrl } from '../../config/app-config';
import AvailabilityView from './availability';
import { getAxiosGraphQLQuery } from '../../helper/api-helper';
import obj2arg from 'graphql-obj2arg';
import LoginPage from './login';

import { getRegisterFormItem, TotalRegisterStep } from '../../config/user-config';

export default class SignUpPage extends React.Component {
    constructor(props) {
        super(props);
        this.formOnSubmit = this.formOnSubmit.bind(this);
        this.userId = 0;
        this.state = {
            confirmed: false,
            error: null,
            disableSubmit: false,
            success: false,
            user: null,
            currentStep: 1,
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

        //this.formItems = getRegisterFormItem(1);
    }

    //return string if there is error
    filterForm(d) {

        if (this.state.currentStep == 1) {
            //check if both password is same
            // if (d[User.PASSWORD] !== d[`${User.PASSWORD}-confirm`]) {
            //     return "Password not same";
            // }

            // check if policy accepted
            if (typeof d["accept-policy"] === "undefined" || d["accept-policy"][0] != "accepted") {
                return "You must agree to terms and condition before continuing.";
            }
        }

        return 0;
    }

    formOnSubmit(d) {
        console.log("sign up", d);
        var err = this.filterForm(d);

        if (err === 0) {
            toggleSubmit(this, { error: null });
            if (typeof d[UserMeta.MAJOR] !== "undefined") {
                d[UserMeta.MAJOR] = JSON.stringify(d[UserMeta.MAJOR]);
            }
            if (typeof d[UserMeta.MINOR] !== "undefined") {
                d[UserMeta.MINOR] = JSON.stringify(d[UserMeta.MINOR]);
            }
            // if (update[UserMeta.CGPA] == "") {
            //     update[UserMeta.CGPA] = 0;
            // }

            if (this.state.currentStep == 1) {
                //prepare data for registration
                d[User.LOGIN] = d[User.EMAIL];
                // get default cf from
                d[User.CF] = this.CF;
                d[UserMeta.USER_STATUS] = UserEnum.STATUS_NOT_ACT;

                // Step 1 - Basic Info go to registration
                // cf is set in this function
                register(d).then((res) => {
                    this.userId = res.data[User.ID];
                    console.log(res.data);
                    d[User.ID] = res.data[User.ID];
                    // toggleSubmit(this, { user: d, success: true });
                    this.setState((prevState) => {
                        let newState = {
                            user: d
                            , currentStep: prevState.currentStep + 1
                            , error: null
                            , disableSubmit: !prevState.disableSubmit
                            , success: true
                        }
                        return newState;
                    });
                }, (err) => {
                    toggleSubmit(this, { error: err.response.data });
                });
            }

            // update user
            if (this.state.currentStep > 1) {
                //prepare data for edit
                var update = d;
                d[User.ID] = this.userId;
                var edit_query = `mutation{edit_user(${obj2arg(update, { noOuterBraces: true })}) {ID}}`;
                getAxiosGraphQLQuery(edit_query).then((res) => {
                    this.setState((prevState) => {
                        let newState = {
                            currentStep: prevState.currentStep + 1
                            , error: null
                            , disableSubmit: false
                            , confirmed: true
                        }
                        return newState;
                    });
                }, (err) => {
                    toggleSubmit(this, { error: err.response.data });
                });
            }

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

        //if (this.state.confirmed) {
        if (this.state.success) {
            window.scrollTo(0, 0);
            let formItems = getRegisterFormItem(this.state.currentStep);
            // console.log(formItems);
            // console.log("current step", this.state.currentStep);
            // console.log("this.state.disableSubmit", this.state.disableSubmit);

            let completeView = this.state.currentStep > TotalRegisterStep
                ?
                <div>
                    <h3>Congratulation! You Have Completed Your Profile</h3>
                    <LoginPage defaultLogin={user[User.EMAIL]} title={<h4>Login Now</h4>}></LoginPage>
                </div>
                :
                <div>
                    <h3>Complete Your Profile - Step {this.state.currentStep} out of {TotalRegisterStep}</h3>
                    <Form className="form-row"
                        items={formItems}
                        onSubmit={this.formOnSubmit}
                        defaultValues={{}}
                        submitText='Submit'
                        disableSubmit={this.state.disableSubmit}
                        error={this.state.error}>
                    </Form>
                </div>

            content = <div>
                <h3>Welcome {user[UserMeta.FIRST_NAME]} !  <i className="fa fa-smile-o"></i></h3>
                Your account has been successfully created<br></br>
                Don't forget to <b>upload your resume</b> when you are logged in!<br></br>
                You can do it at <b>Upload Document</b>
                {/* Please check your email (<b>{user[User.EMAIL]}</b>) for the activation link.
                <br></br>If you did not received any email, contact us at <b>innovaseedssolutions@gmail.com</b>
                <br></br><small><i>** The email might take a few minutes to arrive **</i></small> */}
                {completeView}
            </div>
        }
        // else if (this.state.success) {
        //     window.scrollTo(0, 0);

        //     //scroll to top
        //     content = <div>
        //         <AvailabilityView for_sign_up={true} user_id={user[User.ID]} set_only={true}></AvailabilityView>
        //         <br></br>
        //         <button className="btn btn-success btn-lg" onClick={() => { this.onConfirmClick() }}>Confirm</button>
        //     </div>
        // } 
        else {
            let formItems = getRegisterFormItem(1);
            content = <div>
                <h3>Student Registration<br></br></h3>
                <a target="_blank" href={`${LandingUrl}#Companies`}>Not A Student?</a>
                <Form className="form-row"
                    items={formItems}
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


