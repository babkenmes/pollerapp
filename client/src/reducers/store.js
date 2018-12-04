/* @flow */

import { createStore, compose, applyMiddleware } from "redux"
import { createLogger } from 'redux-logger'
import rootReducer from "@/reducers";
import { userDataService } from "@/reducers/user"
import { pollDataService } from "@/reducers/poll"

export const appStore = createStore(rootReducer,
    compose(applyMiddleware(
        createLogger(),
        userDataService,
        pollDataService
    ))) 
