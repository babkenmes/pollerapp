/* @flow */

import type { Poll } from "@/types/Poll"

type get_all_request = { type: "POLL/GET_ALL_REQUEST" };
type get_all_success = { type: "POLL/GET_ALL_SUCCESS", payload: { data: { [key: string]: Poll }, allIds: string[] } };
type get_all_error = { type: "POLL/GET_ALL_ERROR", payload: { error: string } };


type get_my = { type: "POLL/GET_MY" };

type get_item_request = { type: "POLL/GET_ITEM_REQUEST", payload: { id: string } };
type get_item_success = { type: "POLL/GET_ITEM_SUCCESS", payload: { data: Poll } };
type get_item_error = { type: "POLL/GET_ITEM_ERROR", payload: { error: string } };

type create = { type: "POLL/CREATE", payload: { data: Poll } };
type select = { type: "POLL/SELECT", payload: { id: string } };
type clrear_select = { type: "POLL/CLEAR_SELECT", payload: { id: string } };

type vote = { type: "POLL/VOTE", payload: { id: string, options: string[] } };

export type pollAction = get_all_request | get_all_success | get_all_error |
    get_item_request | get_item_success | get_item_error |
    get_my | create | select | clrear_select | vote;

export const pollActionCreators = {

    create: (item: Poll): create => {
        return {
            type: "POLL/CREATE",
            payload: { data: item }
        }
    },
    clear_select: () => {
        return {
            type: "POLL/CLEAR_SELECT",
        }
    },
    select: (id: string) => {
        return {
            type: "POLL/SELECT",
            payload: { id }
        }
    },
    vote: (id: string, options: string[]): vote => {
        return {
            type: "POLL/VOTE",
            payload: { id: id, options: options }
        }
    },
    get_all: (): get_all_request => {
        return {
            type: "POLL/GET_ALL_REQUEST",
        }
    },

    get_my: (): get_my => {
        return {
            type: "POLL/GET_MY",
        }
    },
    get_item: (id: string): get_item_request => {
        return {
            type: "POLL/GET_ITEM_REQUEST",
            payload: { id }
        }
    },

}