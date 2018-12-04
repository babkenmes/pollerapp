/* @flow */
import React from 'react';
import { pollActionCreators } from '@/reducers/poll';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import type { Store } from "@/types/Store"
import type { PollStore } from "@/types/Poll"
import { Route } from 'react-router-dom';
import { PollItemPage } from "@/components/PollItem"

type Props = {
    dispatch: any,
    PollStore: PollStore,
};

class Polls extends React.Component<Props> {
    constructor(props) {
        super(props);
        (this: any).showPoll = this.showPoll.bind(this);
    }
    componentDidMount() {
        this.props.dispatch(pollActionCreators.get_all());
    }
    showPoll(e) {
        const id = e.target.dataset.pollid;
        this.props.dispatch(pollActionCreators.select(id));
    }
    render() {
        const { data, allIds, selectedId } = this.props.PollStore;
        return (
            <div className="row">
                <div className="col-md-4">{
                    allIds.map((pollId) => {
                        return <div key={pollId}><div data-pollid={pollId} onClick={this.showPoll} className={`poll-block ${selectedId==pollId?'selected-poll':''}` }>{data[pollId].title}</div></div>
                    })
                }</div>
                <div className="col-md-6">
                    <PollItemPage pollId={selectedId} />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: Store) {
    const { PollStore } = state;
    return { PollStore };
}

const connectedComponent = connect(mapStateToProps)(Polls);
export { connectedComponent as PollsPage }; 