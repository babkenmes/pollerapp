/* @flow */
import { type pollAction } from "@/reducers/poll";
import { pollActionCreators } from "@/reducers/poll";
import { alertActionCreators } from "@/reducers/alert";
import { type MiddlewareAPI, State, Dispatch } from "redux"
import { type Poll } from "@/types/Poll"
import { servicetHelperPOST, servicetHelperGET } from "@/helpers/service"

const api = "/api/polls";
export const pollDataService = (store: MiddlewareAPI<State, pollAction, Dispatch>) => (next: Dispatch) => (action: pollAction) => {
    next(action)
    switch (action.type) {
        case "POLL/CREATE": {
            servicetHelperPOST(`${api}`,
                action.payload.data,
                (data: Poll) => {
                    const selectAction: pollAction = {
                        type: "POLL/SELECT",
                        payload: { id: data._id }
                    };
                    store.dispatch(alertActionCreators.success("Poll successfukky created"));
                    store.dispatch(pollActionCreators.get_item(data._id))
                    store.dispatch(selectAction)
                },
                (err: string) => onError(err, store))
            break;
        }
        case "POLL/GET_ITEM_REQUEST": {
            servicetHelperGET(`${api}/${action.payload.id}`,
                (data: Poll) => {
                    const getItemSuccesAction: pollAction = {
                        type: "POLL/GET_ITEM_SUCCESS",
                        payload: { data }
                    }
                    store.dispatch(getItemSuccesAction);
                },
                (err: string) => onError(err, store))
            break;
        }
        case "POLL/GET_ALL_REQUEST": {
            servicetHelperGET(`${api}/`,
                (data: [Poll]) => {
                    const list = {};
                    const allIds = data.map(item => {
                        list[item._id] = item;
                        return item._id;
                    })
                    const getItemSuccesAction: pollAction = {
                        type: "POLL/GET_ALL_SUCCESS",
                        payload: { data: list, allIds: allIds }
                    }
                    store.dispatch(getItemSuccesAction);
                },
                (err: string) => onError(err, store))
            break;
        }
        case "POLL/VOTE": {
            const id = action.payload.id;
            servicetHelperPOST(`${api}/vote/${id}`,
                action.payload.options,
                (data) => {
                    store.dispatch(pollActionCreators.get_item(id));
                },
                (err: string) => onError(err, store))
            break;
        }
        default:
            break
    }
};

const onError = (error, store) => {
    store.dispatch(alertActionCreators.error(error));
}