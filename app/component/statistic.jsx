import React, { Component } from "react";
import PropTypes from "prop-types";

export class StatisticFigure extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() { }

  render() {
    return <div className="statistic">
      <div className="st-icon" style={{ background: this.props.color }}><i className={`fa fa-${this.props.icon}`}></i></div>
      <div className="st-body">
        <div className="st-title" style={{ color: this.props.valueColor }}>{this.props.title}</div>
        <div className="st-value" style={{ color: this.props.valueColor }}>{this.props.value}</div>
      </div>
      {
        !this.props.footer
          ? null
          : <div className="st-footer">{this.props.footer}</div>
      }
    </div>
  }
}

StatisticFigure.propsType = {
  title: PropTypes.string,
  value: PropTypes.string,
  valueColor: PropTypes.string,
  icon: PropTypes.string,
  color: PropTypes.string,
  footer: PropTypes.any,
};

StatisticFigure.defaultProps = {
  icon: "mdi-home",
  color: "grey",
};
