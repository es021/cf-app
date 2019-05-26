import React, { Component } from 'react';

import {
    User,
    UserMeta,
    UserEnum
} from './db-config';
import { ButtonLink } from '../app/component/buttons.jsx';
import { getDataCareerFair } from '../app/component/form';
import { DocumentUrl } from './app-config';
import { Month, Year, Sponsor, MasState, Country , StudyField, DegreeLevel} from './data-config';
import { RequiredFieldStudent, RequiredFieldRecruiter } from './registration-config';
export const TotalRegisterStep = 3;



export const UserFormItem = [
    // {
    //     header: "Select Career Fair",
    //     register: 1, editStudent: 0, editRec: 0
    // },
    // {
    //     name: User.CF,
    //     type: "radio",
    //     data: getDataCareerFair("register"),
    //     hidden:false,
    //     //required: true,
    //     register: 1, editStudent: 0, editRec: 0
    // },
    {
        header: "Basic Information",
        register: 1, editStudent: 1, editRec: 1
    }, {
        label: "First Name",
        name: UserMeta.FIRST_NAME,
        type: "text",
        placeholder: "John",
        //required: true,
        register: 1, editStudent: 1, editRec: 1
    }, {
        label: "Last Name",
        name: UserMeta.LAST_NAME,
        type: "text",
        placeholder: "Doe",
        //required: true,
        register: 1, editStudent: 1, editRec: 1
    }, {
        label: "Email",
        name: User.EMAIL,
        type: "email",
        placeholder: "john.doe@gmail.com",
        //required: true,
        register: 1, editStudent: 0, editRec: 0
    }, {
        label: "Password",
        name: User.PASSWORD,
        type: "password",
        placeholder: "*****",
        //required: true,
        register: 1, editStudent: 0, editRec: 0
    }, 
    // {
    //     label: "Confirm Password",
    //     name: `${User.PASSWORD}-confirm`,
    //     type: "password",
    //     placeholder: "*****",
    //     //required: true,
    //     register: 1, editStudent: 0, editRec: 0
    // }, 
    {
        label: "Position",
        name: UserMeta.REC_POSITION,
        type: "text",
        placeholder: "HR Manager",
        register: 0, editStudent: 0, editRec: 1
    }, 
    {
        header: "A Little More About Yourself",
        register: 2, editStudent: 0, editRec: 0
    },
    {
        label: "Phone Number",
        name: UserMeta.PHONE_NUMBER,
        type: "text",
        placeholder: "XXX-XXXXXXX",
        //required: true,
        register: 2, editStudent: 1, editRec: 0
    },
    // {
    //     label: "Gender",
    //     name: UserMeta.GENDER,
    //     type: "select",
    //     data: ["", UserEnum.GENDER_MALE, UserEnum.GENDER_FEMALE],
    //     //required: true,
    // register:1, editStudent: 1, editRec: 0 },
    {
        header: "Where Do You Reside In Malaysia?",
        register: 2, editStudent: 1, editRec: 0
    },
    {
        label: "State",
        name: UserMeta.MAS_STATE,
        type: "select",
        data: MasState,
        //required: true,
        register: 2, editStudent: 1, editRec: 0
    },
    // {
    //     label: "Postcode",
    //     name: UserMeta.MAS_POSTCODE,
    //     type: "text",
    //     //required: true,,
    //     placeholder: "20050"
    // register:1, editStudent: 1, editRec: 1 },
    {
        header: "Degree Related Information",
        register: 2, editStudent: 1, editRec: 0
    },
    {
        label: "Degree Level",
        name: UserMeta.DEGREE_LEVEL,
        type: "select",
        data: DegreeLevel,
        //required: true,
        register: 2, editStudent: 1, editRec: 0
    },
    {
        label: "Field Of Study",
        name: UserMeta.STUDY_FIELD,
        type: "select",
        data: StudyField,
        //required: true,
        register: 2, editStudent: 1, editRec: 0
    },
    {
        label: "Major",
        name: UserMeta.MAJOR,
        type: "text",
        multiple: true,
        //required: true,
        register: 2, editStudent: 1, editRec: 0
    }, {
        label: "Minor",
        name: UserMeta.MINOR,
        type: "text",
        multiple: true,
        //required: false,
        register: 2, editStudent: 1, editRec: 0
    }, {
        label: "University",
        name: UserMeta.UNIVERSITY,
        type: "text",
        //required: true,
        register: 2, editStudent: 1, editRec: 0
    },
    {
        label: "Where Is Your University Located?",
        name: UserMeta.STUDY_PLACE,
        type: "select",
        data: Country,
        //required: true,
        register: 2, editStudent: 1, editRec: 0
    },
    {
        label: "Current Grade",
        name: UserMeta.CGPA,
        type: "text",
        //step: "0.01",
        //min: "0",
        //required: false,
        sublabel: "Based On Your Grading System",
        // sublabel: <ButtonLink label="Don't Use CGPA system?"
        //     target='_blank'
        //     href="https://www.foreigncredits.com/resources/gpa-calculator/">
        // </ButtonLink>
        register: 2, editStudent: 1, editRec: 0
    }, {
        label: "Expected Graduation",
        name: UserMeta.GRADUATION_MONTH,
        type: "select",
        data: Month,
        //required: true,,
        register: 2, editStudent: 1, editRec: 0
    }, {
        label: null,
        name: UserMeta.GRADUATION_YEAR,
        type: "select",
        data: Year,
        //required: true,,
        register: 2, editStudent: 1, editRec: 0
    },
    {
        header: "Future Employment Information",
        register: 3, editStudent: 1, editRec: 0
    },
    {
        label: "Looking For",
        name: UserMeta.LOOKING_FOR,
        type: "select",
        data: ["", UserEnum.LOOK_FOR_FULL_TIME, UserEnum.LOOK_FOR_INTERN],
        //required: true,
        register: 3, editStudent: 1, editRec: 0
    },
    {
        label: "Work Availability Date",
        //sublabel: "Select 'Available To Start Anytime' for both field below if you are ready to work anytime.",
        name: UserMeta.AVAILABLE_MONTH,
        type: "select",
        data: Array(...Month),
        //required: true,
        register: 3, editStudent: 1, editRec: 0
    },
    {
        label: null,
        name: UserMeta.AVAILABLE_YEAR,
        type: "select",
        data: Array(...Year),
        //required: true,
        register: 3, editStudent: 1, editRec: 0
    },
    // {
    //     label: "Are You Willing To Relocate?",
    //     name: UserMeta.RELOCATE,
    //     type: "select",
    //     data: Array("", "Yes", "No"),
    //     //required: true,
    //     register: 3, editStudent: 1, editRec: 0
    // },
    {
        header: "Additional Information",
        register: 3, editStudent: 1, editRec: 0
    },
    {
        label: "Sponsor",
        name: UserMeta.SPONSOR,
        type: "select",
        data: Sponsor,
        //required: false,
        sublabel: "This information will not be displayed in your profile.",
        register: 3, editStudent: 1, editRec: 0
    }, {
        label: "Description",
        name: UserMeta.DESCRIPTION,
        type: "textarea",
        placeholder: "Tell More About Yourself",
        //required: false,
        rows: 5,
        register: 3, editStudent: 1, editRec: 0
    }, {
        label: null,
        name: "accept-policy",
        type: "checkbox",
        data: [{
            key: "accepted",
            label: <small>I agree to <a href={`${DocumentUrl}/privacy-policy.pdf`} target="_blank">terms and conditions</a></small>
        }],
        //required: true,,
        register: 1, editStudent: 0, editRec: 0
    }
];


function setAdditionalAttribute(item) {
    if (typeof item.name !== "undefined") {
        if (RequiredFieldStudent.indexOf(item.name) >= 0 ||
            RequiredFieldRecruiter.indexOf(item.name) >= 0) {
            item.required = true;
        } else {
            item.required = false;
        }
    }

    return item
}

// used to check if profile dah complete ke belum
export function getRequiredStudentInfo() {
    let arr = [];

    for (var i in UserFormItem) {
        let item = UserFormItem[i]
        item = setAdditionalAttribute(item);
        if (item.register == 1 && item.required == true) {
            arr.push(item.name);
        }
    }

    return arr;
}

export function getEditProfileFormItem(type) {
    let toRet = [];

    for (var i in UserFormItem) {
        let item = UserFormItem[i];
        item = setAdditionalAttribute(item);

        if (type == UserEnum.ROLE_STUDENT &&
            item.editStudent == 1) {
            toRet.push(item);
        }

        if (type == UserEnum.ROLE_RECRUITER &&
            item.editRec == 1) {
            toRet.push(item);
        }
    }

    return toRet;
}

export function getRegisterFormItem(registerStep) {
    let toRet = [];

    for (var i in UserFormItem) {
        let item = UserFormItem[i];
        item = setAdditionalAttribute(item);

        if (item.register == registerStep) {
            toRet.push(item);
        }
    }

    return toRet;
}