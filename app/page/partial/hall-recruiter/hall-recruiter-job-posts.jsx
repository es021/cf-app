//Faizul Here

import React from "react";
import { createImageElement, PCType } from "../../../component/profile-card.jsx";
import { getAuthUser, getCF, isRoleAdmin } from "../../../redux/actions/auth-actions";
import * as layoutActions from "../../../redux/actions/layout-actions";
import { isRoleRec, isRoleStudent } from "../../../redux/actions/auth-actions";
import { getAxiosGraphQLQuery } from "../../../../helper/api-helper";
import ListBoard from "../../../component/list-board";
import VacancyPopup from "../popup/vacancy-popup";
import { InterestedButton } from "../../../component/interested.jsx";
import { EmptyCard } from "../../../component/card.jsx";

export default class HallRecruiterJobPosts extends React.Component {
  constructor(props) {
    super(props);
    this.loadData = this.loadData.bind(this);
    this.renderList = this.renderList.bind(this);
    this.getDataFromRes = this.getDataFromRes.bind(this);
    this.onClickCard = this.onClickCard.bind(this);
    this.authUser = getAuthUser();
  }

  loadData(page, offset) {
    // description
    // company{ img_url, img_position, img_size }
    return getAxiosGraphQLQuery(`
        query{vacancies(${this.getMainQueryParam(page, offset)}){
                ID
                title
                type
                location 
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

      // let cf_param = "";
      // if (this.props.isListAll) {
      //   if (this.props.filterByCf) {
      //     cf_param = `cf:"${getCF()}",`
      //   }
      // }
      // ${cf_param}


      return `
        ${company_id_param}
        user_id:${this.authUser.ID},  
        ${paging_param}`
    }

    this.loadCount = () => {
      var query = `query{
        vacancies_count(${this.getMainQueryParam()})
       }`;

      return getAxiosGraphQLQuery(query);
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
    // let com = d.company;
    // let img = createImageElement(
    //   com.img_url,
    //   com.img_position,
    //   com.img_size,
    //   "50px",
    //   "",
    //   PCType.COMPANY
    // );

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
      <div className="vacancy-card-recruiter">
        {interestedBtn}
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

    return body;
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
      <ListBoard
        // {...countParam}
        // hideLoadMore={this.props.limitLoad ? true : false}

        title="Job Posts"
        icon="suitcase"
        appendText={"Load More"}
        loadData={this.loadData}
        getDataFromRes={this.getDataFromRes}
        renderList={this.renderList}
        offset={2}

      // isHidePagingTop={this.props.isListAll ? false : true}
      // type="list"
      // listClass={this.props.listClass}
      // pageClass="text-right"
      // getDataFromRes={this.getDataFromRes}
      // loadData={this.loadData}
      // hideLoadMore={this.props.limitLoad ? true : false}
      // offset={this.props.limitLoad ? this.props.limitLoad : this.props.offset}
      // renderList={this.renderList}
      />
    );
  }
}
