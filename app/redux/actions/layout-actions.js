export const UPDATE_FOCUS_CARD = "UPDATE_FOCUS_CARD";
export function updateFocusCard(component,props) {
    return function (dispatch) {
        dispatch({
            type: UPDATE_FOCUS_CARD,
            payload: {component:component,props:props,show:true}
        });
    };
}

export function hideFocusCard() {
    return function (dispatch) {
        dispatch({
            type: UPDATE_FOCUS_CARD,
            payload: {component:null, props:null, show:false}
        });
    };
}
