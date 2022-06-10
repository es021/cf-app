import React from "react";
import PropTypes from "prop-types";
import { Loader } from "./loader";
import { NavLink } from "react-router-dom";
import { RootPath, AppPath } from "../../config/app-config";
import { CFSMeta } from '../../config/db-config';

import {
  storeHideFocusCard,
  storeHideBlockLoader
} from "../redux/actions/layout-actions";
import { DocLinkEnum } from "../../config/db-config";
import { getAxiosGraphQLQuery } from "../../helper/api-helper";
import { customBlockLoader } from "../redux/actions/layout-actions";
import { hasResume, hasCV, hasAcademicTranscript } from "./doc-link-form.jsx";
import { getAuthUser, getCF, isCfFeatureOn, isRoleStudent } from "../redux/actions/auth-actions";

export const ValidationSource = {
  GROUP_SESSION: "GROUP_SESSION",
  DROP_RESUME: "DROP_RESUME"
};

export default class ValidationStudentCompletedProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      isCompleted: true
    };
  }


  componentWillMount() {
    var user_id = getAuthUser().ID;
    var query = `      
      query{
        user(ID:${user_id}, cf_to_check_profile_complete:"${getCF()}"){
          ID
          is_profile_custom_order_completed
        }
      }
    `;
    getAxiosGraphQLQuery(query).then(res => {
      var userData = res.data.data.user;
      var isCompleted = userData.is_profile_custom_order_completed;
      this.setState(prevState => {
        return {
          loading: false,
          isCompleted: isCompleted
        };
      });
    });
  }

  hideNotificationMenu() {
    let els = document.getElementsByClassName("menu-notification")
    for (let e of els) {
      e.style.display = "none"
    }
  }

  isExceptionPage() {
    if (location.href.indexOf(AppPath + `/edit-profile/profile`) >= 0 || location.href.indexOf(AppPath + `/edit-profile/doc-link`) >= 0) {
      return true;
    }
    return false;
  }
  isHideBlockPopup() {
    if (!isCfFeatureOn(CFSMeta.FEATURE_POPUP_BLOCK_INCOMPLETE_PROFILE)) {
      return true;
    }
    if (!isRoleStudent()) {
      return true;
    }
    return false;
  }

  render() {
    if (this.isHideBlockPopup()) {
      return <div></div>
    }


    var closeBlockLoader = false;
    var view = <div />;
    if (this.state.loading) {
      view = <Loader text="Loading..." size="2" />;
    } else {
      if (this.state.isCompleted) {
        closeBlockLoader = true;
      } else {
        view = (
          <div>
            <h3 >
              Hi {getAuthUser().first_name},<br></br><small>Thank you for joining us!</small>
              {/* <div>
              Thank you for joining us.
            </div> */}
            </h3>
            <div>
              <div style={{ fontSize: '130%' }}><b>Please complete your profile to continue.</b></div>
              <br></br>
              <div>
                Your profile is off to a great start.<br></br>Take a moment to complete the rest of your profile to help you stand out among the recruiters.<br></br>
              </div>
            </div>
            <br />
            <br />
            <div onClick={() => {
              window.location = AppPath + `/edit-profile/profile`
            }}>
              <button className="btn btn-lg btn-primary" >
                Complete Your Profile Now
            </button>
            </div>

          </div>
        );
      }
    }

    if (closeBlockLoader) {
      storeHideBlockLoader();
    } else {
      this.hideNotificationMenu();
      if (this.isExceptionPage()) {
        storeHideBlockLoader();
      } else {
        customBlockLoader(view, undefined, undefined, undefined, true);
      }
    }

    return <div />;
  }
}

ValidationStudentCompletedProfile.propTypes = {
};

ValidationStudentCompletedProfile.defaultProps = {
};
