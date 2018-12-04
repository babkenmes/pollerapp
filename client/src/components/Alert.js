/* @flow */
import React from 'react';
import { alertActionCreators,type Action } from '@/reducers/alert';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import type { Store } from "@/types/Store"
import type { AlertStore } from "@/types/Alert"

type Props = {
    AlertStore: AlertStore,
    dispatch:(action:Action)=>void;
};

class Alert extends React.Component<Props> {
    constructor(props) {
        super(props);
        (this: any).clearAlert = this.clearAlert.bind(this);

    }
    clearAlert(){
        this.props.dispatch(alertActionCreators.clear());
    }
    render() {
        const { AlertStore } = this.props;
        return (
            AlertStore && AlertStore.isActive ?
                <div className={`alert alert-dismissible fade show ${AlertStore.type || ""}`}>
                    {AlertStore.message}
                    <button onClick={this.clearAlert} type="button" className="close" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                : null
        );
    }
}

function mapStateToProps(state: Store) {
    const { AlertStore } = state;
    return { AlertStore };
}

const connectedComponent = connect(mapStateToProps)(Alert);
export { connectedComponent as Alert }; 