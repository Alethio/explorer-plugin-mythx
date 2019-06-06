import { ContractAnalyzeResultReader } from "./ContractAnalyzeResultReader";
import { HttpRequest } from "@puzzl/browser/lib/network/HttpRequest";
import { IServerResponse } from "./IServerResponse";
import { SubmitApi } from "./SubmitApi";

interface IScanRequest {
    address: string;
    "g-recaptcha-response"?: string;
}

export class ContractAnalyzeResultApi {
    constructor(
        private httpRequest: HttpRequest,
        private contractAnalyzeResultReader: ContractAnalyzeResultReader,
        private resultEndpointUrlMask: string,
        private scanEndpointUrl: string,
        private submitApi: SubmitApi
    ) {

    }

    async fetch(contractId: number) {
        let response = await this.httpRequest.fetchJson<IServerResponse<any>>(
            this.resultEndpointUrlMask.replace("%d", "" + contractId)
        );

        if (response.status === 404) {
            return void 0;
        }

        if (response.status !== 200) {
            throw new Error(`Bad server response status ${response.status}`);
        }

        if (!response.data) {
            throw new Error(`No data found for account ${contractId}`);
        }

        return this.contractAnalyzeResultReader.read(response.data);
    }

    async requestScan(contractAddress: string, recaptchaToken?: string) {
        await this.submitApi.post<IScanRequest, any>(this.scanEndpointUrl, {
            "address": contractAddress,
            "g-recaptcha-response": recaptchaToken
        });
    }
}
