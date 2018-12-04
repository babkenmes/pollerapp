/* @flow */

import type { AlertStore } from "@/types/Alert"
import { type Action } from "@/reducers/alert/actions";

const INITIAL_DATA: AlertStore = {
    isActive: false
};

export const AlertReducer = (state: AlertStore = INITIAL_DATA, action: Action): AlertStore => {
    switch (action.type) {
        case "ALERT/SUCCESS":
            return {
                isActive: true,
                type: 'alert-success',
                message: action.message
            };
        case "ALERT/ERROR":
            return {
                isActive: true,
                type: 'alert-danger',
                message: action.message
            };
        case "ALERT/CLEAR":
            return {
                isActive: false
            };
        default:
            return state
    }
}
export default AlertReducer