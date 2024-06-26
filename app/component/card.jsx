import React, { Component } from "react";
import PropTypes from "prop-types";

export class EmptyCard extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let style = {
      padding: this.props.padding,
      minWidth: this.props.minWidth,
      minHeight: this.props.minHeight,
      height: this.props.height,
      width: this.props.width,
      borderRadius: this.props.borderRadius
    };

    let className = "card empty-card";
    if (this.props.onClick != null) {
      className += " clickable ";
    }
    return (
      <div style={style}
        className={className}
        onClick={() => {
          if (this.props.onClick) {
            this.props.onClick(this.props.paramForOnClick)
          }
        }}>
        {this.props.body}
      </div>
    );
  }
}

EmptyCard.propTypes = {
  paramForOnClick: PropTypes.object,
  body: PropTypes.object,
  borderRadius: PropTypes.string,
  minHeight: PropTypes.string,
  minWidth: PropTypes.string,
  padding: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string,
  onClick: PropTypes.func
};
EmptyCard.defaultProps = {
  onClick: null
};

// export  class EmptyCard extends React.Component {
//   constructor(props) {
//     super(props);
//   }
//   render() {
//   }
// }

// EmptyCard.propTypes = {
// };
// EmptyCard.defaultProps = {
// };
