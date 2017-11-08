import axios from 'axios';

export const DO_LOGIN = "DO_LOGIN";
export function login(username, password) {
    return function (dispatch) {
        dispatch({
            type: DO_LOGIN,
            payload: axios.get("https://jsonplaceholder.typicode.com/users")
        });
    };
}

export const DO_LOGOUT = "DO_LOGOUT";
export function logout() {
    return function (dispatch) {
        dispatch({
            type: DO_LOGOUT
        });
    };
}
