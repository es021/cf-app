import React from "react";
import PropTypes from "prop-types";

require('../css/toogle-timezone.scss');

export default class ToogleTimezone extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}
  render() {
    return (
      <div>
        <label className="app-switch">
          <input type="checkbox" />
          <span className="as-slider round">
            <div className="as-text-container">
              <div className="as-text text-left">Left</div>
              <div className="as-text text-right">Right</div>
            </div>
          </span>
        </label>
      </div>
    );
  }
}

ToogleTimezone.propTypes = {
  aaaa: PropTypes.string.isRequired,
};

ToogleTimezone.defaultProps = {
  
};

