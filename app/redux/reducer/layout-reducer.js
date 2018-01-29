import { getNewState } from './_helper';
import * as layoutAction from '../actions/layout-actions';

const layoutReducerInitState = {
    focusCardPrevious: [],
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
        custom: null,
        show: false
    }
};

export default function layoutReducer(state = layoutReducerInitState, action) {
    switch (action.type) {
        case layoutAction.UPDATE_FOCUS_CARD:
            {
                var newState = {};
                newState["focusCard"] = getNewState(state.focusCard, action.payload);

                //push to previous
                if (state.focusCard.component !== null) {
                    var prev = getNewState(state.focusCard, {});
                    state.focusCardPrevious.push(prev);
                    newState["focusCardPrevious"] = state.focusCardPrevious;
                }
                //clear the previous    
                else {
                    newState["focusCardPrevious"] = [];
                }

                return getNewState(state, newState);
            }

        case layoutAction.PREVIOUS_FOCUS_CARD:
            {
                var newState = {};
                newState["focusCard"] = state.focusCardPrevious.pop();
                newState["focusCardPrevious"] = state.focusCardPrevious;

                return getNewState(state, newState);
            }

        case layoutAction.UPDATE_BLOCK_LOADER:
            {
                return getNewState(state, { blockLoader: getNewState(state.blockLoader, action.payload) });
            }
    }

    return state;
};