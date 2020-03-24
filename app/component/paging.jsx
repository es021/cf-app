import React, { Component } from "react";
import PropTypes from "prop-types";
import { getAxiosGraphQLQuery } from "../../helper/api-helper";
import { ButtonLink } from "./buttons";


// Ask a Question style instagram
export default class Paging extends Component {
  constructor(props) {
    super(props);

  }

  componentWillMount() { }
  debug() {
    return <div>
      currentPage : {this.props.currentPage}<br></br>
      currentPage : {this.props.currentPage}<br></br>
      totalInPage : {this.props.totalInPage}<br></br>
      total : {this.props.total}<br></br>
      offset : {this.props.offset}<br></br>
      pagingLimit : {this.pagingLimit()}<br></br>
      totalPage : {this.totalPage()}<br></br>
      middleIndex : {this.middleIndex()}<br></br>
      hasTotal : {this.props.hasTotal ? "yes" : "no"}<br></br>
      isFirstPage : {this.isFirstPage() ? "yes" : "no"}<br></br>
      isLastPage : {this.isLastPage() ? "yes" : "no"}<br></br>
      isThresholdFront : {this.isThresholdFront() ? "yes" : "no"}<br></br>
      isThresholdBack : {this.isThresholdBack() ? "yes" : "no"}<br></br>
    </div>
  }

  totalPage() {
    let remainder = this.props.total % this.props.offset
    let totalPage = Math.floor(this.props.total / this.props.offset) + (remainder > 0 ? 1 : 0)
    return totalPage;
  }

  middleIndex() {
    return Math.ceil(this.pagingLimit() / 2)
  }
  isThresholdFront() {
    return this.props.currentPage <= this.middleIndex();
  }
  isThresholdBack() {
    return this.props.currentPage > (this.totalPage() - this.pagingLimit() / 2)
  }
  pagingLimit() {
    return this.props.pagingLimit > this.totalPage() ? this.totalPage() : this.props.pagingLimit;
  }
  isFirstPage() {
    return this.props.currentPage == 1;
  }
  isLastPage() {
    return this.props.currentPage == this.totalPage();
  }
  currentPage() {
    return Number.parseInt(this.props.currentPage);
  }
  total() {
    return this.props.total;
  }
  offset() {
    return this.props.offset;
  }
  viewPrev() {
    let prevView =
      this.currentPage() > 1 ? (
        <div className="pg-btn"
          onClick={this.props.onClickPrev}
        >{"<< Prev"}</div>
      ) : null;

    return prevView;


  }
  viewNext() {
    let nextView = (this.props.totalInPage >= this.offset())
      ? (
        <div className="pg-btn"
          onClick={this.props.onClickNext}
        >{"Next >>"}</div>
      ) : null;

    // remove next kalau dah page last
    if (this.total() && this.endCount() >= this.total()) {
      nextView = null;
    }
    return nextView;

  }
  startCount() {
    let startCount = (this.currentPage() - 1) * this.offset() + 1;
    return startCount;
  }
  endCount() {
    let endCount = this.currentPage() * this.offset();
    endCount = endCount > this.total() ? this.total() : endCount;
    return endCount;
  }
  viewPage() {
    if (!this.props.hasTotal) {
        return <b>Page {this.currentPage()}</b>
    }

    let arr = [];
    if (this.isFirstPage() || this.isThresholdFront()) {
      let offset = 0;
      for (let i = 1; i <= this.pagingLimit(); i++) {
        arr.push(1 + offset);
        offset++;
      }
    }
    else if (this.isLastPage() || this.isThresholdBack()) {
      let offset = 0;
      for (let i = this.pagingLimit(); i >= 1; i--) {
        arr.unshift(this.totalPage() - offset);
        offset++;
      }
    }
    else {
      let offset = 1;
      // left side
      for (let i = this.middleIndex(); i > 1; i--) {
        arr.unshift(this.currentPage() - offset);
        offset++;
      }

      // right side
      offset = 0;
      for (let i = this.middleIndex(); i <= this.pagingLimit(); i++) {
        arr.push(this.currentPage() + offset);
        offset++;
      }

    }


    let r = arr.map((d, i) => {
      let className = "pg-btn";
      className += d == this.currentPage() ? " active" : ""
      return <li data-page={d} className={className} onClick={(e) => { this.onClickPage(e) }}>
        {d}
      </li>
    })

    return <ul>{r}</ul>;
  }

  onClickPage(e) {
    let page = e.currentTarget.dataset.page;
    this.props.onClickPage(page);
  }
  viewCount() {
    return <div>{this.startCount()} - {this.endCount()} of {this.total()}</div>
  }
  render() {
    if (this.props.hasTotal && this.totalPage() <= 1) {
      return <div className="paging"></div>;
    }

    return <div className="paging">
      {/* <div className="pg-count">
        {this.viewCount()}
      </div> */}
      {/* {this.debug()} */}
      <div className="pg-btn-items">
        <div className="pg-prev pg-arrow">
          {this.viewPrev()}
        </div>
        <div className="pg-page">
          {this.viewPage()}
        </div>
        <div className="pg-next pg-arrow">
          {this.viewNext()}
        </div>
      </div>
    </div>
  }
}

Paging.propTypes = {
  totalInPage: PropTypes.number,
  currentPage: PropTypes.number,
  offset: PropTypes.number,
  total: PropTypes.number.isRequired,
  hasTotal: PropTypes.bool,

  pagingLimit: PropTypes.number,
  onClickPage: PropTypes.func,
  onClickPrev: PropTypes.func,
  onClickNext: PropTypes.func,
};

Paging.defaultProps = {
  pagingLimit: 10
};
