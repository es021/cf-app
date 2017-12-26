import React from 'react';

import {connect}from 'react-redux';
import {bindActionCreators} from 'redux';
import * as layoutActions from '../redux/actions/layout-actions';
import {store} from '../redux/store';
import {ButtonIcon} from './buttons';
import {Loader} from './loader';
import PropTypes from 'prop-types';

require("../css/block-loader.scss");

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
            view = <div><h4 className="text-success">Success!</h4>{state.success}</div>;
        } else if (state.error !== null) {
            view = <div><h4 className="text-danger">Request Failed</h4>{state.error}</div>;
        } else if (state.confirm !== null) {
            view = <div><h4 className="text-primary">{state.confirm.title}</h4></div>;
        }



        var action = null;

        if (state.success !== null || state.error !== null) {
            var close = <div onClick={() => store.dispatch(layoutActions.hideBlockLoader())}  
                 className="btn btn-sm btn-primary">
                CLOSE
            </div>;
            action = <div><br></br>
                {close}
            </div>;

        } else if (state.confirm !== null) {
            var style = {margin: "10px"};
            action = <div style={style} className="btn-group btn-group-justified">
                <div onClick={state.confirm.yesHandler}  
                     className="btn btn-sm btn-primary">
                    CONFIRM
                </div>
                <div onClick={() => store.dispatch(layoutActions.hideBlockLoader())}  
                     className="btn btn-sm btn-default">
                    CANCEL
                </div>
            </div>;
        }

        //confirm

        var prefix = "bl-";
        return(<div style={style} id="block-loader" >
            <div className={`${prefix}content`}>  
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
    confirm: PropTypes.obj, // {title, yesHandler}
    show: PropTypes.bool
};

export default connect(mapStateToProps, mapDispatchToProps)(BlockLoader);
