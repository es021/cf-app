import React, { Component } from "react";
import PropTypes from "prop-types";
import { graphql } from "../../../../helper/api-helper";
import { EmptyCard } from "../../../component/card.jsx";
import List from "../../../component/list";
import {
  getAuthUser,
  isRoleRec,
  isRoleStudent,
  isRoleAdmin,
  getCF
} from "../../../redux/actions/auth-actions";
import * as layoutActions from "../../../redux/actions/layout-actions";
import {
  PCType,
  createImageElement
} from "../../../component/profile-card";
import { InterestedButton } from "../../../component/interested";
import VacancyPopup from "../popup/vacancy-popup";
import { getApplyButton } from "../../vacancy";
import GeneralFormPage from "../../../component/general-form";
import { Loader } from "../../../component/loader";
import { getEmptyMessageWithSearchQuery } from "../../view-helper/view-helper";


// for student only
// untuk rec ada HallRecruiterJobPost
export class VacancyList extends React.Component {
  constructor(props) {
    super(props);
    this.loadData = this.loadData.bind(this);
    this.renderList = this.renderList.bind(this);
    this.addSearch = this.addSearch.bind(this);
    this.onClickCard = this.onClickCard.bind(this);
    this.searchFormOnSubmit = this.searchFormOnSubmit.bind(this);
    this.authUser = getAuthUser();

    this.searchParams = "";
    this.search = {};

    this.state = {
      loading: false,
      searchFormItem: [],
      search: []
    }
  }

  componentWillMount() {

    this.searchParamGet = (key, val, isInt) => {
      if (Array.isArray(val)) {
        if (val.indexOf("1") >= 0) {
          val = "1";
        }
      }
      return val != "" && typeof val !== "undefined" && val != null
        ? isInt ? `${key}:${val},` : `${key}:"${val}",`
        : "";
    };

    this.getMainQueryParam = (page, offset) => {
      let company_id_param = '';
      if (this.props.company_id) {
        company_id_param = `company_id:${this.props.company_id},`;
      }
      let paging_param = "";
      if (page && offset) {
        paging_param = `page:${page}, offset:${offset}`
      }



      let cf_param = "";
      if (this.props.isListAll) {
        if (this.props.filterByCf) {
          cf_param = `cf:"${getCF()}",`
        }
      }

      return `
        ${this.searchParams}
        ${cf_param}
        ${company_id_param}
        user_id:${this.authUser.ID},  
        ${paging_param}`
    }

    this.loadCount = () => {
      var query = `query{
        vacancies_count(${this.getMainQueryParam()})
       }`;

      return graphql(query);
    };

    this.getCountFromRes = (res) => {
      return res.data.data.vacancies_count
    }

    if (this.props.isEnableSearch) {
      this.addSearch();
    }
  }

  searchFormOnSubmit(d) {
    this.search = d;
    this.searchParams = "";

    for (var i in d) {
      if (Array.isArray(d[i])) {
        try {
          d[i] = d[i][0];
        } catch (err) {
          d[i] = "";
        }
      }
    }

    if (d != null) {
      this.searchParams += this.searchParamGet(
        "title",
        d.title
      );
      this.searchParams += this.searchParamGet(
        "company_id",
        d.company_id,
        true // isInt
      );
      this.searchParams += this.searchParamGet(
        "type",
        d.type
      );
      this.searchParams += this.searchParamGet(
        "location",
        d.location
      );
    }

    // this.setState(prevState => {
    //   console.log("setState searchFormOnSubmit", prevState);
    //   console.log("d", d);
    //   return { search: d };
    // });
  }

  loadData(page, offset) {
    // description
    return graphql(`
        query{vacancies(${this.getMainQueryParam(page, offset)}){
                ID
                title
                type
                location 
                company{ img_url, img_position, img_size }
                interested{ID is_interested}
        }}`);
  }
  addSearch() {
    this.setState({ loading: true })

    let q = `query{
      vacancies_distinct(${this.getMainQueryParam()}) {
        _key
        _val
        _label
        _category
      }
    }`;

    const EMPTY_OPTION = { key: "", label: "" }
    graphql(q).then((res) => {
      let data = res.data.data.vacancies_distinct;
      let searchFormItem = [];

      // first saerch field = text
      searchFormItem.push({
        label: "Title",
        name: "title",
        type: "text",
        placeholder: "Engineer"
      })

      let currentKey = null;
      let currentData = [EMPTY_OPTION];
      let currentCategory = "";
      for (var i in data) {
        let d = data[i];
        if (currentKey != d._key) {
          if (currentKey != null) {
            searchFormItem.push({
              label: currentCategory,
              name: currentKey,
              type: "select",
              data: currentData
            });
            currentData = [EMPTY_OPTION];
          }
        }

        currentKey = d._key;
        currentCategory = d._category;
        currentData.push({
          key: d._val, label: d._label
        })
      }
      searchFormItem.push({
        label: currentCategory,
        name: currentKey,
        type: "select",
        data: currentData
      });

      this.setState({ loading: false, searchFormItem: searchFormItem });
    })
  }
  onClickCard(d) {
    layoutActions.storeUpdateFocusCard(d.title, VacancyPopup, {
      id: d.ID,
      isRecThisCompany: this.isRecThisCompany()
    });
  }
  isRecThisCompany() {
    return (
      (isRoleRec() && this.authUser.rec_company == this.props.company_id) ||
      isRoleAdmin()
    );
  }

  renderList(d, i) {
    let com = d.company;
    let img = createImageElement(
      com.img_url,
      com.img_position,
      com.img_size,
      "50px",
      "",
      PCType.COMPANY
    );

    // let isModeCount = this.isRecThisCompany();
    // let isModeAction = isRoleStudent();

    // let interestedBtn = (
    //   <InterestedButton
    //     isModeCount={isModeCount}
    //     isModeAction={isModeAction}
    //     is_interested={d.interested.is_interested}
    //     ID={d.interested.ID}
    //     entity={"vacancies"}
    //     entity_id={d.ID}
    //     tooltipObj={{
    //       arrowPosition: "right",
    //       left: "-110px",
    //       bottom: "-2px",
    //       width: "97px",
    //       tooltip: "Show Interest",
    //       debug: false
    //     }}
    //   ></InterestedButton>
    // );

    // let interestedBtn = (
    //   <InterestedButton
    //     customStyle={{
    //       top: "3px",
    //       left: "7px",
    //       width: "max-content",
    //     }}
    //     customView={
    //       ({
    //         loading,
    //         is_interested,
    //         onClickModeAction
    //       }) => {
    //         let r = null;
    //         if (loading) {
    //           r = <div className="action-item action-loading"><i className="fa fa-spinner fa-pulse left"></i>Loading</div>
    //         } else if (is_interested) {
    //           r = <div className="action-item action-done" onClick={onClickModeAction}><i className="fa fa-check left"></i>Applied</div>
    //         } else {
    //           r = <div className="action-item action-not-done" onClick={onClickModeAction}><i className="fa fa-plus left"></i>Apply</div>
    //         }
    //         return <div className="action">{r}</div>
    //       }
    //     }

    //     isModeCount={isModeCount}
    //     isModeAction={isModeAction}
    //     is_interested={d.interested.is_interested}
    //     ID={d.interested.ID}
    //     entity={"vacancies"}
    //     entity_id={d.ID}
    //   ></InterestedButton>
    // );

    let title = (this.search["title"]) ? d.title.focusSubstring(this.search["title"], "<u>", "</u>") : d.title;
    title = (
      <div
        className="title btn-link"
        onClick={() => {
          this.onClickCard(d);
        }}
        dangerouslySetInnerHTML={{ __html: title }}
      ></div>
    );


    let body = (
      <div className="vacancy-card">
        {getApplyButton(d)}
        <div className="img">{img}</div>
        {title}
        <div className="location">{d.location}</div>
        <div className="type">{d.type ? d.type + " Job" : null}</div>
      </div>
    );


    let minHeight = this.props.isFullWidth ? "unset" : "180px";
    let width = this.props.isFullWidth ? "100%" : "250px";

    return (
      <EmptyCard
        borderRadius={"7px"}
        minHeight={minHeight}
        width={width}
        body={body}
        paramForOnClick={d}
        onClick={null}
      ></EmptyCard>
    );
  }

  getDataFromRes(res) {
    return res.data.data.vacancies;
  }


  render() {

    // kalau list semua
    let countParam = {}
    if (this.props.isListAll) {
      countParam = {
        loadCount: this.loadCount,
        getCountFromRes: this.getCountFromRes
      }
    }

    let isHidePagingTop = false;
    if (this.props.isHidePagingTop) {
      isHidePagingTop = true;
    } else if (this.props.isListAll) {
      isHidePagingTop = false;
    } else {
      isHidePagingTop = true;
    }

    //this.props.isListAll ? false : true

    // return (
    //   <List
    //     {...countParam}
    //     isHidePagingTop={isHidePagingTop}
    //     type="list"
    //     listClass={this.props.listClass}
    //     pageClass="text-right"
    //     getDataFromRes={this.getDataFromRes}
    //     loadData={this.loadData}
    //     hideLoadMore={this.props.limitLoad ? true : false}
    //     offset={this.props.limitLoad ? this.props.limitLoad : this.props.offset}
    //     renderList={this.renderList}
    //   />
    // );

    if (this.state.loading) {
      return <Loader size="2"></Loader>
    } else {
      return (
        <GeneralFormPage
          {...countParam}
          noMutation={true}
          isSearchOnLeft={this.props.isSearchOnLeft}
          searchFormNonPopup={true}
          searchFormItem={this.props.isEnableSearch ? this.state.searchFormItem : null}
          searchFormOnSubmit={this.searchFormOnSubmit}
          isHidePagingTop={isHidePagingTop}
          type="list"
          listClass={this.props.listClass}
          pageClass="text-right"
          getDataFromRes={this.getDataFromRes}
          loadData={this.loadData}
          hideLoadMore={this.props.limitLoad ? true : false}
          offset={this.props.limitLoad ? this.props.limitLoad : this.props.offset}
          renderRow={this.renderList}
        />
      );
    }

  }
}

VacancyList.propTypes = {
  isListAll: PropTypes.bool,
  isEnableSearch: PropTypes.bool,
  filterByCf: PropTypes.bool,
  company_id: PropTypes.number,
  limitLoad: PropTypes.number,
  listClass: PropTypes.string,
  offset: PropTypes.number,
  isFullWidth: PropTypes.bool,
  isHidePagingTop: PropTypes.bool,
};

VacancyList.defaultProps = {
  filterByCf: true,
  isListAll: false,
  listClass: "flex-wrap-start",
  offset: 6,
}
