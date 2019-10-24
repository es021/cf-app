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
      width: this.props.width
    };
    return (
      <div style={style} className="card empty-card">
        {this.props.body}
      </div>
    );
  }
}

EmptyCard.propTypes = {
  body: PropTypes.object,
  minHeight: PropTypes.string,
  minWidth: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
};
EmptyCard.defaultProps = {};

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
