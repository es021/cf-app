import React from 'react';
import PropTypes from 'prop-types';
require('../css/page-sec.scss');

const sec = "page-sec";

export default class PageSection extends React.Component {
    constructor(props){
        super(props);
        this.toggleBody = this.toggleBody.bind(this);
        
        var showBody = true;
        if(this.props.canToggle && !this.props.initShow){
            showBody = false;
        }

        this.state = {
            showBody : showBody
        };

    }
    toggleBody(ev){
        this.setState((prevState)=>{
            return {showBody:!prevState.showBody};
        });
    }
    render() {
        console.log(this.props.title, this.props.canToggle);

        var body = this.props.body;
        if (typeof body === "function") {
            body = React.createElement(body, {});
        }
        const title = (!this.props.canToggle)
        ? <h3 className={`${sec}-title`}>
            {this.props.title}
        </h3> 
        : <h3 onClick={(ev)=>{this.toggleBody(ev)}} className={`${sec}-title`}>
            <a>{this.props.title}</a>
        </h3>;

        return(<div className={`${sec} ${this.props.className}`}>
           {title}
            {(!this.state.showBody) ? null : <div className={`${sec}-body`}>
                {body}
            </div>}
            <div className="line"></div>
        </div>);
    }
}

PageSection.propTypes = {
    title: PropTypes.string.isRequired,
    body: PropTypes.element.isRequired,
    className: PropTypes.oneOf(["left"]),
    canToggle: PropTypes.bool,
    initShow: PropTypes.bool
};

PageSection.defaultProps = {
    canToggle: false,
    initShow: false
}

//                
