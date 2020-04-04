import React, { Component } from "react";
import { AppConfig, ImgConfig, FooterClass } from "../../config/app-config";
import { ButtonIcon } from "../component/buttons.jsx";
import { getCFOrg, isRedirectExternalHomeUrl } from "../redux/actions/auth-actions";

//import {openNewTab} from '../lib/util';

// require("../css/footer.scss");

class FixedImg extends React.Component {
  render() {
    var style = {
      backgroundImage: `url(${this.props.url})`,
      width: this.props.width + "px",
      height: this.props.height + "px",
      backgroundSize: "cover",
      margin: "auto",
      ...this.props.style
    };

    return <div style={style}></div>;
  }
}

export default class Footer extends React.Component {
  constructor(props) {
    super(props);

    var date = new Date();
    this.YEAR = date.getYear() + 1900;
  }

  componentWillMount() {
    var OrgConfig = getCFOrg();
    // if (typeof OrgConfig !== "object") {
    //   OrgConfig = { Organizer: [], Collaborator: [] };
    // }

    // var list = [
    //   {
    //     title: "ORGANIZED BY",
    //     items: OrgConfig.Organizer
    //   },
    //   {
    //     title: "IN COLLABORATION WITH",
    //     items: OrgConfig.Collaborator
    //   }
    // ];

    var list = OrgConfig.map((d, i) => {
      return {
        title: d.label.toUpperCase(),
        items: d.data
      }
    })

    this.orgs = list.map(function (d, i) {
      var items = d.items.map((d, i) => (
        <li key={i}>
          <a className="org-link" target="_blank" href={d.url}>
            {d.name} {d.shortname ? `(${d.shortname})` : null}
          </a>
        </li>
      ));

      return (
        <div key={i} className={`orgs col-sm-4`}>
          {items.length > 0 ? (
            <div>
              <h3 className="title">{d.title}</h3>
              <ul>{items}</ul>
            </div>
          ) : null}
        </div>
      );
    });

    // fill in empty section
    for(var i = 0; i < 2 - list.length; i++){
      this.orgs.push(<div className={`orgs col-sm-4`}></div>)
    }

    var btn_size = "25px";
    this.brand = (
      <div className="brand">
        <h3 className="title">
          POWERED BY
        </h3>
        <FixedImg
          // url={ImgConfig.IsIconInverse}
          url={ImgConfig.AppIconFooter}
          height="31"
          width="144"
          style={{
            "backgroundPosition": "bottom"
          }}
        ></FixedImg><br></br>
        <div className="social">
          <ButtonIcon
            href={AppConfig.FbUrl}
            target="_blank"
            theme="dark"
            icon="facebook-square"
            size={btn_size}
          ></ButtonIcon>

          <ButtonIcon
            href={AppConfig.WwwUrl}
            target="_blank"
            theme="dark"
            icon="globe"
            size={btn_size}
          ></ButtonIcon>
        </div>
        {/* <div className="copyright">
          © {year}, Innovaseeds Solutions<br></br>All Rights Reserved
        </div> */}
      </div>
    );
  }

  render() {
    if (isRedirectExternalHomeUrl(this.props)) {
      return null;
    }

    return (
      <footer className={FooterClass}>
        <div className="container-fluid">
          <div className="row">
            {this.orgs}
            <div className="col-sm-4">{this.brand}</div>
          </div>
          <div className="row ">
            <div className="col-sm-12 copyright">
              © {this.YEAR}, Innovaseeds Solutions. All Rights Reserved.
            </div>
          </div>
        </div>
      </footer>
    );
  }
}
