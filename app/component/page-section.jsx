import React from 'react';
import PropTypes from 'prop-types';
// require('../css/page-sec.scss');

const sec = "page-sec";

export default class PageSection extends React.Component {
    constructor(props) {
        super(props);
        this.toggleBody = this.toggleBody.bind(this);
        this.MAXEST = "999999px";

        var showBody = true;
        if (this.props.canToggle && !this.props.initShow) {
            showBody = false;
        }

        this.state = {
            showBody: showBody,
            maxHeight: this.props.maxHeight
        };

    }
    componentDidMount() {
        if (this.refs.body.clientHeight < this.props.maxHeight) {
            this.setState((prevState) => {
                return { maxHeight: null }
            })
        }
    }
    toggleBody(ev) {
        this.setState((prevState) => {
            return { showBody: !prevState.showBody };
        });
    }
    toggleShowMoreLess() {
        this.setState((prevState) => {
            var newHeight = prevState.maxHeight !== this.MAXEST
                ? this.MAXEST : this.props.maxHeight;
            return { maxHeight: newHeight }
        })
    }
    render() {
        var body = this.props.body;
        if (typeof body === "function") {
            body = React.createElement(body, {});
        }
        let title = (!this.props.canToggle)
            ? <h3 className={`${sec}-title`}>
                {this.props.title}
            </h3>
            : <h3 onClick={(ev) => { this.toggleBody(ev) }} className={`${sec}-title`}>
                <a>{this.props.title}</a>
            </h3>;

        /// override by custom title
        title = this.props.customTitle ? this.props.customTitle : title;

        let showOverflow = this.props.showOverflow ? `${sec}-overflow` : "";

        return (<div className={`${sec} ${this.props.className}`}>
            {title}
            {(!this.state.showBody)
                ? null
                :
                <div className={`${sec}-body ${showOverflow}`} style={{ maxHeight: this.state.maxHeight }} ref="body">
                    {body}
                </div>}
            {this.state.maxHeight === null ? null :
                <div style={{ marginTop: "" }}>
                    <a onClick={() => { this.toggleShowMoreLess() }}>
                        <span><b>{this.state.maxHeight == this.MAXEST ? "See Less" : "See More"}</b></span>
                    </a>
                </div>
            }
            {/* //EUR FIX <div className="line"></div> */}
        </div>);
    }
}

PageSection.propTypes = {
    title: PropTypes.string,
    customTitle: PropTypes.string,
    body: PropTypes.element.isRequired,
    className: PropTypes.oneOf(["left"]),
    canToggle: PropTypes.bool,
    initShow: PropTypes.bool,
    maxHeight: PropTypes.number,
    showOverflow: PropTypes.bool
};

PageSection.defaultProps = {
    canToggle: false,
    initShow: false,
    maxHeight: null,
    showOverflow: false
}

//                
