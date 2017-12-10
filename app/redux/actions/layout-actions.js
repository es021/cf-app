export const UPDATE_FOCUS_CARD = "UPDATE_FOCUS_CARD";
export function updateFocusCard(title, component, props, className = "") {
    return function (dispatch) {
        dispatch({
            type: UPDATE_FOCUS_CARD,
            payload: {title: title, component: component, props: props, show: true, className: className}
        });
    };
}

export function updateProps(props){
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


import {store} from '../store.js';
export function storeUpdateFocusCard(title, component, props, className = "") {
    store.dispatch(updateFocusCard(title, component, props, className));
}
