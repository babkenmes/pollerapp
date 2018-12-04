/* @flow */
import { UserReducer } from './user'
import { PollReducer } from './poll'
import { AlertReducer } from './alert'

import { combineReducers } from "redux"

export default combineReducers({
    UserStore: UserReducer,
    PollStore: PollReducer,
    AlertStore: AlertReducer,
});