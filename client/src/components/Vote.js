/* @flow */
import React from 'react';
import { pollActionCreators } from '@/reducers/poll';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import type { Store } from "@/types/Store"
import type { PollStore, PollDetails } from "@/types/Poll"

type Props = {
    dispatch: any,
    item: PollDetails,
};
type State = {
    selectedOptions: string[]
}
class Vote extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            selectedOptions: []
        };
        (this: any).vote = this.vote.bind(this);
    }
    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.item._id !== this.props.item._id)
            this.setState({ selectedOptions: [] });
    }
    markOption(id?: string) {
        if (!id) return;
        const { selectedOptions } = this.state;
        if (!selectedOptions.some(opt => opt == id))
            this.setState({ selectedOptions: [...selectedOptions, id] });
        else {
            const index = selectedOptions.indexOf(id)
            this.setState({ selectedOptions: [...selectedOptions.slice(0, index), ...selectedOptions.slice(index + 1)] });
        }
    }
    vote() {
        const { dispatch } = this.props;
        const { selectedOptions } = this.state;
        dispatch(pollActionCreators.vote(this.props.item._id, selectedOptions));
    }
    render() {
        const { item } = this.props;
        const { selectedOptions } = this.state;
        return (
            <div>
                <h2>{item.title}</h2>
                <div>{
                    item.options.map((opt) => {
                        return <div className="form-check" key={opt._id}>
                            <input type="checkbox" className="form-check-input" id={opt._id} onChange={() => this.markOption(opt._id)} />
                            <label className="form-check-label" htmlFor={opt._id}>{opt.title}</label>
                        </div>
                    })
                }</div>
                <div>
                    <span className="input-group-btn">
                        <button disabled={selectedOptions.length == 0} onClick={this.vote} className="btn btn-default" type="button">Vote</button>
                    </span>
                </div>
            </div>
        );
    }
}
function mapStateToProps(state: Store, ownProps: Props) {
    return {};
}

const connectedComponent = connect(mapStateToProps)(Vote);
export { connectedComponent as Vote }; 