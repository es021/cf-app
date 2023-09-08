import React, { Component } from "react";
//import { Redirect, NavLink } from 'react-router-dom';
import Form, { toggleSubmit, checkDiff } from "../component/form";
import {
  UserMeta,
  User,
  UserEnum,
  Skill,
  DocLink,
  DocLinkEnum,
  VideoEnum
} from "../../config/db-config";
//import { Month, Year, Sponsor, MasState, Country } from '../../config/data-config';
//import { ButtonLink } from '../component/buttons.jsx';
import { getAxiosGraphQLQuery, graphql } from "../../helper/api-helper";
import obj2arg from "graphql-obj2arg";
import {
  getAuthUser,
  isRoleRec,
  isRoleStudent,
  updateAuthUser
} from "../redux/actions/auth-actions";
import { Loader } from "../component/loader";
import ProfileCard from "../component/profile-card.jsx";
import SubNav from "../component/sub-nav";
import { CustomList } from "../component/list";
import * as layoutActions from "../redux/actions/layout-actions";
import ConfirmPopup from "./partial/popup/confirm-popup";
import UserPopup from "./partial/popup/user-popup";
//import { store } from '../redux/store';
import DocLinkPage from "../component/doc-link-form.jsx";
//import { SimpleListItem } from '../component/list';
import PasswordResetPage from "./password-reset";
import AvailabilityView from "./availability";
import { getEditProfileFormItem } from "../../config/user-config";
import LogoutPage from "../page/logout";
import ManageUserProfile from "./partial/user/manage-user-profile";
import UploaderVideo from "../component/uploader-video";
import { createVideoDropbox } from "./partial/popup/user-popup";
import { lang } from "../lib/lang";

class StudentVideoResume extends React.Component {
  constructor(props) {
    super(props);
    this.userId = getAuthUser().ID;
    this.state = {
      loading: false,
      video_resume: null
    };
  }

  componentWillMount() {
    this.loadData();
  }

  loadData() {
    this.setState({ loading: true });
    let q = `
        query{ video(entity:"user", entity_id:${this.userId}, meta_key:"resume"){
          ID 
          url
        } 
      }
    `;

    graphql(q).then(res => {
      this.setState({ loading: false, video_resume: res.data.data.video });
    });
  }

  render() {
    let v = null;
    if (this.state.loading) {
      v = <Loader></Loader>;
    } else {
      v = (
        <div>
          <div style={{ margin: "auto", width: "400px" }}>
            {this.state.video_resume && this.state.video_resume.url
              ? [
                createVideoDropbox(this.state.video_resume.url),
                <br />,
                <br />,
                <br />
              ]
              : null}
          </div>

          <UploaderVideo
            name={"video-resume"}
            label={"Upload New Video"}
            entity={"user"}
            entity_id={this.userId}
            meta_key={VideoEnum.RESUME}
          ></UploaderVideo>

          {/* <div>
            <ol className={"text-left"}>
              <li>
                Rename your video to the following name <br></br>
                <b>VideoResume{getAuthUser().ID}</b>
              </li>
              <li>
                Submit the video to our Dropbox using the following link:
                <iframe src="https://www.dropbox.com/request/Unn9GMYGzTpqgteDSR4d"></iframe>
                <br></br>
                <a
                  className="btn btn-blue"
                  target="_blank"
                  href="https://www.dropbox.com/request/Unn9GMYGzTpqgteDSR4d"
                >
                  Submit VIdeo 
                </a>
              </li>
            </ol>
          </div> */}
        </div>
      );
    }

    return (
      <div className={"text-center"}>
        <h2>Video Resume</h2>
        {v}
      </div>
    );
  }
}

class StudentDocLink extends React.Component {
  render() {
    return <DocLinkPage entity="user" id={getAuthUser().ID}></DocLinkPage>;
  }
}

class Skills extends React.Component {
  constructor(props) {
    super(props);
    this.formOnSubmit = this.formOnSubmit.bind(this);
    this.state = {
      error: null,
      disableSubmit: false,
      success: null,
      loading: true,
      skills: [],
      loadingDelete: false
    };
  }

  loadSkills() {
    var query = `query{user(ID:${getAuthUser().ID}){skills{ID label}}}`;
    getAxiosGraphQLQuery(query).then(res => {
      this.setState(prevState => {
        return { skills: res.data.data.user.skills, loading: false };
      });
    });
  }

  componentWillMount() {
    this.loadSkills();
    this.formItems = [
      {
        name: Skill.LABEL,
        type: "text",
        placeholder: "Web Development",
        required: true
      }
    ];
  }

  formOnSubmit(d) {
    var ins = {
      user_id: getAuthUser().ID,
      label: d.label
    };
    toggleSubmit(this, { error: null, success: null });
    var edit_query = `mutation{add_skill(${obj2arg(ins, {
      noOuterBraces: true
    })}) {ID label}}`;
    getAxiosGraphQLQuery(edit_query).then(
      res => {
        var prevSkill = this.state.skills;
        prevSkill.unshift(res.data.data.add_skill);
        toggleSubmit(this, {
          error: null,
          skill: prevSkill,
          success: "Successfully Added New Skill"
        });
      },
      err => {
        toggleSubmit(this, { error: err.response.data });
      }
    );
  }

  onOperationSuccess() {
    layoutActions.storeHideFocusCard();
    this.loadSkills();
  }

  deletePopup(e) {
    var id = e.currentTarget.id;
    const onYes = () => {
      var del_query = `mutation{delete_skill(ID:${id})}`;
      layoutActions.storeUpdateProps({ loading: true });
      getAxiosGraphQLQuery(del_query).then(
        res => {
          this.onOperationSuccess();
        },
        err => {
          alert(err.response.data);
        }
      );
    };
    var value = e.currentTarget.attributes.getNamedItem("label").value;
    layoutActions.storeUpdateFocusCard(
      "Confirm Delete Item",
      ConfirmPopup,
      { title: `Continue delete skill '${value}'?`, onYes: onYes },
      "small"
    );
  }

  render() {
    var view = null;
    var skills = this.state.loading ? (
      <Loader size="2" text="Loading skills.."></Loader>
    ) : (
      <div className="text-muted">{lang("Nothing To Show Here")}</div>
    );
    if (!this.state.loading && this.state.skills.length > 0) {
      var skillItems = this.state.skills.map((d, i) => {
        return (
          <span>
            {`${d.label} `}
            <span
              className="badge"
              id={d.ID}
              label={d.label}
              onClick={this.deletePopup.bind(this)}
            >
              X
            </span>
          </span>
        );
      });
      skills = <CustomList className="label" items={skillItems}></CustomList>;
    }

    var form = (
      <Form
        className="form-row"
        items={this.formItems}
        onSubmit={this.formOnSubmit}
        submitText="Add Skill"
        disableSubmit={this.state.disableSubmit}
        error={this.state.error}
        emptyOnSuccess={true}
        success={this.state.success}
      ></Form>
    );
    return (
      <div>
        <h3>Add New Skill</h3>
        {form}
        <br></br>
        <h3>My Skills</h3>
        <div>{skills}</div>
      </div>
    );
  }
}

class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.formOnSubmit = this.formOnSubmit.bind(this);
    this.state = {
      error: null,
      disableSubmit: false,
      init: true,
      user: null,
      success: null
    };
  }

  loadUser(id, role) {
    var extra = "";

    if (role === UserEnum.ROLE_STUDENT) {
      extra = `user_status
            university
            phone_number
            graduation_month
            graduation_year
            available_month
            available_year
            sponsor
            gender
            cgpa
            degree_level
            study_field
            major
            minor
            mas_state
            mas_postcode
            relocate
            study_place
            looking_for`;
    } else if (role === UserEnum.ROLE_RECRUITER) {
      extra = `rec_position rec_company`;
    }

    var query = `query {
            user(ID:${id}) {
              ID
              user_email
              user_pass
              first_name
              last_name
              description
              role
              img_url
              img_pos
              img_size
              ${extra}
            }}`;

    return getAxiosGraphQLQuery(query);
  }

  componentWillMount() {
    this.authUser = getAuthUser();
    this.loadUser(this.authUser.ID, this.authUser.role).then(res => {
      this.setState(() => {
        var user = res.data.data.user;
        return { user: user, init: false };
      });
    });
    this.formItems = getEditProfileFormItem(this.authUser.role);
  }

  //return string if there is error
  filterForm(d) {
    return 0;
  }

  formOnSubmit(d) {
    var err = this.filterForm(d);
    if (err === 0) {
      toggleSubmit(this, { error: null, success: null });
      //prepare data for edit
      d[UserMeta.MAJOR] = JSON.stringify(d[UserMeta.MAJOR]);
      d[UserMeta.MINOR] = JSON.stringify(d[UserMeta.MINOR]);
      var update = checkDiff(this, this.state.user, d);
      if (update === false) {
        return;
      }
      update[User.ID] = this.authUser[User.ID];

      var edit_query = `mutation{edit_user(${obj2arg(update, {
        noOuterBraces: true
      })}) {ID}}`;
      // console.log(edit_query);
      getAxiosGraphQLQuery(edit_query).then(
        res => {
          // console.log(res.data);
          updateAuthUser(d);
          toggleSubmit(this, {
            user: d,
            error: null,
            success: "Your Change Has Been Saved!"
          });
        },
        err => {
          toggleSubmit(this, { error: err.response.data });
        }
      );
    } else {
      //console.log("Err", err);
      this.setState(() => {
        return { error: err };
      });
    }
  }

  render() {
    var content = null;
    if (this.state.init) {
      content = <Loader size="2" text={lang("Loading User Information")}></Loader>;
    } else {
      content = (
        <div>
          <ProfileCard
            type="student"
            id={this.authUser.ID}
            className={"edit-profile"}
            add_img_ops={true}
            title={<b>{this.authUser.user_email}</b>}
            // subtitle={<i>{this.authUser.role.capitalize()}</i>}
            img_url={this.authUser.img_url}
            img_pos={this.authUser.img_pos}
            img_size={this.authUser.img_size}
          ></ProfileCard>
          <br></br>
          <br></br>
          <br></br>
          <ManageUserProfile
            user_id={this.authUser.ID}
            isEdit={true}
            completeHandler={() => {
              layoutActions.successBlockLoader("Profile Successfully Updated");
            }}
          ></ManageUserProfile>
          {/* <Form className="form-row"
                    items={this.formItems}
                    onSubmit={this.formOnSubmit}
                    submitText='Save Changes'
                    defaultValues={this.state.user}
                    disableSubmit={this.state.disableSubmit}
                    error={this.state.error}
                    success={this.state.success}>
                </Form> */}
        </div>
      );
    }

    return (
      <div className="text-left">
        <h1>{lang("Edit Profile")}</h1>
        {content}
      </div>
    );
  }
}

// For Recruiter ------------------------------------------------------/

export default class EditProfilePage extends React.Component {
  componentWillMount() {
    const authUser = getAuthUser();
    this.item = {};

    this.item["profile"] = {
      label: "My Profile",
      component: UserPopup,
      props: {
        id: authUser.ID,
        role: authUser.role,
        isOnPage: true,
      },
      icon: "user"
    };

    this.item["edit"] = {
      label: "Edit Profile",
      component: EditProfile,
      icon: "pencil"
    };

    if (isRoleStudent()) {
      this.item["doc-link"] = {
        label: "Upload Document",
        component: StudentDocLink,
        routeOnly: true,
        icon: "file-text"
      };

      this.item["video-resume"] = {
        label: "Upload Video Resume",
        component: StudentVideoResume,
        routeOnly: true,
        icon: "youtube-play"
      };
      // this.item["skills"] = {
      //   label: "Add Skills",
      //   component: Skills,
      //   icon: "star"
      // };
      this.item["availability"] = {
        label: "Manage Availability",
        component: AvailabilityView,
        props: {
          user_id: authUser.ID,
          set_only: true
        },
        routeOnly: true,
        icon: "clock-o"
      };
    }

    this.item["password-reset"] = {
      label: "Change Password",
      component: PasswordResetPage,
      icon: "lock"
    };

    // this.item["view_old"] = {
    //   label: "View Profile Old",
    //   onClick: () => {
    //     layoutActions.storeUpdateFocusCard("My Profile", UserPopup, {
    //       id: authUser.ID,
    //       role: authUser.role
    //     });
    //   },
    //   component: null,
    //   icon: "eye"
    // };

    this.item["logout"] = {
      label: "Logout",
      component: LogoutPage,
      icon: "sign-out"
    };
  }

  render() {
    let defaultItem = this.props.match.params.current;

    var title = this.item[this.props.match.params.current].label;
    document.setTitle(title);
    return (
      <SubNav
        route="edit-profile"
        items={this.item}
        defaultItem={defaultItem}
      ></SubNav>
    );
  }
}
