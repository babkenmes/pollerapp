/* @flow */
import { type userAction } from "@/reducers/user";
import { userActionCreators } from "@/reducers/user";
import { alertActionCreators } from "@/reducers/alert";
import { type MiddlewareAPI, State, Dispatch } from "redux"
import { type UserAuthInfo } from "@/types/User"
import { servicetHelperPOST, servicetHelperGET } from "@/helpers/service"

const api = "/api/auth";
export const userDataService = (store: MiddlewareAPI<State, userAction, Dispatch>) => (next: Dispatch) => (action: userAction) => {
    next(action)
    switch (action.type) {
        case "REGISTER_REQUEST": {
            servicetHelperPOST(`${api}/register`,
                action.payload.data,
                (data) => {
                    localStorage.setItem("token", data.token);
                    store.dispatch(userActionCreators.login_success(data)); localStorage.setItem("user", JSON.stringify(data))
                },
                (err: string) => onError(err,store))
            break;
        }
        case "LOGIN_REQUEST": {
            servicetHelperPOST(`${api}/login`,
                action.payload.data,
                (data) => {
                    localStorage.setItem("token", data.token);
                    servicetHelperGET("/api/auth/userInfo", (data) => {
                        store.dispatch(userActionCreators.login_success(data)); localStorage.setItem("user", JSON.stringify(data))
                    }, (err: string) => onError(err,store))
                },
                (err: string) => onError(err,store))
            break;
        }
        case "LOGOUT": {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
        default:
            break
    }
};

const onError = (error,store)=>{
    store.dispatch(userActionCreators.login_error(error)); 
    store.dispatch(alertActionCreators.error(error));   
}