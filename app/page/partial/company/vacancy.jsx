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

export class VacancyList extends React.Component {
  constructor(props) {
    super(props);
    this.loadData = this.loadData.bind(this);
    this.renderList = this.renderList.bind(this);
    this.onClickCard = this.onClickCard.bind(this);
    this.authUser = getAuthUser();
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

  componentWillMount() {

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

    let isModeCount = this.isRecThisCompany();
    let isModeAction = isRoleStudent();

    let interestedBtn = (
      <InterestedButton
        isModeCount={isModeCount}
        isModeAction={isModeAction}
        ID={d.interested.ID}
        is_interested={d.interested.is_interested}
        entity={"vacancies"}
        entity_id={d.ID}
        tooltipObj={{
          arrowPosition: "right",
          left: "-110px",
          bottom: "-2px",
          width: "97px",
          tooltip: "Show Interest",
          debug: false
        }}
      ></InterestedButton>
    );

    let body = (
      <div className="vacancy-card">
        {interestedBtn}
        <div className="img">{img}</div>
        <div
          className="title btn-link"
          onClick={() => {
            this.onClickCard(d);
          }}
        >
          {d.title}
        </div>
        <div className="location">{d.location}</div>
        <div className="type">{d.type ? d.type + " Job" : null}</div>
      </div>
    );

    return (
      <EmptyCard
        borderRadius={"7px"}
        minHeight={"180px"}
        width={"250px"}
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

    return (
      <List
        {...countParam}
        isHidePagingTop={this.props.isListAll ? false : true}
        type="list"
        listClass={this.props.listClass}
        pageClass="text-right"
        getDataFromRes={this.getDataFromRes}
        loadData={this.loadData}
        hideLoadMore={this.props.limitLoad ? true : false}
        offset={this.props.limitLoad ? this.props.limitLoad : this.props.offset}
        renderList={this.renderList}
      />
    );
  }
}

VacancyList.propTypes = {
  filterByCf: PropTypes.bool,
  isListAll: PropTypes.bool,
  company_id: PropTypes.number,
  limitLoad: PropTypes.number,
  listClass: PropTypes.string,
  offset: PropTypes.number,
};

VacancyList.defaultProps = {
  filterByCf: true,
  isListAll: false,
  listClass: "flex-wrap-start",
  offset: 6,
}
