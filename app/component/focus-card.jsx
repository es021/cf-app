import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as layoutActions from '../redux/actions/layout-actions';
import { store } from '../redux/store';
import { ButtonIcon } from './buttons';
import PropTypes from 'prop-types';

require("../css/focus-card.scss");

//state is from redux reducer
// with multiple objects
function mapStateToProps(state, ownProps) {
    return {
        focusCard: state.layout.focusCard,
        focusCardPrevious: state.layout.focusCardPrevious
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateFocusCard: layoutActions.updateFocusCard,
        hideFocusCard: layoutActions.hideFocusCard,
        previousFocusCard: layoutActions.previousFocusCard
    }, dispatch);
}


class FocusCard extends React.Component {
    constructor(props) {
        super(props);
        this.lastUpdate = null;
    }

    componentWillMount() {
        //console.log("componentWillMount", "focus");
    }

    render() {

        var focus = this.props.focusCard;
        //console.log("render focus card");
        //console.log(focus.props);

        var component = null;
        if (focus.component !== null) {

            //this to force the child component to re-render
            focus.props["key"] = (new Date()).getTime();
            component = React.createElement(focus.component, focus.props);
        }
        //console.log(focus);
        //console.log(focus.show);
        //var display = (focus.show == true) ? "flow-root" : "none";
        var display = (focus.show == true) ? "block" : "none";
        var style = {
            display: display
        };


        var fc = "fc-";

        // get previous btn
        var prev = this.props.focusCardPrevious;
        var prevBtn = (prev.length <= 0) ? null :
            <div className={`${fc}previous-btn`}>
                <a
                    onClick={() => store.dispatch(layoutActions.previousFocusCard())}
                    size="18px" ><i className="fa fa-arrow-left left"></i>
                    {prev[prev.length - 1].title}
                </a>
            </div>;

        return (<div style={style} id="focus-card" className={focus.className}>
            <div className={`${fc}content`}>
                <div className={`${fc}header${(prev.length > 0) ? " previous" : ""}`}>
                    {prevBtn}
                    <div className={`${fc}close-btn`}>
                        <ButtonIcon
                            onClick={() => store.dispatch(layoutActions.hideFocusCard())}
                            size="18px" icon="close"></ButtonIcon>
                    </div>
                    <div className={`${fc}title`}>
                        {focus.title}
                    </div>
                </div>
                <div className={`${fc}body`}>
                    {component}
                </div>
            </div>
            <div onClick={() => store.dispatch(layoutActions.hideFocusCard())}
                className={`${fc}background`}></div>
        </div>);
    }
}


FocusCard.propTypes = {
    title: PropTypes.string,
    component: PropTypes.func,
    props: PropTypes.object,
    show: PropTypes.bool,
    className: PropTypes.oneOf(["small"])
};


export default connect(mapStateToProps, mapDispatchToProps)(FocusCard);
