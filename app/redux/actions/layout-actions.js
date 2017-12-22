import {store} from '../store.js';

// Block Loader ----------------------------------------------
export const UPDATE_BLOCK_LOADER = "UPDATE_BLOCK_LOADER";
export function hideBlockLoader() {
    return function (dispatch) {
        dispatch({
            type: UPDATE_BLOCK_LOADER,
            payload: {loading: null, success: null, error: null, show: false}
        });
    };
}

function updateBlockLoader(loading, success, error) {
    store.dispatch({
        type: UPDATE_BLOCK_LOADER,
        payload: {loading: loading, success: success, error: error, show: true}
    });
}


export function loadingBlockLoader(m) {
    updateBlockLoader(m, null, null);
}

export function successBlockLoader(m) {
    updateBlockLoader(null, m, null);
}

export function errorBlockLoader(m) {
    updateBlockLoader(null, null, m);
}


// Focus Card ----------------------------------------------
export const UPDATE_FOCUS_CARD = "UPDATE_FOCUS_CARD";
export function updateFocusCard(title, component, props, className = "") {
    return function (dispatch) {
        dispatch({
            type: UPDATE_FOCUS_CARD,
            payload: {title: title, component: component, props: props, show: true, className: className}
        });
    };
}

export function updateProps(props) {
    return function (dispatch) {
        dispatch({
            type: UPDATE_FOCUS_CARD,
            payload: {props: props}
        });
    };
}

export function hideFocusCard() {
    return function (dispatch) {
        dispatch({
            type: UPDATE_FOCUS_CARD,
            payload: {title: null, component: null, props: null, show: false}
        });
    };
}

export function storeHideFocusCard() {
    store.dispatch(hideFocusCard());
}

export function storeUpdateFocusCard(title, component, props, className = "") {
    store.dispatch(updateFocusCard(title, component, props, className));
}
