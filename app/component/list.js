import React, { Component } from "react";
import { ButtonLink } from "./buttons.jsx";
import { Loader } from "./loader";
import PropTypes from "prop-types";
import Tooltip from "./tooltip";
import { NavLink } from "react-router-dom";
import ProfileCard, { PCType } from "./profile-card.jsx";
import { Page } from "react-facebook";
import Paging from "./paging.jsx";
import {lang} from "../lib/lang.js";

// require("../css/list.scss");

export default class List extends React.Component {
  constructor(props) {
    super(props);
    this.page = 0;
    this.load = this.load.bind(this);
    this.loadCount = this.loadCount.bind(this);
    this.appendButtonOnClick = this.appendButtonOnClick.bind(this);
    this.isAppendType = this.isAppendType.bind(this);
    this.showLoadMore = this.showLoadMore.bind(this);
    this.renderDataContent = this.renderDataContent.bind(this);

    this.isAppend = false;

    this.state = {
      listItem: null,
      fetching: true,
      fetching_append: false,
      totalFetched: 0,
      fetchCount: 0,
      empty: false,
      count: 0
    };

    this.NEXT = "Next";
    this.PREV = "Prev";
  }

  componentWillMount() {
    this.init();
  }

  init() {
    this.loadCount();
    this.load(this.NEXT);
  }

  loadCount() {
    if (this.props.loadCount) {
      this.props.loadCount().then(res => {
        var count = this.props.getCountFromRes(res);
        this.setState({ count: count });
      });
    }
  }

  componentDidUpdate() {
    if (this.props.componentDidUpdate) {
      this.props.componentDidUpdate(this.isAppend);
    }

    // kalau siap append, fetching_append akan jadi false
    if (this.state.fetching_append === false) {
      this.isAppend = false;
    }
  }

  isAppendType() {
    return this.props.type.indexOf("append") >= 0;
  }

  load(type, page) {
    if (page) {
      page = Number.parseInt(page);
      if (isNaN(page) || this.page == page) {
        return;
      }
      this.page = page;
    } else {
      // set new page
      if (type == this.NEXT) {
        this.page++;
      }

      if (type == this.PREV) {
        if (this.page == 1) {
          return false;
        }

        this.page--;
      }
    }


    // set fetching to true if not append type
    if (!this.isAppendType()) {
      this.setState(() => {
        return {
          fetching: true
        };
      });
    } else {
      this.setState(() => {
        return {
          fetching_append: true
        };
      });
    }

    // fetch data start
    this.props.loadData(this.page, this.props.offset).then(
      res => {
        var data = this.props.getDataFromRes(res);

        var listItem = null;
        var empty = false;
        try {
          //empty list
          if (data.length <= 0) {
            let emptyView = this.props.emptyMessage ? this.props.emptyMessage : lang("Nothing To Show Here");
            var empty = this.props.showEmpty ? (
              <div style={{ width: "100%" }} className="text-muted text-center list-empty-text">
                {emptyView}
              </div>
            ) : null;

            if (this.props.customEmpty) {
              empty = this.props.customEmpty;
            }

            if (!this.isAppendType()) {
              listItem = empty;
            } else {
              if (this.state.listItem != null) {
                listItem = this.state.listItem;
              } else {
                listItem = empty;
              }
            }
            empty = true;
          }
          //success
          else {
            // need to reverse?
            if (this.isAppendType()) {
              this.setState(prevState => {
                var listItem = prevState.listItem;
                if (listItem == null) {
                  listItem = [];
                }

                data.map((d, i) => {
                  if (this.props.type == "append-top") {
                    //for chat, render list can return array
                    var newItem = this.props.renderList(d, i);
                    if (Array.isArray(newItem)) {
                      newItem.map((_d, i) => {
                        listItem.unshift(_d);
                      });
                    } else {
                      listItem.unshift(newItem);
                    }
                  } else if (this.props.type == "append-bottom") {
                    listItem.push(this.props.renderList(d, i));
                  }
                });

                return {
                  listItem: listItem,
                  fetching: false,
                  fetching_append: false,
                  totalFetched: prevState.totalFetched + data.length,
                  fetchCount: data.length,
                  empty: empty
                };
              });

              return;
            } else {
              listItem = data.map((d, i) => {
                return this.props.renderList(d, i);
              });
            }
          }
        } catch (err) {
          // error render
          listItem = `[Error While Rendering List] ${err}`;
        }

        this.setState(prevState => {
          return {
            listItem: listItem,
            fetching: false,
            fetching_append: false,
            fetchCount: data.length,
            totalFetched: prevState.totalFetched + data.length,
            empty: empty
          };
        });
      },
      // error fetching
      err => {
        var listItem = `[Error While Fetching List Data] ${err}`;
        this.setState(() => {
          return {
            listItem: listItem,
            fetching: false,
            fetching_append: false
          };
        });
      }
    );
  }

  getListClass() {
    let r = "";

    if (this.props.listClass) {
      r += this.props.listClass;
    }

    if (this.props.listAlign == "left") {
      r += " flex-wrap-start ";
    }

    if (this.props.listAlign == "right") {
      r += " flex-wrap-end ";
    }

    return r;

  }
  renderDataContent() {
    var dataContent = null;

    if (this.state.empty) {
      return this.state.listItem;
    }

    if (this.props.type == "table") {
      dataContent = this.state.empty ? (
        this.state.listItem
      ) : (
          <div className=" table-responsive">
            <table
              ref={this.props.listRef}
              className={`${this.getListClass()} table table-striped table-bordered table-hover table-condensed text-left`}
            >
              {this.props.tableHeader}
              <tbody>{this.state.listItem}</tbody>
            </table>
          </div>
        );
    } else {
      dataContent = this.state.listItem;
    }

    return dataContent;
  }

  showLoadMore() {
    if (this.props.hideLoadMore) {
      return false;
    }

    if (this.props.totalCount !== null) {
      if (this.state.totalFetched >= this.props.totalCount) {
        return false;
      } else {
        return true;
      }
    }

    if (this.state.fetchCount >= this.props.offset) {
      return true;
    }

    return false;
  }

  appendButtonOnClick() {
    this.isAppend = true;
    this.load(this.NEXT);
  }

  render() {
    var loading = this.props.customLoading ? (
      this.props.customLoading
    ) : (
        <Loader isCenter={true} size="2" text="Loading.."></Loader>
      );

    var topView = null;
    var bottomView = null;

    // for append type
    var fetchBtn = null;
    var extraTop = null;
    var extraBottom = null;
    // let endCount = 0;
    // let startCount = 0;
    if (this.props.type == "list" || this.props.type == "table") {
      // let countView = null;
      let paging = null;

      paging = <Paging
        align={this.props.listAlign}
        onClickNext={() => this.load(this.NEXT)}
        onClickPrev={() => this.load(this.PREV)}
        onClickPage={(page) => this.load(null, page)}
        total={this.state.count}
        offset={this.props.offset}
        currentPage={this.page}
        totalInPage={this.state.fetchCount}
        hasTotal={this.props.loadCount}
        limitButton={this.props.limitPaging}
      />

      // if (this.props.loadCount) {
      //   // startCount = (this.page - 1) * this.props.offset + 1;
      //   // endCount = this.page * this.props.offset;
      //   // endCount = endCount > this.state.count ? this.state.count : endCount;
      //   // countView = (
      //   //   <small>
      //   //     <br></br>
      //   //     {startCount} - {endCount} of {this.state.count}
      //   //     <br></br>
      //   //   </small>
      //   // );

      //   paging = <Paging
      //     onClickNext={() => this.load(this.NEXT)}
      //     onClickPrev={() => this.load(this.PREV)}
      //     onClickPage={(page) => this.load(null, page)}
      //     total={this.state.count}
      //     offset={this.props.offset}
      //     currentPage={this.page}
      //   />
      // }

      // let prevView =
      //   this.page > 1 ? (
      //     <small style={{ marginRight: "6px" }}>
      //       <ButtonLink
      //         onClick={() => this.load(this.PREV)}
      //         label="<< Prev"
      //       ></ButtonLink>
      //     </small>
      //   ) : null;

      // let nextView =
      //   this.state.fetchCount >= this.props.offset ? (
      //     <small style={{ marginLeft: "6px" }}>
      //       <ButtonLink
      //         onClick={() => this.load(this.NEXT)}
      //         label="Next >>"
      //       ></ButtonLink>
      //     </small>
      //   ) : null;

      // // remove next kalau dah page last
      // if (this.props.loadCount && endCount >= this.state.count) {
      //   nextView = null;
      // }

      // var paging = (
      //   <div
      //     className={this.props.pageClass}
      //     style={{
      //       textAlign: "center",
      //       display: "flex",
      //       alignItems: "center",
      //       justifyContent: "center",
      //       marginBottom: "20px",
      //       marginTop: "10px"
      //     }}
      //   >
      //     <div style={{ minWidth: "70px" }}>{prevView}</div>
      //     <div>
      //       <b>Page {this.page}</b>
      //       {countView}
      //     </div>
      //     <div style={{ minWidth: "70px" }}>{nextView}</div>
      //   </div>
      // );

      // paging = [pagingNew, paging];
      //topView = (this.props.offset >= 10 && this.state.fetchCount >= 10) ? paging : null;
      topView = this.props.hideLoadMore || this.props.isHidePagingTop ? null : paging;
      bottomView = this.props.hideLoadMore || this.props.isHidePagingBottom ? null : paging;
    }
    // For append type
    else if (this.isAppendType()) {
      if (this.state.fetching_append) {
        fetchBtn = <Loader isCenter={true} size="2"></Loader>;
      } else {
        fetchBtn = this.showLoadMore() ? (
          <small style={{ marginLeft: "6px" }}>
            <ButtonLink
              onClick={() => {
                this.appendButtonOnClick();
              }}
              label={this.props.appendText}
            ></ButtonLink>
          </small>
        ) : null;
      }

      if (this.props.type == "append-top") {
        topView = fetchBtn;
        extraBottom = this.props.extraData;
      } else if (this.props.type == "append-bottom") {
        bottomView = fetchBtn;
        extraTop = this.props.extraData;
      }
    }

    let listStyle = {}
    if (this.props.isListNoMargin) {
      listStyle.margin = "0px";
      listStyle.padding = "0px";
    }

    var content = (
      <div className={`${this.props.divClass}`}>
        {topView}
        <ul style={listStyle} className={`${this.getListClass()}`} ref={this.props.listRef}>
          {extraTop}
          {this.renderDataContent()}
          {extraBottom}
        </ul>
        {bottomView}
      </div>
    );
    return this.state.fetching ? loading : content;
  }
}

List.propTypes = {
  // general props

  isListNoMargin: PropTypes.bool,
  hideLoadMore: PropTypes.bool,
  offset: PropTypes.number.isRequired,
  customLoading: PropTypes.element,
  customEmpty: PropTypes.element,
  listClass: PropTypes.string,
  listAlign: PropTypes.string,
  listRef: PropTypes.object,
  limitPaging: PropTypes.number, // total count for the list
  totalCount: PropTypes.number, // total count for the list
  key: PropTypes.number, // to force update
  // function
  componentDidUpdate: PropTypes.func, // use in dashboard
  loadData: PropTypes.func.isRequired, // function (page)
  renderList: PropTypes.func.isRequired, // function (data)
  getDataFromRes: PropTypes.func.isRequired, // key for query response
  // type
  // table or list
  // append-top used in chat
  type: PropTypes.oneOf(["table", "list", "append-top", "append-bottom"])
    .isRequired,
  isHidePagingBottom: PropTypes.bool,
  isHidePagingTop: PropTypes.bool,
  // table
  tableHeader: PropTypes.element,
  // append-
  appendText: PropTypes.string,
  extraData: PropTypes.array,
  // page config
  pageClass: PropTypes.string,
  divClass: PropTypes.string,
  showEmpty: PropTypes.bool
};

List.defaultProps = {
  hideLoadMore: false,
  isHidePagingBottom: false,
  isHidePagingTop: false,
  appendText: "Load More",
  extraData: null,
  divClass: "",
  pageClass: "",
  totalCount: null,
  listClass: "",
  listRef: null,
  showEmpty: true
};

/*******************************************************************************************/
/*******************************************************************************************/
/*******************************************************************************************/
/*******************************************************************************************/
/*******************************************************************************************/


export class ProfileListItem extends Component {
  render() {
    var className = "profile-li";
    if (this.props.list_type) {
      className += "-" + this.props.list_type;
    }

    className += " " + this.props.list_type_extra;

    var img_dimension = this.props.img_dimension
      ? this.props.img_dimension
      : "75px";
    return (
      <ProfileCard
        {...this.props}
        img_dimension={img_dimension}
        className={className}
      ></ProfileCard>
    );
  }
}

ProfileListItem.propTypes = {
  isOnline: PropTypes.bool,
  header: PropTypes.element, // put as the first child of profile card,
  custom_width: PropTypes.string,
  list_type: PropTypes.oneOf(["card"]),
  list_type_extra: PropTypes.string,
  title: PropTypes.any.isRequired,
  subtitle: PropTypes.string.isRequired,
  badge: PropTypes.string,
  badge_tooltip: PropTypes.string,
  img_url: PropTypes.string,
  img_pos: PropTypes.string,
  img_size: PropTypes.string,
  img_dimension: PropTypes.string,
  type: PropTypes.oneOf([PCType.STUDENT, PCType.RECRUITER, PCType.COMPANY])
    .isRequired,
  body: PropTypes.any
};

ProfileListItem.defaultProps = {
  isOnline: false,
  list_type_extra: "",
  custom_width: null
};

export class ProfileListWide extends Component {
  getAction() {
    let action = [];

    let action_text = this.props.action_text;
    let action_to = this.props.action_to;
    let action_color = this.props.action_color;
    let action_handler = this.props.action_handler;

    if (!Array.isArray(action_to)) action_to = [action_to];
    if (!Array.isArray(action_color)) action_color = [action_color];
    if (!Array.isArray(action_handler)) action_handler = [action_handler];
    if (!Array.isArray(action_text)) action_text = [action_text];

    if (!this.props.action_disabled) {
      for (var i in action_text) {
        let text = action_text[i];
        let to = action_to[i]
        let color = action_color[i]
        let handler = action_handler[i]

        if (to) {
          action.push(
            <NavLink
              className={`btn btn-${color}`}
              to={to}
              onClick={() => handler()}
            >
              {text}
            </NavLink>
          );
        } else {
          action.push(<a
            className={`btn btn-${color}`}
            onClick={() => handler()}
          >
            {text}
          </a>)
        }
      }
    }

    if (action.length > 0) {
      return <div className={`item-action`}>{action}</div>
    } else {
      return null;
    }
  }
  render() {
    var img_dimension = this.props.img_dimension
      ? this.props.img_dimension
      : "75px";

    var imgView = null;
    // in student listing no image
    if (!this.props.is_no_image) {
      imgView = (
        <ProfileCard
          {...this.props}
          title={null}
          body={null}
          subtitle={null}
          img_dimension={img_dimension}
          className={className}
        ></ProfileCard>
      );
    }

    var className = "card-wide";

    var contentSize = "8";
    if (this.props.action_disabled) {
      contentSize = "10";
    } else if (this.props.is_no_image) {
      contentSize = "10";
    }

    let action = this.getAction();

    // if(action != null){
    //   className += " card-wide-with-action ";
    // }

    return (
      <div className={className}>
        <div className={`card-container container-fluid ${action != null ? "with-action" : ""}`}>
          {this.props.rootContent}
          {this.props.is_no_image ? (
            <div style={{ marginRight: "15px" }}></div>
          ) : (
              <div className={`${className}-item col-md-2`}>{imgView}</div>
            )}
          <div className={`${className}-item col-md-${contentSize}`}>
            <div className="item-main">
              <h4>{this.props.title}</h4>
              <div>{this.props.body}</div>
            </div>
          </div>
          {action}
        </div>
      </div>
    );
  }
}

ProfileListWide.propTypes = {
  rootContent: PropTypes.object,
  title: PropTypes.any.isRequired,
  subtitle: PropTypes.string.isRequired,
  img_url: PropTypes.string,
  img_pos: PropTypes.string,
  img_size: PropTypes.string,
  img_dimension: PropTypes.string,
  is_no_image: PropTypes.bool,

  isNavLink: PropTypes.bool,
  action_text: PropTypes.string,
  action_to: PropTypes.string,
  action_color: PropTypes.string,
  action_handler: PropTypes.func,
  action_disabled: PropTypes.bool,

  type: PropTypes.oneOf([PCType.STUDENT, PCType.RECRUITER, PCType.COMPANY])
    .isRequired,
  body: PropTypes.any
};

ProfileListWide.defaultProps = {
  isNavLink: false,
  is_no_image: false,
  action_color: "blue"
};

/*******************************************************************************************/

export class SimpleListItem extends Component {
  render() {
    var body = this.props.body ? (
      <p className="sili-body">{this.props.body}</p>
    ) : null;
    var onDelete = !this.props.onDelete ? null : (
      <a
        className="sili-operation"
        id={this.props.onDelete.id}
        label={this.props.onDelete.label}
        onClick={this.props.onDelete.onClick}
      >
        Delete
      </a>
    );

    var onEdit = !this.props.onEdit ? null : (
      <a
        className="sili-operation"
        id={this.props.onEdit.id}
        label={this.props.onEdit.label}
        onClick={this.props.onEdit.onClick}
      >
        Edit
      </a>
    );

    var typeClass = "";
    if (this.props.type) {
      typeClass = "simple-li-card";
    }

    return (
      <div className={`simple-li ${typeClass}`}>
        <div className="sili-title">{this.props.title}</div>
        <div className="sili-subtitle">
          {this.props.subtitle}
          {onEdit}
          {onDelete}
        </div>

        {body}
      </div>
    );
  }
}

SimpleListItem.propTypes = {
  title: PropTypes.any.isRequired,
  subtitle: PropTypes.string.isRequired,
  body: PropTypes.any,
  onDelete: PropTypes.obj,
  onEdit: PropTypes.obj,
  type: PropTypes.oneOf(["card"])
};

export class CustomList extends Component {
  getTableLi(d, i) {
    return (
      <tr onClick={this.props.onClick} className={liClassName} key={i}>
        {d}
      </tr>
    );
  }

  getLabelLi(d, i) {
    // console.log(d,i)
    //var labels = ["primary", "danger", "success", "default"];
    var labels = ["custom"];
    var index = i % labels.length;
    var liClassName = `label label-${labels[index]}`;
    return (
      <li onClick={this.props.onClick} className={liClassName} key={i}>
        {d}
      </li>
    );
  }

  getIconList(d, i) {
    var style = {
      background: d.color,
      color: "white",
      fontSize: this.props.il_font,
      width: this.props.il_dimension,
      height: this.props.il_dimension,
      float: "left"
    };

    var styleText = {
      float: "right",
      textAlign: "left",
      width: this.props.il_text_width
    };

    var text = null;
    if (typeof d.text !== "undefined") {
      text = d.text;
    }

    if (typeof d.isNavLink === "undefined") {
      d.isNavLink = false;
    }

    var content = (
      <li className={`li-${this.props.className}`} key={i}>
        <div style={style} className="icon-circle">
          <i className={`fa fa-${d.icon}`}></i>
        </div>
        <div style={styleText}>{text}</div>
      </li>
    );

    return content;
  }

  getIconLinkLi(d, i) {
    var style = {
      background: d.color,
      color: "white",
      fontSize: this.props.il_font,
      width: this.props.il_dimension,
      height: this.props.il_dimension,
      float: "left"
    };

    var styleText = {
      float: "right"
    };

    var text = null;
    if (typeof d.text !== "undefined") {
      text = d.text;
    }

    if (typeof d.isNavLink === "undefined") {
      d.isNavLink = false;
    }

    var linkView = d.isNavLink ? (
      <NavLink to={d.url}>
        <div style={style} className="icon-circle">
          <i className={`fa fa-${d.icon}`}></i>
        </div>
        <div style={styleText}>{text}</div>
      </NavLink>
    ) : (
        <a href={d.url} target="blank">
          <div style={style} className="icon-circle">
            <i className={`fa fa-${d.icon}`}></i>
            <div style={styleText}>{text}</div>
          </div>
        </a>
      );

    var onClick = d.onClick ? d.onClick : this.props.onClick;
    var content = (
      <li onClick={onClick} className={`li-${this.props.className}`} key={i}>
        {linkView}
      </li>
    );

    return (
      <Tooltip
        debug={false}
        width={this.props.il_tooltip.width}
        left={this.props.il_tooltip.left}
        bottom={this.props.il_tooltip.bottom}
        content={content}
        tooltip={d.label}
      ></Tooltip>
    );
  }
  getIconLi(d, i) {
    return (
      <li
        onClick={this.props.onClick}
        className={`li-${this.props.className}`}
        key={i}
      >
        {d.label ? (
          <div className="cli-label">
            {d.icon ? <i className={`fa fa-${d.icon}`}></i> : null}
            {d.label}
          </div>
        ) : null}
        {d.value ? <div className="cli-value">{d.value}</div> : null}
      </li>
    );
  }

  render() {
    // console.log(this.props.className, this.props.items)
    // console.log(this.props.className, this.props.items)
    // console.log(this.props.className, this.props.items)
    // console.log(this.props.className, this.props.items)

    if (this.props.items.length === 0) {
      let emptyStyle = {
        width: "100%"
      }
      if (typeof this.props.emptyMessage !== "undefined") {
        return <div style={emptyStyle} className="text-muted">{this.props.emptyMessage}</div>;
      } else {
        return <div style={emptyStyle} className="text-muted">{lang("Nothing To Show Here")}</div>;
      }
    }

    var view = this.props.items.map((d, i) => {
      switch (this.props.className) {
        case "empty":
          return (
            <li onClick={this.props.onClick} key={i}>
              {d}
            </li>
          );
          break;
        case "normal":
          return (
            <li className="normal" onClick={this.props.onClick} key={i}>
              {d}
            </li>
          );
          break;
        case "table":
          return this.getTableLi(d, i);
          break;
        case "label":
          return this.getLabelLi(d, i);
          break;
        case "icon-link":
          return this.getIconLinkLi(d, i);
          break;
        case "icon-list":
          return this.getIconList(d, i);
          break;
        case "icon":
          return this.getIconLi(d, i);
          break;
      }
    });

    var className = "";
    if (this.props.className != "normal") {
      className += `custom-list-${this.props.className} `;
    } else {
      className += this.props.className;
    }

    className += this.props.ux ? " li-ux " : "";
    className += this.props.isSmall ? " li-sm " : "";

    var style = {
      justifyContent: this.props.alignCenter ? "center" : "start"
    };

    return (
      <ul style={style} className={className}>
        {view}
      </ul>
    );
  }
}

CustomList.propTypes = {
  // specifically for iconLink
  il_text_width: PropTypes.string,
  il_dimension: PropTypes.string,
  il_font: PropTypes.string,
  il_tooltip: PropTypes.object,
  isSmall: PropTypes.bool, // used in student listing
  alignCenter: PropTypes.bool,
  items: PropTypes.array.isRequired,
  emptyMessage: PropTypes.any,
  className: PropTypes.oneOf([
    "empty",
    "normal",
    "icon",
    "label",
    "icon-link",
    "icon-list"
  ]),
  onClick: PropTypes.func,
  ux: PropTypes.bool // added class "li-ux" if true then is user interactive, on hover on active
};

CustomList.defaultProps = {
  il_text_width: null,
  il_dimension: "26px",
  il_font: "initial",
  il_tooltip: {},
  isSmall: false,
  alignCenter: true
};

// to create icon link list
// with different size
export function createIconLink(
  size,
  items,
  alignCenter = true,
  onClick = null,
  emptyMessage = undefined
) {
  var tooltip = {};
  var dimension = "";
  var font = "";
  switch (size) {
    case "sm":
      dimension = "26px";
      tooltip.width = "90px";
      tooltip.left = "-31px";
      tooltip.bottom = "28px";
      font = "initial";
      break;
    case "lg":
      dimension = "70px";
      tooltip.width = "120px";
      tooltip.left = "-22px";
      tooltip.bottom = "75px";
      font = "35px";
      break;
  }

  return (
    <CustomList
      className={"icon-link"}
      il_dimension={dimension}
      il_tooltip={tooltip}
      il_font={font}
      alignCenter={alignCenter}
      emptyMessage={emptyMessage}
      onClick={onClick}
      items={items}
    ></CustomList>
  );
}

// to create icon link list
// with different size
export function createIconList(
  size,
  items,
  width,
  { customTextWidth, customIconDimension, customIconFont }
) {
  var dimension = "";
  var font = "";
  switch (size) {
    case "sm":
      dimension = "26px";
      font = "initial";
      break;
    case "lg":
      dimension = "70px";
      font = "35px";
      break;
  }

  if (customIconDimension) {
    dimension = customIconDimension;
  }
  if (customIconFont) {
    font = customIconFont;
  }

  let alignCenter = true;
  return (
    <div className="text-center" style={{ maxWidth: width, margin: "auto" }}>
      <CustomList
        className={"icon-list"}
        il_text_width={customTextWidth}
        il_dimension={dimension}
        il_font={font}
        alignCenter={alignCenter}
        items={items}
      ></CustomList>
    </div>
  );
}
