import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as layoutActions from '../redux/actions/layout-actions';
import {store} from '../redux/store';
import {ButtonIcon} from './buttons';

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
        updateFocusCard: layoutActions.updateFocusCard,
        hideFocusCard: layoutActions.hideFocusCard
    }, dispatch);
}


class FocusCard extends React.Component {
    constructor(props) {
        super(props);
        this.lastUpdate = null;
    }

    componentWillMount() {
        console.log("componentWillMount", "focus");
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

        var display = (this.props.redux.focusCardShow) ? "initial" : "none";
        var style = {
            display: display
        };
        
        return(<div style={style} id="focus-card">
            <ButtonIcon onClick={() => store.dispatch(layoutActions.hideFocusCard())} size="md" icon="close"></ButtonIcon>
            <h3>Card Title</h3>
            {component}
        </div>);

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FocusCard);
