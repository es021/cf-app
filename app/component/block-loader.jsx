import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as layoutActions from '../redux/actions/layout-actions';
import { store } from '../redux/store';
import { ButtonIcon } from './buttons.jsx';
import { Loader } from './loader';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import {lang} from '../lib/lang';

// require("../css/block-loader.scss");

//state is from redux reducer
// with multiple objects
function mapStateToProps(state, ownProps) {
    return {
        redux: state.layout.blockLoader
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        hideBlockLoader: layoutActions.hideBlockLoader
    }, dispatch);
}


class BlockLoader extends React.Component {
    constructor(props) {
        super(props);
        this.lastUpdate = null;
    }

    componentWillMount() {
        //console.log("componentWillMount", "focus");
    }

    render() {

        var state = this.props.redux;

        var display = (state.show == true) ? "flex" : "none";
        var style = {
            display: display
        };

        var view = null;
        if (state.loading !== null) {
            view = <Loader size="3" text={state.loading}></Loader>;
        } else if (state.success !== null) {
            view = <div><h3 className="text-success"><b>{lang("Success")}</b></h3>{state.success}</div>;
        } else if (state.error !== null) {
            view = <div><h3 className="text-danger"><b>{lang("Request Failed")}</b></h3>{state.error}</div>;
        } else if (state.confirm !== null) {
            view = <div><h4 className="text-primary"><b>{state.confirm.title}</b></h4></div>;
        } else if (state.custom !== null) {
            var title = (typeof state.custom.title !== "string")
                ? state.custom.title
                : <h4 className="text-primary">{state.custom.title}</h4>;

            view = <div>{title}</div>;
        }

        var action = null;

        if (state.success !== null || state.error !== null) {
            var close = <div onClick={() => store.dispatch(layoutActions.hideBlockLoader())}
                className="btn btn-sm btn-default">
                {lang("CLOSE")}
            </div>;
            action = <div><br></br>
                {close}
            </div>;

        } else if (state.confirm !== null) {
            action = <div className="btn-group btn-group-justified">
                <div onClick={state.confirm.yesHandler}
                    className="btn btn-sm btn-blue">
                    {lang("YES")}
                </div>
                <div onClick={() => {
                    store.dispatch(layoutActions.hideBlockLoader());
                    if (state.confirm.noHandler) {
                        state.confirm.noHandler()
                    }
                }}
                    className="btn btn-sm btn-default">
                    {lang("NO")}
                </div>
            </div>;
        } else if (state.custom !== null) {
            let closeLink = null;
            if (state.custom.noClose == false) {
                closeLink = <div style={{ marginTop: "5px" }}>
                    <small>
                        <a onClick={() => store.dispatch(layoutActions.hideBlockLoader())}>
                            {lang("CLOSE")}
                        </a>
                    </small>
                </div>
            }

            if (state.custom.customView !== null) {
                action = <div style={{ width: "100%" }}>
                    {state.custom.customView}
                    <br></br>
                    {closeLink}
                </div>;

            } else {
                action = <div>
                    {(state.custom.href != null) // if href need to make navlink
                        ? <NavLink to={state.custom.href} onClick={() => { store.dispatch(layoutActions.hideBlockLoader()); }}
                            className="btn btn-sm btn-blue">
                            {state.custom.actionText}
                        </NavLink>
                        : (state.custom.actionHandler == null) ? null
                            : <a onClick={() => { // if action handler need to make a onClick
                                if (state.custom.actionHandler) {
                                    state.custom.actionHandler();
                                }
                                store.dispatch(layoutActions.hideBlockLoader());
                            }}
                                className="btn btn-sm btn-blue">
                                {state.custom.actionText}
                            </a>
                    }
                    <br></br>
                    {closeLink}
                </div>;
            }
        }

        //confirm

        var prefix = "bl-";

        var className = `${prefix}content`;

        // add large class to noClose
        try {
            if (state.custom.noClose === true) {
                if (state.custom.small !== true) {
                    className += " large";
                }
            }


        } catch (err) { }

        return (<div style={style} id="block-loader" >
            <div className={className}>
                <div className="">
                    {view}
                </div>
                {action}
            </div>
            <div className={`${prefix}background`}></div>
        </div>);
    }
}


BlockLoader.propTypes = {
    loading: PropTypes.string,
    success: PropTypes.string,
    error: PropTypes.string,
    confirm: PropTypes.obj, // {title, yesHandler, noHandler}
    custom: PropTypes.obj, // {title,actionText, actionHandler,href, noClose}
    show: PropTypes.bool
};

export default connect(mapStateToProps, mapDispatchToProps)(BlockLoader);
