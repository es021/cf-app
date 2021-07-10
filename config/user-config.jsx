import React, { Component } from 'react';

import {
    User,
    UserMeta,
    UserEnum
} from './db-config';
import { ButtonLink } from '../app/component/buttons.jsx';
import { getDataCareerFair } from '../app/component/form';
import { DocumentUrl, getTermsAndConditionUrl } from './app-config';
import { Month, Year, Sponsor, MasState, Country, StudyField, DegreeLevel } from './data-config';
import registrationConfig, { RequiredFieldStudent, RequiredFieldRecruiter } from './registration-config';
import { lang } from '../app/lib/lang';
import { getCF, getNoMatrixLabel } from '../app/redux/actions/auth-actions';
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
        header: lang("Basic Information"),
        register: 1, editStudent: 1, editRec: 1
    },
    {
        // @kpt_validation
        label: lang("IC Number"),
        name: UserMeta.KPT,
        type: "number",
        placeholder: "XXXXXXXXXX",
        //required: true,
        isOnlyInCf: (cf) => {
            return registrationConfig.isDoJpaKptValidation(cf)
        },
        register: 1, editStudent: 0, editRec: 0
    },
    {
        // @id_utm_validation
        label: lang(getNoMatrixLabel()),
        name: UserMeta.ID_UTM,
        type: "text",
        placeholder: "",
        //required: true,
        isOnlyInCf: (cf) => {
            return registrationConfig.isDoIdUtmValidation(cf)
        },
        register: 1, editStudent: 0, editRec: 0
    },
    {
        label: lang("First Name"),
        name: UserMeta.FIRST_NAME,
        type: "text",
        placeholder: "John",
        //required: true,
        register: 1, editStudent: 0, editRec: 0
    },
    {
        label: lang("Last Name"),
        name: UserMeta.LAST_NAME,
        type: "text",
        placeholder: "Doe",
        //required: true,
        register: 1, editStudent: 0, editRec: 0
    }, {
        label: lang("Email"),
        name: User.EMAIL,
        type: "email",
        placeholder: "john.doe@gmail.com",
        //required: true,
        register: 1, editStudent: 0, editRec: 0
    }, {
        label: lang("Password"),
        name: User.PASSWORD,
        type: "password",
        placeholder: "*****",
        //required: true,
        register: 1, editStudent: 0, editRec: 0
    },
    {
        label: lang("Phone Number"),
        name: UserMeta.PHONE_NUMBER,
        type: "phone_number",
        placeholder: "XXXXXXXXXX",
        //required: true,
        register: 1, editStudent: 0, editRec: 0
    },
    {
        label: lang("Level Of Study"),
        name: "level_study_utm21",
        type: "select",
        data: [],
        isOnlyInCf: (cf) => {
            return cf == "UTM21"
        },
        register: 1, editStudent: 0, editRec: 0
    },
    {
        label: lang("Faculty"),
        name: "faculty_utm21",
        type: "select",
        data: [],
        isOnlyInCf: (cf) => {
            return cf == "UTM21"
        },
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
        label: lang("Position"),
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
        label: lang("Phone Number"),
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
            label: <small>{lang("I agree to")} <a href={getTermsAndConditionUrl(getCF())} target="_blank">{lang("terms and conditions")}</a></small>
        }],
        //required: true,,
        register: 1, editStudent: 0, editRec: 0
    }, {
        label: null,
        name: "accept-send-sms",
        type: "checkbox",
        data: [{
            key: "accepted",
            label: <small>I agree to receive important notifications via SMS or WhatsApp messages</small>
        }],
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

export function getRegisterFormItem(registerStep, cf, refData = {}) {
    let toRet = [];

    for (var i in UserFormItem) {
        let item = UserFormItem[i];
        item = setAdditionalAttribute(item);

        if (item.type == "select" && refData[item.name]) {
            item.data = refData[item.name];
        }

        // @kpt_validation
        if (item.isOnlyInCf) {
            if (!item.isOnlyInCf(cf)) {
                continue;
            }
        }

        if (item.register == registerStep) {
            toRet.push(item);
        }
    }

    return toRet;
}