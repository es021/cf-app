import React, { Component } from "react";
//import { Redirect, NavLink } from 'react-router-dom';
import Form, { toggleSubmit, getDataCareerFair } from "../component/form";
import { UserMeta, User, UserEnum, CFSMeta } from "../../config/db-config";
//import { Month, Year, Sponsor, MasState, Country } from '../../config/data-config';
//import { ButtonLink } from '../component/buttons.jsx';
import { register, getCF, getCFObj, getCfCustomMeta, getNoMatrixLabel, isCfFeatureOff } from "../redux/actions/auth-actions";
import { RootPath, DocumentUrl, LandingUrl } from "../../config/app-config";
import AvailabilityView from "./availability";
import { getAxiosGraphQLQuery, graphql } from "../../helper/api-helper";
import obj2arg from "graphql-obj2arg";
import LoginPage from "./login";
import {
  getRegisterFormItem,
  TotalRegisterStep
} from "../../config/user-config";
import ManageUserProfile from "./partial/user/manage-user-profile";
import { AuthAPIErr } from "../../config/auth-config";
import { lang } from "../lib/lang";
import { Loader } from "../component/loader";

export const ErrorMessage = {
  ID_UTM_NOT_VALID: (id_utm) => {
    return <div>
      Sorry, we couldn't find your {getNoMatrixLabel()} (<b>{id_utm}</b>)! Email us at{" "}
      {/* <a href="mailto:azreen.nasir@talentcorp.com.my">azreen.nasir@talentcorp.com.my</a>, */}
      <a href="mailto:graduates@seedsjobfair.com">graduates@seedsjobfair.com</a>
      <br></br>
    </div>
  },
  ID_UTM_ALREADY_EXIST: (id_utm) => {
    return <div>
      {getNoMatrixLabel()} (<b>{id_utm}</b>) is already registered to other account in our system. Please login with the registered account to continue.
  </div>
  },
  JPA_OVER_LIMIT: () => {
    return <div>
      Sorry, this event has reached it's maximum capacity. Do reach out to{" "}
      {/* <a href="mailto:azreen.nasir@talentcorp.com.my">azreen.nasir@talentcorp.com.my</a>, */}
      <a href="mailto:jamilah.sabri@talentcorp.com.my,aina.ahsan@talentcorp.com.my">jamilah.sabri@talentcorp.com.my & aina.ahsan@talentcorp.com.my</a>
      <br></br>
    </div>
  },
  KPT_NOT_JPA: (kpt) => {
    return <div>
      Sorry, we couldn't find your IC (<b>{kpt}</b>)! Email us at{" "}
      {/* <a href="mailto:azreen.nasir@talentcorp.com.my">azreen.nasir@talentcorp.com.my</a>, */}
      <a href="mailto:jamilah.sabri@talentcorp.com.my,aina.ahsan@talentcorp.com.my">jamilah.sabri@talentcorp.com.my & aina.ahsan@talentcorp.com.my</a>
      <br></br>
    </div>
  },
  KPT_ALREADY_EXIST: (kpt) => {
    return <div>
      IC number (<b>{kpt}</b>) is already registered to other account in our system. Please login with the registered account to continue.
  </div>
  }
}

export default class SignUpPage extends React.Component {
  constructor(props) {
    super(props);
    this.formOnSubmit = this.formOnSubmit.bind(this);
    this.manageUserProfileComplete = this.manageUserProfileComplete.bind(this);
    this.userId = 0;
    this.state = {
      completed: false,
      confirmed: false,
      error: null,
      disableSubmit: false,
      success: false,
      user: null,
      currentStep: 1,
      loading: false,
      refData: {},
    };
  }
  manageUserProfileComplete() {
    this.setState({ completed: true });
  }
  componentWillMount() {
    this.CF = getCF();
    this.CFObj = getCFObj();

    if (!this.CFObj.can_register) {
      return;
    }

    this.defaultValues = {};
    this.defaultValues[User.CF] = this.CF;

    this.loadRef();
    //this.formItems = getRegisterFormItem(1);
  }

  loadRef() {
    var toLoad = 0;
    var loaded = 0;
    var refData = {};
    const finish = (k, data) => {
      loaded++;
      refData[k] = ["", ...data];
      if (loaded >= toLoad) {
        this.setState(prevState => {
          refData = { ...prevState.refData, ...refData };
          return { loading: false, refData: refData }
        });
      }
    }

    if (this.CF == "UTM21") {
      toLoad = 2;
      this.setState({ loading: true })
      graphql(`query { refs(table_name:"faculty_utm21"){ val } } `).then(res => {
        let vals = res.data.data.refs.map(d => d.val);
        finish("faculty_utm21", vals);
      })
      graphql(`query { refs(table_name:"level_study_utm21"){ val } } `).then(res => {
        let vals = res.data.data.refs.map(d => d.val);
        finish("level_study_utm21", vals);
      })
    }
  }


  //return string if there is error
  filterForm(d) {
    if (this.state.currentStep == 1) {
      //check if both password is same
      // if (d[User.PASSWORD] !== d[`${User.PASSWORD}-confirm`]) {
      //     return "Password not same";
      // }

      // check if policy accepted
      if (
        typeof d["accept-policy"] === "undefined" ||
        d["accept-policy"][0] != "accepted"
      ) {
        return lang("You must agree to terms and condition before continuing.");
      }

      if (
        typeof d["accept-send-sms"] === "undefined" ||
        d["accept-send-sms"][0] != "accepted"
      ) {
        return lang("You must agree to receive important notifications via SMS or WhatsApp messages");
      }
    }

    return 0;
  }

  // @kpt_validation
  getKptErrorValidation(kpt) {
    if (kpt.length != 12) {
      return <div>{lang("Please enter 12 digit only.")}</div>
    }
    return false;
  }


  // @id_utm_validation
  getIdUtmErrorValidation(id_utm) {
    // if (id_utm.length != 12) {
    //   return <div>{lang("Please enter 12 digit only.")}</div>
    // }
    return false;
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

        // @kpt_validation - validate ic number
        if (d[UserMeta.KPT]) {
          let ERR_KPT = <span>IC number (<b>{d[UserMeta.KPT]}</b>) is invalid.</span>;
          try {
            let kpt = d[UserMeta.KPT] + "";
            kpt = kpt.replaceAll("-", "");
            kpt = kpt.replaceAll(" ", "");
            let errorValidation = this.getKptErrorValidation(kpt);
            if (errorValidation !== false) {
              toggleSubmit(this, {
                error: <div>
                  {ERR_KPT}<br></br>
                  {errorValidation}
                </div>
              });
              return;

            } else {
              d[UserMeta.KPT] = kpt;
            }

          } catch (err) {
            toggleSubmit(this, { error: ERR_KPT });
            return;
          }
        } else {
          d[UserMeta.KPT] = "";
        }


        // @id_utm_validation - validate fe
        if (d[UserMeta.ID_UTM]) {
          let ERR_ = <span>{getNoMatrixLabel()} (<b>{d[UserMeta.ID_UTM]}</b>) is invalid.</span>;
          try {
            let v = d[UserMeta.ID_UTM] + "";
            v = v.replaceAll(" ", "");
            let errorValidation = this.getIdUtmErrorValidation(v);
            if (errorValidation !== false) {
              toggleSubmit(this, {
                error: <div>
                  {ERR_}<br></br>
                  {errorValidation}
                </div>
              });
              return;
            } else {
              d[UserMeta.ID_UTM] = v;
            }
          } catch (err) {
            toggleSubmit(this, { error: ERR_ });
            return;
          }
        } else {
          d[UserMeta.ID_UTM] = "";
        }


        //prepare data for registration
        d[User.LOGIN] = d[User.EMAIL];

        // get default cf from
        d[User.CF] = this.CF;
        d[UserMeta.USER_STATUS] = UserEnum.STATUS_NOT_ACT;

        // Step 1 - Basic Info go to registration
        // cf is set in this function
        register(d).then(
          res => {
            this.userId = res.data[User.ID];
            console.log(res.data);
            d[User.ID] = res.data[User.ID];
            // toggleSubmit(this, { user: d, success: true });
            this.setState(prevState => {
              let newState = {
                user: d,
                currentStep: prevState.currentStep + 1,
                error: null,
                disableSubmit: !prevState.disableSubmit,
                success: true
              };
              return newState;
            });
          },
          err => {
            let errorMsg = err.response.data;

            // @kpt_validation - KPT_ALREADY_EXIST
            if (errorMsg == AuthAPIErr.KPT_ALREADY_EXIST) {
              errorMsg = ErrorMessage.KPT_ALREADY_EXIST(d[UserMeta.KPT]);
            }
            // @kpt_validation - KPT_NOT_JPA
            else if (errorMsg == AuthAPIErr.KPT_NOT_JPA) {
              errorMsg = ErrorMessage.KPT_NOT_JPA(d[UserMeta.KPT]);
            }
            // @kpt_validation - JPA_OVER_LIMIT
            else if (errorMsg == AuthAPIErr.JPA_OVER_LIMIT) {
              errorMsg = ErrorMessage.JPA_OVER_LIMIT();
            }


            // @id_utm_validation - ID_UTM_ALREADY_EXIST
            if (errorMsg == AuthAPIErr.ID_UTM_ALREADY_EXIST) {
              errorMsg = ErrorMessage.ID_UTM_ALREADY_EXIST(d[UserMeta.ID_UTM]);
            }

            // @id_utm_validation - ID_UTM_NOT_VALID
            if (errorMsg == AuthAPIErr.ID_UTM_NOT_VALID) {
              errorMsg = ErrorMessage.ID_UTM_NOT_VALID(d[UserMeta.ID_UTM]);
            }

            if(errorMsg == AuthAPIErr.USERNAME_EXIST){
              console.log("login trus?")
            }

            toggleSubmit(this, { error: errorMsg });

          }
        );
      }

      // update user
      if (this.state.currentStep > 1) {
        //prepare data for edit
        var update = d;
        d[User.ID] = this.userId;
        var edit_query = `mutation{edit_user(${obj2arg(update, {
          noOuterBraces: true
        })}) {ID}}`;
        getAxiosGraphQLQuery(edit_query).then(
          res => {
            this.setState(prevState => {
              let newState = {
                currentStep: prevState.currentStep + 1,
                error: null,
                disableSubmit: false,
                confirmed: true
              };
              return newState;
            });
          },
          err => {
            toggleSubmit(this, { error: err.response.data });
          }
        );
      }
    } else {
      //console.log("Err", err);
      this.setState(() => {
        return { error: err };
      });
    }
  }

  onConfirmClick() {
    this.setState(prevState => {
      return { confirmed: true };
    });
  }

  // getPostRegisterViewOld(user) {
  //     let content = null;
  //     let formItems = getRegisterFormItem(this.state.currentStep);
  //     let completeView = this.state.currentStep > TotalRegisterStep
  //         ?
  //         <div>
  //             <h3>Congratulation! You Have Completed Your Profile</h3>
  //             <LoginPage defaultLogin={user[User.EMAIL]} title={<h4>Login Now</h4>}></LoginPage>
  //         </div>
  //         :
  //         <div>
  //             <h3>Complete Your Profile - Step {this.state.currentStep} out of {TotalRegisterStep}</h3>
  //             <Form className="form-row"
  //                 items={formItems}
  //                 onSubmit={this.formOnSubmit}
  //                 defaultValues={{}}
  //                 submitText='Submit'
  //                 disableSubmit={this.state.disableSubmit}
  //                 error={this.state.error}>
  //             </Form>
  //         </div>

  //     content = <div>
  //         <h3>Welcome {user[UserMeta.FIRST_NAME]} !  <i className="fa fa-smile-o"></i></h3>
  //         Your account has been successfully created<br></br>
  //         Don't forget to <b>upload your resume</b> when you are logged in!<br></br>
  //         You can do it at <b>Upload Document</b>
  //         {/* Please check your email (<b>{user[User.EMAIL]}</b>) for the activation link.
  //             <br></br>If you did not received any email, contact us at <b>innovaseedssolutions@gmail.com</b>
  //             <br></br><small><i>** The email might take a few minutes to arrive **</i></small> */}
  //         {completeView}
  //     </div>
  //     return content;
  // }
  getPostRegisterView(user) {
    return (
      <div
        style={{
          textAlign: "left",
          maxWidth: "900px",
          margin: "auto",
          padding: "10px"
        }}
      >
        <h1>
          {lang("Welcome")} {user[UserMeta.FIRST_NAME]} !<br></br>
          <small>
            {lang("Let's complete your profile and get you noticed by recruiters!")}
          </small>
        </h1>
        <div style={{ marginTop: "20vh" }}></div>
        <ManageUserProfile
          completeHandler={this.manageUserProfileComplete}
          user_id={user.ID}
          contentBeforeSubmit={this.getDisclaimerView()}
        ></ManageUserProfile>
      </div>
    );
  }

  getDisclaimerView() {
    let disclaimerView = null;
    let disclaimer = getCfCustomMeta(CFSMeta.TEXT_REGISTRATION_DISCLAIMER, "");
    if (disclaimer) {
      disclaimerView = <div style={{
        // marginTop: "-140px",
        marginBottom: "20px",
        textAlign: "justify"
      }}
        dangerouslySetInnerHTML={{ __html: disclaimer }}>
      </div>;
    }
    return disclaimerView;

  }
  render() {
    document.setTitle(lang("Sign Up"));

    if (!this.CFObj.can_register) {
      return (
        <div>
          <h3>
            Registration for
            <br></br>
            <b>{this.CFObj.title}</b>
            <br></br>has been closed.
            <br></br>
          </h3>
        </div>
      );
    }

    var content = null;

    var user = this.state.user;

    // debug
    const DEBUG_NEW_SIGN_UP = false;
    const DEBUG_COMPLETED = false;
    const IS_DEBUG = DEBUG_NEW_SIGN_UP || DEBUG_COMPLETED;
    if (IS_DEBUG) {
      user = {
        ID: 886,
        first_name: "Wan Zul",
        user_email: "test.student@gmail.com"
      };
    }

    if (this.state.completed || DEBUG_COMPLETED) {
      return (
        <div>
          <h3>{lang("Congratulation! You Have Completed Your Profile")}</h3>
          <LoginPage
            defaultLogin={user[User.EMAIL]}
            title={<h4>{lang("Login Now")}</h4>}
          ></LoginPage>
        </div>
      );
    }

    if (this.state.success || DEBUG_NEW_SIGN_UP) {
      window.scrollTo(0, 0);
      content = this.getPostRegisterView(user);
    } else {
      let registrationTitle = this.CFObj[CFSMeta.TEXT_REGISTRATION_TITLE];
      if (!registrationTitle) {
        registrationTitle = "Student Registration";
      }

      // @kpt_validation
      let formItems = getRegisterFormItem(1, getCF(), this.state.refData);

      content = (
        <div>
          <h3>
            {lang(registrationTitle)}<br></br>
          </h3>
          {this.state.loading
            ? <Loader></Loader>
            : isCfFeatureOff(CFSMeta.FEATURE_STUDENT_REGISTER)
              ? <div>{lang("We are sorry. Registration for this event is currently closed.")}</div>
              : <Form
                className="form-row"
                items={formItems}
                onSubmit={this.formOnSubmit}
                defaultValues={this.defaultValues}
                submitText={lang("Sign Me Up!")}
                disableSubmit={this.state.disableSubmit}
                contentBeforeSubmit={null}
                error={this.state.error}
              ></Form>
          }
        </div>
      );
    }

    return content;
  }
}
