import {getNewState} from './_helper';
import * as userAction from '../actions/user-actions';

const userReducerInitState = {
    data: [],
    fetching: false,
    error: null
};

export default function userReducer(state = userReducerInitState, action) {
    switch (action.type) {
        case userAction.FETCH_USER + '_PENDING':
        {
            return getNewState(state, {
                fetching: true
            });
        }
        case userAction.FETCH_USER + '_FULFILLED':
        {
            return getNewState(state, {
                fetching: false,
                data: action.payload.data.data
            });
        }
        case userAction.FETCH_USER + '_REJECTED':
        {
            return getNewState(state, {
                fetching: false,
                error: action.payload.message
            });
        }
    }

    return state;
};