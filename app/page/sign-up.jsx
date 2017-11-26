import React, { Component } from 'react';
import { Redirect} from 'react-router-dom';
import Form from '../component/form';
import {UserMeta, User}  from '../../config/db-config';
import {Month, Year, Sponsor} from '../../config/data-config';
import {ButtonLink} from '../component/buttons';

export default class SignUpPage extends React.Component {
    constructor(props) {
        super(props);
        this.formOnSubmit = this.formOnSubmit.bind(this);
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
            console.log("okay");
        } else {
            console.log(err);
            console.log("duhhh");
        }
        //this.props.login(data.email, data.password);
    }

    render() {
        // return (<Redirect to={from}/>);
        return (<div>
            <h3>Sign Up</h3>
        
            <Form className="form-row" 
                  items={this.formItems} 
                  disableSubmit={false} 
                  onSubmit={this.formOnSubmit}
                  submitText='Sign Me Up !'>
            </Form>
        </div>);
    }
}


