import React, { Component } from 'react';
import { getAxiosGraphQLQuery } from '../../../../helper/api-helper';
import obj2arg from 'graphql-obj2arg';
import { Loader } from '../../../component/loader';
import PropTypes from 'prop-types';
import { SessionRating, SessionRatingEnum } from '../../../../config/db-config';
import * as layoutActions from '../../../redux/actions/layout-actions';

require("../../../css/session-note.scss");

export default class SessionRatingsSection extends React.Component {
    constructor(props) {
        super(props);
        this.getItemView = this.getItemView.bind(this);
        this.loadData = this.loadData.bind(this);
        this.onClickStar = this.onClickStar.bind(this);

        this.LIMIT_STAR = 5;
        this.DEFAULT_ID = -1;

        var initData = {};
        SessionRatingEnum.categories.map((cat, i) => {
            initData[cat] = { rating: 0, ID: this.DEFAULT_ID }
        });

        this.state = {
            loading: true,
            data: initData
        }
    }

    componentWillMount() {
        this.loadData();
    }

    loadData() {
        var query = `query{session_ratings(session_id:${this.props.session_id}) {ID category rating} }`;
        getAxiosGraphQLQuery(query).then((res) => {
            var data = res.data.data.session_ratings;
            this.setState((prevState) => {
                data.map((d, i) => {
                    prevState.data[d.category] = { rating: d.rating, ID: d.ID };
                });
                return { data: prevState.data, loading: false };
            });

        });
    }

    onClickStar(category, ID, star) {
        layoutActions.loadingBlockLoader("Please Wait..");
        var query = `query{session_ratings(session_id:${this.props.session_id}) {ID category rating} }`;

        var query = null;
        var key = null;

        if (ID == this.DEFAULT_ID) {
            var ins = {};
            ins[SessionRating.SESSION_ID] = this.props.session_id;
            ins[SessionRating.REC_ID] = this.props.rec_id;
            ins[SessionRating.STUDENT_ID] = this.props.student_id;
            ins[SessionRating.CATEGORY] = category;
            ins[SessionRating.RATING] = star;

            query = `mutation{add_session_rating(${obj2arg(ins, { noOuterBraces: true })})
                    {ID category rating}}`;
            key = "add_session_rating";

        }
        // update
        else {
            var upd = {};
            upd[SessionRating.ID] = ID;
            upd[SessionRating.RATING] = star;
            query = `mutation{edit_session_rating(${obj2arg(upd, { noOuterBraces: true })})
                    {ID category rating}}`;

            key = "edit_session_rating";
        }

        getAxiosGraphQLQuery(query).then((res) => {
            layoutActions.storeHideBlockLoader();
            var d = res.data.data[key];
            this.setState((prevState) => {
                prevState.data[d.category] = { rating: d.rating, ID: d.ID };
                return { data: prevState.data };
            });
        });
    }

    getItemView(d, category) {
        // if not exist in config then dont show
        if (SessionRatingEnum.categories.indexOf(category) <= -1) {
            return null;
        }

        var stars = [];
        for (var i = 1; i <= this.LIMIT_STAR; i++) {
            var className = "fa fa-star";
            if (i <= d.rating) {
                className += " starred";
            }
            stars.push(<i data-star={i} data-category={category} data-ID={d.ID}
                onClick={this.onClickStar.bind(null, category, d.ID, i)}
                className={className}></i>);
        }
        return <tr>
            <td className="text-right">
                <small>{category}</small>
            </td>
            <td>
                <div className="star_rating_dummy">
                    {stars}
                </div>
            </td>
        </tr>


    }

    render() {
        var view = <Loader size="2"></Loader>;

        if (!this.state.loading) {
            view = [];
            for (var category in this.state.data) {
                var d = this.state.data[category];
                view.push(this.getItemView(d, category));
            }

        }

        return <div className="star_rating">
            <div style={{ marginBottom: "10px" }}><b>Rate This Student</b></div>
            <table style={{ margin: "auto" }}>
                {view}
            </table>
        </div>;
    }

}

SessionRatingsSection.PropTypes = {
    session_id: PropTypes.number.isRequired,
    rec_id: PropTypes.number.isRequired,
    student_id: PropTypes.number.isRequired
};


/*
 jQuery(document).ready(function () {
 var star_rating = jQuery(".star_rating");
 var star = star_rating.find(".fa-star");
 
 star.click(function () {
 star.removeClass("starred");
 
 var dom = jQuery(this);
 var num = Number(dom.attr("id"));
 
 for (var i = 1; i <= num; i++) {
 star_rating.find("#" + i).addClass("starred");
 }
 
 var params = {};
 params["action"] = "wzs21_update_db";
 params["table"] = "sessions";
 params["ID"] = "83";
 params["rating"] = num;
 
 jQuery.ajax({
 url: ajaxurl,
 type: "POST",
 data: params,
 success: function (res) {
 res = JSON.parse(res);
 console.log(res);
 if (res.status === "Success") {
 //var title = "Thank you for your feedback";
 //var body = "Your response successfully recorded";
 //popup.openPopup(title, body);
 } else {
 failResponse();
 }
 },
 error: function (err) {
 failResponse();
 }
 });
 
 function failResponse() {
 var title = "Something went wrong";
 var body = "Your response failed to be submitted.<br>Please try again later";
 popup.openPopup(title, body, true);
 }
 
 });
 });
 */