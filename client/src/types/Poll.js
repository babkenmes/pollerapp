/* @flow */
export type Option = {
    _id?: string;
    title: string;
    votes?: number;
}
export type Poll = {
    _id: string;
    title: string;
};

export type PollDetails = Poll & {
    loaded:boolean;
    options: Option[];
    hasVoted: boolean;
}

export type PollStore = {
    loading: boolean;
    hasError: boolean;
    error: string;
    data: { [key: string]: Poll | PollDetails };
    selectedId?: string;
    allIds: string[];
}