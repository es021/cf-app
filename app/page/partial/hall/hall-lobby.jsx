import { getAuthUser, getCF } from "../../../redux/actions/auth-actions";
import {
  getDataCareerFair,
} from "../../../component/form";
import { getAxiosGraphQLQuery } from "../../../../helper/api-helper";
import React from "react";
import { HallLobby } from "../../../../config/db-config";
import GeneralFormPage from "../../../component/general-form";
import PropTypes from "prop-types";
import List from "../../../component/list";
import { EmptyCard } from "../../../component/card.jsx";
import { IsNewEventCard } from "../../../../config/app-config";
import { Time } from "../../../lib/time";
import ProfileCard from "../../../component/profile-card.jsx";
import { getEventTitle, getEventAction, getEventLocation } from "../../view-helper/view-helper";
import { lang } from "../../../lib/lang";
export class HallLobbyList extends React.Component {
  constructor(props) {
    super(props);

    this.loadData = this.loadData.bind(this);
    this.getDataFromRes = this.getDataFromRes.bind(this);
    // this.addFeedToView = this.addFeedToView.bind(this);
    this.renderList = this.renderList.bind(this);
    this.offset = 8;

    this.state = {
      extraData: [],
      key: 0
    };

    this.isInit = true;
  }

  componentWillMount() {
    this.getMainQueryParam = (page, offset) => {
      let param = "";

      if (page && offset) {
        param += `page:${page},offset:${offset},`;
      }

      // order_by:"end_time desc"
      param = `cf:"${getCF()}", is_active:1,${param}`;
      param = param.substr(0, param.length - 1);
      return param;
    }
    this.loadCount = () => {
      var query = `query{
        hall_lobbies_count(${this.getMainQueryParam()})
       }`;

      return getAxiosGraphQLQuery(query);
    };

    this.getCountFromRes = (res) => {
      return res.data.data.hall_lobbies_count
    }
  }

  // ##############################################################
  // function for list
  loadData(page, offset) {
    var query = `query{
      hall_lobbies(${this.getMainQueryParam(page, offset)}) {
          ID
          title
          color
          url
        }
      }`;
    return getAxiosGraphQLQuery(query);
  }

  getDataFromRes(res) {
    // this.hasUpNext = false;
    // this.hasNow = false;

    // if (this.isInit) {
    //   this.scrollTo = "top";
    //   this.isInit = false;
    // } else {
    //   this.scrollTo = "bottom";
    // }
    return res.data.data.hall_lobbies;
  }

  renderList(d, i, isExtraData = false) {
    let defaultColor = '#4a4646';
    return <EmptyCard
      borderRadius="10px"
      onClick={() => {
        if (d.url) {
          window.open(d.url)
        }
      }}
      body={
        <div className="hall-lobby-item">
          <div className="hli-title"
            style={{ color: d.color ? d.color : defaultColor }}>
            {d.title}
          </div>
          <div className="hli-action">
            {/* <a href={d.url} target="_blank"> */}
            <button
              className="btn btn-round-5 btn-bold"
              style={{ background: d.color ? d.color : defaultColor, color: "white" }}
            >
              Join Lobby{" "}<i className="fa fa-long-arrow-right"></i>
            </button>
            {/* </a> */}
          </div>
        </div>
      }>
    </EmptyCard>
  }

  render() {
    let countParam = {}
    if (!this.props.limitLoad) {
      countParam = {
        loadCount: this.loadCount,
        getCountFromRes: this.getCountFromRes
      }
    }

    let offset = 0;
    if (this.props.limitLoad) {
      offset = this.props.limitLoad;
    }
    else if (this.props.customOffset) {
      offset = this.props.customOffset;
    }
    else {
      offset = this.offset;
    }

    var r = <List
      {...countParam}
      emptyMessage={""}
      divClass={"full-width"}
      key={this.state.key}
      isHidePagingTop={this.props.isHidePagingTop}
      type="list"
      listClass={this.props.listClass ? this.props.listClass : "flex-wrap"}
      pageClass="text-right"
      listRef={v => (this.dashBody = v)}
      getDataFromRes={this.getDataFromRes}
      loadData={this.loadData}
      isListNoMargin={this.props.isListNoMargin}
      extraData={this.state.extraData}
      hideLoadMore={this.props.limitLoad ? true : false}
      offset={offset}
      listAlign={this.props.listAlign}
      renderList={this.renderList}
    />


    return <div className="text-center" style={{ marginBottom: "20px" }}>
      {r}
    </div>
  }
}

HallLobbyList.propTypes = {
  type: PropTypes.string,
  limitLoad: PropTypes.number,
  customOffset: PropTypes.number,
  listAlign: PropTypes.string,
  isListNoMargin: PropTypes.bool,
  isFullWidth: PropTypes.bool,
  isHidePagingTop: PropTypes.bool
}

HallLobbyList.defaultProps = {
  type: "card"
}


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
            label: "Color Code",
            sublabel: "eg : #000000",
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
      var discard = ["url", "color", "item_order"];
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
                <b>Color</b> : <span style={{ color: d.color ? d.color : "black" }}><b>{d.color}</b></span><br></br>
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
