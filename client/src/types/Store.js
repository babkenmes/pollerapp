/* @flow */
import type {  UserStore } from "@/types/User"
import type {  PollStore } from "@/types/Poll"
import type {  AlertStore } from "@/types/Alert"

export type Store = {
    PollStore:PollStore,
    AlertStore:AlertStore,
    UserStore:UserStore,
}