/* @flow */
import React from 'react';
import { pollActionCreators } from '@/reducers/poll';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import type { Store } from "@/types/Store"
import type { PollStore, PollDetails } from "@/types/Poll"
import { Vote } from "@/components/Vote"
import { PollStatsPage } from "@/components/PollStats"

type Props = {
    pollId: string,
    dispatch: any,
    item: PollDetails,
};
type State = {
    isVoting: boolean,
}
class PollItem extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            isVoting: false
        };
        (this: any).endVote = this.endVote.bind(this);
    }
    endVote() {
        this.setState({ isVoting: false });
    }
    componentWillReceiveProps(nextProps: Props) {
        if (!nextProps.item || !nextProps.item.loaded) {
            this.props.dispatch(pollActionCreators.get_item(nextProps.pollId));
        }
        else if (this.props.item.loaded && !this.props.item.hasVoted  && nextProps.item.hasVoted == true) {
            this.setState({ isVoting: true })
        }
    }
    render() {
        const { item } = this.props;
        const { isVoting } = this.state;
        if (!item)
            return null
        if (!item.loaded)
            return <span>Loading...</span>
        return (
            <div>
                {!item.hasVoted ? <Vote item={item} /> : !isVoting ? <PollStatsPage item={item} /> :
                    <div className={`alert alert-dismissible fade show success}`}>
                        Your vote has been submitted.
                    <button onClick={this.endVote} type="button" className="close" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>}
            </div>
        );
    }
}

function mapStateToProps(state: Store, ownProps: Props) {
    const item = state.PollStore.data[ownProps.pollId];
    return { item };
}

const connectedComponent = connect(mapStateToProps)(PollItem);
export { connectedComponent as PollItemPage }; 