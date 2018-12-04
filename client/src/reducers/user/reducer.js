/* @flow */
import { type userAction } from "@/reducers/user/actions";
import type { UserInfo, UserStore } from "@/types/User"

const userDatString = localStorage.getItem("user")
const userData = userDatString && JSON.parse(userDatString);
const INITIAL_DATA: UserStore = {
    loggedIn: !!userData,
    loading: false,
    hasError: false,
    error: "",
    data: userData ? (userData: UserInfo): { firstName: "", lastName: "", user_id: "", username: "" }
};

export const UserReducer = (state: UserStore = INITIAL_DATA, action: userAction): UserStore => {
    switch (action.type) {
        case "LOGOUT":
            return { ...INITIAL_DATA, data: { firstName: "", lastName: "", user_id: "", username: "" } };
        case "REGISTER_REQUEST":
            return {
                ...state,
                loading: true,
            }
        case "LOGIN_REQUEST":
            return {
                ...state,
                loading: true,
            }
        case "LOGIN_SUCCESS":
            return {
                ...state,
                loggedIn: true,
                data: action.payload.data,
                loading: false,
                hasError: false,
            }
        case "LOGIN_ERROR":
            return {
                ...state,
                loggedIn: false,
                loading: false,
                hasError: true,
                error: action.payload.error
            }
        default:
            return state
    }
}