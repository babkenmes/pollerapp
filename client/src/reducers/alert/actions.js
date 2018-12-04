/* @flow */

type success = { type: "ALERT/SUCCESS", message: string };
type error = { type: "ALERT/ERROR", message: string };
type clear = { type: "ALERT/CLEAR" };
export type Action = clear | error | success;
export const alertActionCreators = {

    success: (message: string): success => {
        return { type: "ALERT/SUCCESS", message };
    },

    error: (message: string): error => {
        return { type: "ALERT/ERROR", message };
    },

    clear: (): clear => {
        return { type: "ALERT/CLEAR" };
    },

}
