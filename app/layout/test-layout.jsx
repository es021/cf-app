import React, { Component } from "react";

import { getAxiosGraphQLQuery } from "../../helper/api-helper";
import { getAuthUser, getCF } from "../redux/actions/auth-actions";
export default class TestLayout extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    let q = `
    query{
      job_suggestions(user_id: ${getAuthUser().ID}, cf : "${getCF()}"){
        company {
          ID
          name
          img_url
          img_pos
          img_size
        }
        ID 
        title
      	type
      	application_url
      }
    }
    `;

    console.log(q);
    getAxiosGraphQLQuery(q).then(res => {
      console.log(res.data.data);
    });
  }

  render() {
    document.setTitle("Test");
    return <div style={{ padding: "10px", background: "white" }}>Hello</div>;
  }
}
