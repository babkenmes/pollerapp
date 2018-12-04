/* @flow */
import { type pollAction } from "@/reducers/poll/actions";
import type { Poll, PollStore } from "@/types/Poll"


const INITIAL_DATA: PollStore = {
    loading: false,
    hasError: false,
    error: "",
    data: {},
    selectedId: undefined,
    allIds: []
};

export const PollReducer = (state: PollStore = INITIAL_DATA, action: pollAction): PollStore => {
    switch (action.type) {
        case "POLL/GET_ITEM_SUCCESS": {
            const item = action.payload.data;
            const ids: string[] = [...state.allIds];
            if (!ids.some(id => id == item._id))
                ids.push(item._id);
            const details = { ...item, loaded: true }
            return {
                ...state,
                data: { ...state.data, [item._id]: details },
                allIds: ids
            }
        }
        case "POLL/GET_ALL_SUCCESS": {
            return {
                ...state,
                data: action.payload.data,
                allIds: action.payload.allIds
            }
        }
        case "POLL/CLEAR_SELECT": {
            return {
                ...state,
                selectedId: undefined,
            }
        }
        case "POLL/SELECT": {
            return {
                ...state,
                selectedId: action.payload.id,
            }
        }
        default:
            return state
    }
}