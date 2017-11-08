import { createStore, combineReducers, applyMiddleware} from "redux";
import thunk from 'redux-thunk';
import {logger} from 'redux-logger';
import promise from 'redux-promise-middleware';

/* import all reducer */
import userReducer from './reducer/user-reducer';
import authReducer from './reducer/auth-reducer';
import hallReducer from './reducer/hall-reducer';

const allReducers = {
    user: userReducer,
    auth: authReducer,
    hall: hallReducer
};

const rootReducer = combineReducers(allReducers);

//somehow this order of middleware is important
const middleware = applyMiddleware(promise(), thunk, logger);

export const store = createStore(rootReducer, {}, middleware);


