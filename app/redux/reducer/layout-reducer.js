import {getNewState} from './_helper';
import * as layoutAction from '../actions/layout-actions';

const layoutReducerInitState = {
    focusCard: {
        component: null,
        props: null,
        title: null,
        show: false,
        className: null
    }

};

export default function userReducer(state = layoutReducerInitState, action) {

    switch (action.type) {
        case layoutAction.UPDATE_FOCUS_CARD:
        {   
            return getNewState(state, {focusCard:getNewState(state.focusCard, action.payload)});
        }
    }

    return state;
};