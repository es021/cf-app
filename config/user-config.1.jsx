import React, { Component } from 'react';

import {
    User,
    UserMeta,
    UserEnum
} from './db-config';
import { ButtonLink } from '../app/component/buttons.jsx';
import { getDataCareerFair } from '../app/component/form';
import { DocumentUrl } from './app-config';
import { Month, Year, Sponsor, MasState, Country } from './data-config';

export const UserFormItem = [
    { header: "Select Career Fair" },
    {
        name: User.CF,
        type: "radio",
        data: getDataCareerFair("register"),
        required: true
    },
    {
        header: "Basic Information",
    },
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
    // {
    //     label: "Gender",
    //     name: UserMeta.GENDER,
    //     type: "select",
    //     data: ["", UserEnum.GENDER_MALE, UserEnum.GENDER_FEMALE],
    //     required: true
    // },
    { header: "Where Do You Reside In Malaysia?" },
    {
        label: "State",
        name: UserMeta.MAS_STATE,
        type: "select",
        data: MasState,
        required: true
    },
    // {
    //     label: "Postcode",
    //     name: UserMeta.MAS_POSTCODE,
    //     type: "text",
    //     required: true,
    //     placeholder: "20050"
    // },
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
        required: false,
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
    // {
    //     label: "Work Availability Date",
    //     sublabel: "Select 'Available To Start Anytime' for both field below if you are ready to work anytime.",
    //     name: UserMeta.AVAILABLE_MONTH,
    //     type: "select",
    //     data: Array(...Month),
    //     required: true

    // },
    // {
    //     label: null,
    //     name: UserMeta.AVAILABLE_YEAR,
    //     type: "select",
    //     data: Array(...Year),
    //     required: true
    // },
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
        required: false,
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
