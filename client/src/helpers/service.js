/* @flow */
import { type Method } from "@/types/request"
export const servicetHelperPOST = function <T>(api: string, data: any, success: (data: T) => void, fail: (err: string) => void) {
    const token = localStorage.getItem("token") || "";
    return fetch(api,
        {
            headers: new Headers({
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }),
            method: "POST",
            body: JSON.stringify(data)
        })
        .then((res) => {
            if (res.ok)
                return res.json()
            else
                throw res.statusText;
        }).then((data: any) => { return success((data: T)); }).catch((err) => { return fail(err); })

}
export const servicetHelperGET = function <T>(api: string, success: (data: T) => void, fail: (err: string) => void) {
    const token = localStorage.getItem("token") || "";
    return fetch(api,
        {
            headers: new Headers({
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }),
            method: "GET",
        })
        .then((res) => { return res.json(); }, (err) => { return (err: string); })
        .then((data: any) => { success((data: T)); })
}