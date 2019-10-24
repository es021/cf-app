import React, { Component } from "react";
import PropTypes from "prop-types";

export class EmptyCard extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let style = {
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
      <div style={style} className={className}>
        {this.props.body}
      </div>
    );
  }
}

EmptyCard.propTypes = {
  body: PropTypes.object,
  borderRadius: PropTypes.string,
  minHeight: PropTypes.string,
  minWidth: PropTypes.string,
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
