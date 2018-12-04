/* @flow */
import React from 'react';
import { userActionCreators } from '@/reducers/user';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import type { Store } from "@/types/Store"
import type { UserStore } from "@/types/User"
import { Route, Redirect, Component } from 'react-router-dom';

type Props = {
    rest: any,
    UserStore: UserStore,
    redirectPath: string,
};

class PrivateRoute extends React.Component<Props> {
    constructor(props) {
        super(props);
    }

    render() {
        const { redirectPath } = this.props;
        return (<Route exact path="/" {...this.props.rest} render={props => (
            this.props.UserStore && this.props.UserStore.loggedIn
                ? <Component {...props} />
                : <Redirect to={{ pathname: redirectPath, state: { from: props.location } }} />
        )} />)
            ;
    }
}

function mapStateToProps(state: Store) {
    const { UserStore } = state;
    return { UserStore };
}

const connectedComponent = connect(mapStateToProps)(PrivateRoute);
export { connectedComponent as PrivateRoute }; 