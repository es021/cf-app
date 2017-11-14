import {getNewState} from './_helper';
import * as layoutAction from '../actions/layout-actions';

const layoutReducerInitState = {
    focusCardComponent : null,
    focusCardProps : null
};

export default function userReducer(state = layoutReducerInitState, action) {
    switch (action.type) {
        case layoutAction.UPDATE_FOCUS_CARD:
        {
            return getNewState(state, {
                focusCardComponent: action.payload.component,
                focusCardProps: action.payload.props
            });
        }
    }

    return state;
};