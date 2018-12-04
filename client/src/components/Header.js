/* @flow */
import React from 'react';
import { Router, Route, Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActionCreators } from '@/reducers/user';

import type { UserStore } from "@/types/User"
import type { Store } from "@/types/Store"

import { history } from "@/helpers/history";

type Props = {
    UserStore: UserStore,
    dispatch: any,
}
class Header extends React.Component<Props> {
    constructor(props) {
        super(props);
        (this: any).logout = this.logout.bind(this);
    }
    logout() {
        this.props.dispatch(userActionCreators.logout());
    }
    render() {
        const { UserStore, UserStore: { data: { firstName, lastName }, loggedIn } } = this.props;
        const fullName = `${firstName} ${lastName}`

        return (
            <div className="container">
                <div className="col-sm-12">
                    {loggedIn && <Link to="/create-poll" className="btn btn-link">Create Poll</Link>}
                    <Link to="/polls" className="btn btn-link">Polls</Link>
                    <div className="pull-right">
                        {loggedIn && <span className="user-info">{fullName}</span>}
                        {
                            loggedIn ?
                                <div onClick={this.logout} className="btn btn-link">Logout</div>
                                : <Link to="/login" className="btn btn-link">Login</Link>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: Store) {
    const { UserStore } = state;
    return {
        UserStore
    };
}

const connectedComponent = connect(mapStateToProps)(Header);
export { connectedComponent as Header }; 