/* @flow */

import type { UserAuthInfo, UserInfo, UserRegistrationInfo } from "@/types/User"

type logout_action = { type: "LOGOUT" };
type login_request_action = { type: "LOGIN_REQUEST", payload: { data: UserAuthInfo } };
type login_success_action = { type: "LOGIN_SUCCESS", payload: { data: UserInfo } };
type login_error_action = { type: "LOGIN_ERROR", payload: { error: string } };
type register_action = { type: "REGISTER_REQUEST", payload: { data: UserRegistrationInfo } };

export type userAction = logout_action | login_request_action | login_success_action | login_error_action | register_action;

export const userActionCreators = {

    logout: (): logout_action => {
        return {
            type: "LOGOUT",
        }
    },

    login_request: (authInfo: UserAuthInfo): login_request_action => {
        return {
            type: "LOGIN_REQUEST",
            payload: { data: authInfo }
        }
    },

    login_success: (userInfo: UserInfo): login_success_action => {
        return {
            type: "LOGIN_SUCCESS",
            payload: { data: userInfo }
        }
    },

    login_error: (err: string): login_error_action => {
        return {
            type: "LOGIN_ERROR",
            payload: { error: err }
        }
    },
    register_request: (regInfo: UserRegistrationInfo): register_action => {
        return {
            type: "REGISTER_REQUEST",
            payload: { data: regInfo }
        }
    },
}