import { createStore, combineReducers, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import {logger} from "redux-logger";
import promise from "redux-promise-middleware";

/* import all reducer */
import userReducer from "./reducer/user-reducer";
import authReducer from "./reducer/auth-reducer";
import generalReducer from "./reducer/general-reducer";
import hallReducer from "./reducer/hall-reducer";
import layoutReducer from "./reducer/layout-reducer";

const allReducers = {
	general : generalReducer,
	user: userReducer,
	auth: authReducer,
	hall: hallReducer,
	layout: layoutReducer
};

const rootReducer = combineReducers(allReducers);

//somehow this order of middleware is important
const middleware = applyMiddleware(promise(), thunk, logger);

export const store = createStore(rootReducer, {}, middleware);


