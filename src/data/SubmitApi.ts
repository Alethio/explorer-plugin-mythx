import { HttpRequest } from "@puzzl/browser/lib/network/HttpRequest";
import { IServerResponse } from "./IServerResponse";

export class SubmitApi {
    constructor(private httpRequest: HttpRequest) {

    }

    async post<TRequest, TResponse>(url: string, requestBody: TRequest) {
        let response = await this.httpRequest.fetchJson<IServerResponse<TResponse>>(url, {
            method: "POST",
            data: requestBody
        });

        if (response.status !== 200) {
            throw new Error(`Got response with unexpected status ${response.status}`);
        }

        return response.data;
    }
}
