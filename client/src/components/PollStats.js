/* @flow */
import React from 'react';
import { pollActionCreators } from '@/reducers/poll';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import type { Store } from "@/types/Store"
import type { PollStore, PollDetails } from "@/types/Poll"

type Props = {
    item: PollDetails,
};

export class PollStatsPage extends React.Component<Props> {
    constructor(props:Props) {
        super(props);
    }
    render() {
        const { item } = this.props;
        return (
            <div>
                <h2>{item.title}</h2>
                {
                    item.options.map((opt) => {
                        return <div className="form-check" key={opt._id}>
                            <label className="form-check-label" htmlFor={opt._id}>{`${opt.title} ${opt.votes || "0"}`}</label>
                        </div>
                    })
                }
            </div>
        );
    }
}
