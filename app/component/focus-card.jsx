import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as layoutActions from '../redux/actions/layout-actions';

require("../css/focus-card.css");

//state is from redux reducer
// with multiple objects
function mapStateToProps(state, ownProps) {
    return {
        redux: state.layout
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateFocusCard: layoutActions.updateFocusCard
    }, dispatch);
}


class FocusCard extends React.Component {
    constructor(props) {
        super(props);
        this.lastUpdate = null;
    }

    componentWillMount() {
        //console.log("FocusCard", "componentWillMount");
    }

    render() {
        var focusCardComponent = this.props.redux.focusCardComponent;
        var component = null;

        if (focusCardComponent !== null) {
            var props = this.props.redux.focusCardProps;
            //this to force the child component to re-render
            props["key"] = (new Date()).getTime();
            component = React.createElement(focusCardComponent, props);
        }

        return(<div id="focus-card">
            {component}
        </div>);

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FocusCard);
