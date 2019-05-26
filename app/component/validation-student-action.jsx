import React from "react";
import PropTypes from "prop-types";
import { Loader } from "./loader";
import { NavLink } from "react-router-dom";
import { RootPath } from "../../config/app-config";
import {
  storeHideFocusCard,
  storeHideBlockLoader
} from "../redux/actions/layout-actions";
import { DocLinkEnum } from "../../config/db-config";
import { getAxiosGraphQLQuery } from "../../helper/api-helper";
import { customBlockLoader } from "../redux/actions/layout-actions";
import { hasResume, hasCV, hasAcademicTranscript } from "./doc-link-form.jsx";
import { getAuthUser } from "../redux/actions/auth-actions";

export const ValidationSource = {
  GROUP_SESSION: "GROUP_SESSION",
  DROP_RESUME: "DROP_RESUME"
};

export default class ValidationStudentAction extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasResume: false,
      //hasAcademicTrans: false,
      //emailVerified: false,
      profileCompleted: false,
      loading: true,
      user_email: null
    };
  }

  isAllTrue() {
    if (this.props.source === ValidationSource.GROUP_SESSION) {
      return true;
    } else if (this.props.source === ValidationSource.DROP_RESUME) {
      // console.log("state",this.state);
      // console.log("state",this.state);
      // console.log("state",this.state);
      // console.log("state",this.state);
      return (
        this.state.hasResume &&
        //&& this.state.hasAcademicTrans
        //&& this.state.emailVerified
        this.state.profileCompleted
      );
    }

    return true;
  }

  getList() {
    var list = {};
    // list.emailVerified = {
    //     label: "Verifiy Your Email",
    //     icon: "envelope",
    //     desc: <div>Please check your email (<b>{this.state.user_email}</b>) for the activation link.
    //         If you did not received any email, contact us at <b>innovaseedssolution@gmail.com</b>
    //     </div>,
    //     action: null,
    // };

    list.profileCompleted = {
      label: "Complete Your Profile",
      icon: "user",
      desc: "Fill in all the required field in edit profile",
      action: `${RootPath}/app/edit-profile/profile`,
      actionText: "Click Here To Complete Your Profile"
    };

    list.hasResume = {
      label: "Upload Resume",
      icon: "file-text-o",
      actionText: "Click Here To Upload",
      desc: null,
      //desc: `Make sure you have a document labeled '${DocLinkEnum.LABEL_RESUME}' in your profile`,
      action: `${RootPath}/app/edit-profile/doc-link?label=${
        DocLinkEnum.LABEL_RESUME
      }`
    };

    // list.hasAcademicTrans = {
    //     label: "Upload Academic Transcript",
    //     icon: "file-text-o",
    //     actionText: "Click Here To Upload",
    //     desc: null,
    //     //desc: `Make sure you have a document labeled '${DocLinkEnum.LABEL_ACADEMIC_TRANS}' in your profile`,
    //     action: `${RootPath}/app/edit-profile/doc-link?label=${DocLinkEnum.LABEL_ACADEMIC_TRANS}`,
    // };

    return list;
  }

  componentWillMount() {
    var user_id = getAuthUser().ID;

    // is_active

    var query = `query{user(ID:${user_id}){ user_email is_profile_completed doc_links{ID label url} }}`;
    getAxiosGraphQLQuery(query).then(res => {
      var userData = res.data.data.user;
      var dl = userData.doc_links;
      this.setState(prevState => {
        return {
          user_email: userData.user_email,
          loading: false,
          hasResume: hasResume(dl) || hasCV(dl),
          //hasAcademicTrans: hasAcademicTranscript(dl),
          //emailVerified: userData.is_active,
          profileCompleted: userData.is_profile_completed
        };
      });
    });
  }

  render() {
    var closeBlockLoader = false;
    var view = <div />;
    if (this.state.loading) {
      view = <Loader text="Loading..." size="2" />;
    } else {
      if (this.isAllTrue()) {
        closeBlockLoader = true;
      } else {
        var title = (
          <h4 style={{ color: "grey" }}>
            Please Complete All The Following First
          </h4>
        );
        var list = [];
        var listData = this.getList();
        for (var key in listData) {
          let item = listData[key];
          let isDone = this.state[key];
          let icon = <i className={`text-muted fa fa-${item.icon} left`} />;
          let itemView = (
            <div>
              {isDone ? (
                <div>
                  {icon}
                  <span style={{ color: "green" }}>
                    {item.label} <i className="fa fa-check-circle" />
                  </span>
                </div>
              ) : (
                <div>
                  {icon}
                  <span style={{ color: "#393333" }}>{item.label}</span>
                </div>
              )}
              {item.desc == null || isDone ? null : (
                <div>
                  <small className="text-muted">{item.desc}</small>
                </div>
              )}
              {item.action == null || isDone ? null : (
                <small>
                  <NavLink
                    onClick={() => {
                      storeHideBlockLoader();
                      storeHideFocusCard();
                    }}
                    to={item.action}
                  >
                    {item.actionText}
                  </NavLink>
                </small>
              )}
            </div>
          );

          list.push(<div style={{ marginTop: "15px" }}>{itemView}</div>);
        }

        view = (
          <div>
            {title}
            <div style={{ marginTop: "5px", textAlign: "left" }}>{list}</div>
            <br />
            <br />
            <small>
              <a
                onClick={() => {
                  if (this.props.closeHandler != null) {
                    this.props.closeHandler();
                  }
                  storeHideBlockLoader();
                }}
              >
                CLOSE
              </a>
            </small>
          </div>
        );
      }
    }

    if (closeBlockLoader || this.props.isHidden) {
      storeHideBlockLoader();
    } else {
      customBlockLoader(view, undefined, undefined, undefined, true);
    }

    if (
      closeBlockLoader &&
      this.props.successHandler != null &&
      !this.props.isHidden
    ) {
      this.props.successHandler();
    }
    return <div />;
  }
}

ValidationStudentAction.propTypes = {
  source: PropTypes.oneOf([
    ValidationSource.GROUP_SESSION,
    ValidationSource.DROP_RESUME
  ]),
  successHandler: PropTypes.func,
  closeHandler: PropTypes.func,
  isHidden: PropTypes.bool
};

ValidationStudentAction.defaultProps = {
  successHandler: null,
  closeHandler: null,
  isHidden: false
};
