/* @flow */
import React from 'react';
import { pollActionCreators } from '@/reducers/poll';
import type { Store } from "@/types/Store"
import type { PollDetails, PollStore, Option } from "@/types/Poll"
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

type Props = {
    dispatch: (action: any) => void,
    PollStore: PollStore
};
type State = {
    optionTitleEditor: string,
    poll: PollDetails,
    submitted: boolean
}
class Create extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            optionTitleEditor: "",
            poll: { _id: "", title: "", options: [], hasVoted: false, loaded: false },
            submitted: false
        };

        (this: any).handleChange = this.handleChange.bind(this);

        (this: any).handleSubmit = this.handleSubmit.bind(this);
        (this: any).addOption = this.addOption.bind(this);
        (this: any).titleChanged = this.titleChanged.bind(this);
        (this: any).newOptionChanged = this.newOptionChanged.bind(this);
        (this: any).removeOption = this.removeOption.bind(this);

    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ poll: { ...this.state.poll, [name]: value } });
    }
    removeOption(e) {
        const index = Number(e.target.dataset.option);
        const options = this.state.poll.options;
        this.setState({ poll: { ...this.state.poll, options: [...options.slice(0, index), ...options.slice(index + 1, options.length)] } });
    }
    addOption(e) {
        const { optionTitleEditor } = this.state;
        const newOption: Option = { title: optionTitleEditor };
        this.setState({ poll: { ...this.state.poll, options: [...this.state.poll.options, newOption] } });
        this.setState({ optionTitleEditor: "" })
    }
    titleChanged(e) {
        const { value } = e.target;
        this.setState({ poll: { ...this.state.poll, title: value } });
    }
    newOptionChanged(e) {
        const { value } = e.target;
        this.setState({ optionTitleEditor: value });
    }
    handleSubmit(e) {
        e.preventDefault();
        const { dispatch } = this.props;

        this.setState({ submitted: true });
        const { title } = this.state.poll;
        if (title) {
            dispatch(pollActionCreators.create(this.state.poll));
        }
    }

    render() {
        const { PollStore, dispatch } = this.props;
        const { selectedId, loading, data } = this.props.PollStore;

        const { submitted, poll: { title, options }, optionTitleEditor } = this.state;
        if (submitted && selectedId && data[selectedId]) {
            return <Redirect to={`/polls`} />
        }

        return (
            <div className="offset-4 col-md-4 m-t-40">
                <h2>Create a poll</h2>
                <form name="form" >
                    <div className={'form-group' + (submitted && !title ? ' has-error' : '')}>
                        <label htmlFor="title">Title</label>
                        <input type="text" className="form-control" name="title" value={title} onChange={this.titleChanged} />
                        {submitted && !title &&
                            <div className="help-block">Title is required</div>
                        }
                    </div>
                    <div>
                        {
                            options.map((opt: Option, index) =>
                                <div key={index}>
                                    {opt.title}
                                    <button data-option={index} onClick={this.removeOption} type="button" className="btn btn-default btn-smaller">Remove</button>
                                </div>)
                        }
                        <div className={'form-group' + (submitted && !optionTitleEditor ? ' has-error' : '')}>
                            <label htmlFor="optionTitleEditor">New Option</label>
                            <div className="input-group">
                                <input type="text" className="form-control" name="optionTitleEditor" value={optionTitleEditor} onChange={this.newOptionChanged} />
                                <span className="input-group-btn">
                                    <button onClick={this.addOption} className="btn btn-default" type="button">Add</button>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <button type="button" onClick={this.handleSubmit} className="btn btn-primary">Create</button>
                        {loading &&
                            <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                        }
                    </div>
                </form>
            </div>
        );
    }
}

function mapStateToProps(state: Store) {
    const { PollStore } = state;
    return { PollStore };
}

const connectedComponent = connect(mapStateToProps)(Create);
export { connectedComponent as CreatePollPage };