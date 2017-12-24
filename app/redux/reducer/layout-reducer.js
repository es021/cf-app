import {getNewState} from './_helper';
import * as layoutAction from '../actions/layout-actions';

const layoutReducerInitState = {
    focusCard: {
        component: null,
        props: null,
        title: null,
        show: false,
        className: null
    },
    blockLoader: {
        loading: null,
        success: null,
        error: null,
        confirm: null,
        show: false
    }
};

export default function layoutReducer(state = layoutReducerInitState, action) {
    console.log(action.type);
    switch (action.type) {
        case layoutAction.UPDATE_FOCUS_CARD:
        {
            return getNewState(state, {focusCard: getNewState(state.focusCard, action.payload)});
        }
        case layoutAction.UPDATE_BLOCK_LOADER:
        {
            return getNewState(state, {blockLoader: getNewState(state.blockLoader, action.payload)});
        }
    }

    return state;
};