/* @flow */
import React from 'react';
import { userActionCreators } from '@/reducers/user';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import type { Store } from "@/types/Store"
import type { UserStore } from "@/types/User"

type Props = {
    UserStore: UserStore
};

class Home extends React.Component<Props> {
    constructor(props) {
        super(props);
    }
    render() {
        const fullName = this.props.UserStore && this.props.UserStore.data && `${this.props.UserStore.data.firstName} ${this.props.UserStore.data.lastName}`
        return (
            <span>{
            }</span>
        );
    }
}

function mapStateToProps(state: Store) {
    const { UserStore } = state;
    return { UserStore };
}

const connectedHome = connect(mapStateToProps)(Home);
export { connectedHome as HomePage }; 