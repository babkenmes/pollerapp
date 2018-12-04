/* @flow */

export type UserInfo = {
    user_id:string,
    firstName: string,
    lastName: string,
    username: string;
};

export type UserAuthInfo = {
    username: string;
    password: string;
};

export type UserRegistrationInfo = UserInfo & UserAuthInfo;

export type UserStore = {
    loggedIn: boolean,
    loading: boolean,
    hasError: boolean,
    error: string,
    data: UserInfo,
}