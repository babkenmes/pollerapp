/* @flow */
import React from 'react';
import { Router, Route, Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { LoginPage } from "@/components/Login"
import { RegisterPage } from "@/components/Register"
import { PrivateRoute } from "@/components/PrivateRoute"
import { HomePage } from "@/components/Home"
import { PollsPage } from "@/components/Polls"
import { Header } from "@/components/Header"
import { Alert } from "@/components/Alert"

import { CreatePollPage } from "@/components/CreatePoll"

import type { AlertStore } from "@/types/Alert"
import type { Store } from "@/types/Store"
import { alertActionCreators } from '@/reducers/alert';

import { history } from "@/helpers/history";

type Props = {
}
export class App extends React.Component<Props> {
    constructor(props:Props) {
        super(props);
    }

    render() {
        return (
            <div className="container">
                <div className="col-sm-12">
                    <Router history={history}>
                        <div>
                            <Header />
                            <Alert />
                            <Route path="/" component={HomePage} />
                            <Route path="/login" component={LoginPage} />
                            <Route path="/polls" component={PollsPage} />
                            <Route path="/polls/asd" component={PollsPage} />
                            <Route path="/register" component={RegisterPage} />
                            <Route path="/create-poll" component={CreatePollPage} />
                        </div>
                    </Router>
                </div>
            </div>
        );
    }
}

