import {
    store
} from '../store.js';

// Block Loader ----------------------------------------------
export const UPDATE_BLOCK_LOADER = "UPDATE_BLOCK_LOADER";
export function hideBlockLoader() {
    return function (dispatch) {
        dispatch({
            type: UPDATE_BLOCK_LOADER,
            payload: {
                loading: null,
                success: null,
                error: null,
                confirm: null,
                custom: null,
                show: false
            }
        });
    };
}

export function storeHideBlockLoader() {
    store.dispatch(hideBlockLoader());
}

function updateBlockLoader(loading, success, error, confirm, custom) {
    store.dispatch({
        type: UPDATE_BLOCK_LOADER,
        payload: {
            loading: loading,
            success: success,
            error: error,
            confirm: confirm,
            custom: custom,
            show: true
        }
    });
}


export function loadingBlockLoader(m) {
    updateBlockLoader(m, null, null, null, null);
}

export function successBlockLoader(m) {
    updateBlockLoader(null, m, null, null, null);
}

export function errorBlockLoader(m) {
    updateBlockLoader(null, null, m, null, null);
}

export function confirmBlockLoader(title, yesHandler, noHandler) {
    updateBlockLoader(null, null, null, {
        title: title,
        yesHandler: yesHandler,
        noHandler: noHandler,
    }, null);
}

export function customBlockLoader(title, actionText, actionHandler, href, noClose = false, customView = null, small = false) {
    updateBlockLoader(null, null, null, null, {
        title: title,
        actionText: actionText,
        actionHandler: actionHandler,
        href: href,
        noClose: noClose,
        customView: customView,
        small: small
    });
}

export function customViewBlockLoader(title, customView, noClose = false) {
    customBlockLoader(title, null, null, null, noClose, customView);
}
export function customViewBlockLoaderSmall(title, customView, noClose = false) {
    customBlockLoader(title, null, null, null, noClose, customView, true);
}


// Focus Card ----------------------------------------------
export const PREVIOUS_FOCUS_CARD = "PREVIOUS_FOCUS_CARD";

export function previousFocusCard() {
    return function (dispatch) {
        dispatch({
            type: PREVIOUS_FOCUS_CARD,
            payload: {}
        });
    };
}

export const UPDATE_FOCUS_CARD = "UPDATE_FOCUS_CARD";
export function updateFocusCard(title, component, props, className = "", onClose = null) {
    return function (dispatch) {
        dispatch({
            type: UPDATE_FOCUS_CARD,
            payload: {
                title: title,
                component: component,
                props: props,
                show: true,
                onClose: onClose,
                className: className
            }
        });
    };
}

export function updateProps(props) {
    return function (dispatch) {
        dispatch({
            type: UPDATE_FOCUS_CARD,
            payload: {
                props: props
            }
        });
    };
}

export function storeUpdateProps(props) {
    store.dispatch(updateProps(props));
}

export function hideFocusCard() {
    return function (dispatch) {
        dispatch({
            type: UPDATE_FOCUS_CARD,
            payload: {
                title: null,
                component: null,
                props: null,
                show: false
            }
        });
    };
}

export function storeHideFocusCard() {
    store.dispatch(hideFocusCard());
}

export function storeUpdateFocusCard(title, component, props, className = "", onClose = null) {
    store.dispatch(updateFocusCard(title, component, props, className, onClose));
}