import { getAuthUser, getCF } from "../../../redux/actions/auth-actions";
import {
  getDataCareerFair,
} from "../../../component/form";
import { getAxiosGraphQLQuery } from "../../../../helper/api-helper";

import React from "react";
import { HallLobby } from "../../../../config/db-config";
import GeneralFormPage from "../../../component/general-form";


// #########################################################################################################
// #########################################################################################################

export class ManageHallLobby extends React.Component {
  constructor(props) {
    super(props);
    this.authUser = getAuthUser();
    this.cf = getCF();
  }

  componentWillUnmount() {
    // unsetBodyFullWidth();
  }

  componentWillMount() {
    // setBodyFullWidth();

    this.DATA_CF = getDataCareerFair();
    this.FIELD_SELECT =
      "ID cf is_active item_order title url color";
    this.offset = 20;
    this.tableHeader = (
      <thead>
        <tr>
          <th>ID</th>
          <th>CF</th>
          <th>Is Active</th>
          <th>Info</th>
        </tr>
      </thead>
    );

    //##########################################
    //  search
    this.searchParams = "";
    this.search = {};
    this.searchFormItem = [
      { header: "Enter Your Search Query" },
      {
        label: "Career Fair",
        name: HallLobby.CF,
        type: "radio",
        data: this.DATA_CF
      }
    ];

    this.searchFormOnSubmit = d => {
      this.search = d;
      this.searchParams = "";
      if (d != null) {
        this.searchParams += d.cf !== "" ? `cf:"${d.cf}",` : "";
      }
    };

    this.loadData = (page, offset) => {
      var q = `query{hall_lobbies(${this.searchParams} 
              order_by: "cf asc, is_active desc, item_order asc", page:${page}, offset:${offset}) 
            { ${this.FIELD_SELECT} } }`;
      // console.log(q);
      return getAxiosGraphQLQuery(q);
    };

    this.getDataFromRes = res => {
      return res.data.data.hall_lobbies;
    };

    // create form add new default
    this.newFormDefault = {};
    this.newFormDefault[HallLobby.CF] = this.cf;
    this.newFormDefault[HallLobby.IS_ACTIVE] = 1;
    this.newFormDefault[HallLobby.ITEM_ORDER] = 0;

    this.getFormItem = edit => {
      var ret = [{ header: "Hall Lobby Form" }];
      ret.push(
        ...[
          {
            label: "Career Fair",
            name: HallLobby.CF,
            type: "radio",
            data: this.DATA_CF,
            required: true
          },
          {
            label: "Is Active?",
            name: HallLobby.IS_ACTIVE,
            type: "radio",
            data: [{ key: 1, label: "Yes" }, { key: 0, label: "No" }],
            required: true
          },
          {
            label: "Item Order",
            name: HallLobby.ITEM_ORDER,
            type: "number"
          },
          {
            label: "Title",
            name: HallLobby.TITLE,
            type: "text",
          },
          {
            label: "Url",
            name: HallLobby.URL,
            type: "text"
          },
          {
            label: "Color",
            name: HallLobby.COLOR,
            type: "text"
          }
        ]
      );

      var extra = [];
      if (edit) {
      }

      ret.push(...extra);

      return ret;
    };

    this.getEditFormDefault = ID => {
      const query = `query
          {hall_lobbies(ID: ${ID}){ ${this.FIELD_SELECT} }}`;

      return getAxiosGraphQLQuery(query).then(res => {
        var hg = res.data.data.hall_lobbies[0];
        return hg;
      });
    };



    this.renderRow = (d, i) => {
      var row = [];
      var discard = ["url", "color",  "item_order"];
      for (var key in d) {
        if (discard.indexOf(key) >= 0) {
          continue;
        }
        if (key == "title") {
          row.push(
            <td>
              <div style={{ maxWidth: "40vw" }}>
                <b>Order</b> : <span>{d.item_order}</span><br></br>
                <b>Title</b> : <span>{d.title}</span><br></br>
                <b>Url</b> : <span>{d.url}</span><br></br>
                <b>Color</b> : <span>{d.color}</span><br></br>
              </div>
            </td>
          );
        } else if (key == "is_active") {
          var is_active =
            d.is_active == "0" ? (
              <label className="label label-danger">Not Active</label>
            ) : (
                <label className="label label-success">Active</label>
              );
          row.push(<td>{is_active}</td>);
        } else {
          row.push(<td>{d[key]}</td>);
        }
      }
      return row;
    };

    // if used in formWillSubmit, better put in force diff
    this.forceDiff = [
      HallLobby.TITLE,
      HallLobby.IS_ACTIVE,
      HallLobby.URL,
      HallLobby.COLOR,
    ];

    this.formWillSubmit = (d, edit) => {
      for (var i in d) {
        if (d[i] == null) {
          d[i] = "";
        }
      }

      var parseInt = [HallLobby.IS_ACTIVE, HallLobby.ITEM_ORDER];

      for (var i in parseInt) {
        if (typeof d[parseInt[i]] === "string") {
          d[parseInt[i]] = Number.parseInt(d[parseInt[i]]);
        }
      }

      if (!d[HallLobby.ITEM_ORDER]) {
        d[HallLobby.ITEM_ORDER] = 0;
      }

      if (edit) {
        d.updated_by = this.authUser.ID;
      } else {
        d.created_by = this.authUser.ID;
      }

      return d;
    };
  }

  render() {
    document.setTitle("Manage Hall Lobby");
    return (
      <div className="main-width-lg">
        <h3>Manage Hall Lobby</h3>
        <GeneralFormPage
          entity_singular="Hall Lobby"
          entity="hall_lobby"
          addButtonText="Add New Hall Lobby"
          dataTitle={this.dataTitle}
          forceDiff={this.forceDiff}
          getFormItem={this.getFormItem}
          newFormDefault={this.newFormDefault}
          getEditFormDefault={this.getEditFormDefault}
          noMutation={true}
          formWillSubmit={this.formWillSubmit}
          canEdit={true}
          canAdd={true}
          dataOffset={20}
          searchFormItem={this.searchFormItem}
          searchFormOnSubmit={this.searchFormOnSubmit}
          tableHeader={this.tableHeader}
          renderRow={this.renderRow}
          getDataFromRes={this.getDataFromRes}
          loadData={this.loadData}
        />
      </div>
    );
  }
}
