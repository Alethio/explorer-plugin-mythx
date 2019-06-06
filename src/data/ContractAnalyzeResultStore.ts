import { ContractAnalyzeResultApi } from "./ContractAnalyzeResultApi";
import { IContractAnalyzeResult } from "./IContractAnalyzeResult";
import { ICache } from "../util/cache/ICache";

export class ContractAnalyzeResultStore {
    constructor(
        private contractAnalyzeResultCache: ICache<number, IContractAnalyzeResult>,
        private contractAnalyzeResultApi: ContractAnalyzeResultApi
    ) {

    }

    async fetch(contractId: number) {
        if (this.contractAnalyzeResultCache.has(contractId)) {
            return this.contractAnalyzeResultCache.get(contractId)!;
        }

        let analyzeResult = await this.contractAnalyzeResultApi.fetch(contractId);
        if (!analyzeResult) {
            return void 0;
        }
        this.contractAnalyzeResultCache.set(contractId, analyzeResult);
        return analyzeResult;
    }

    async requestScan(contractAddress: string, recaptchaToken?: string) {
        await this.contractAnalyzeResultApi.requestScan(contractAddress, recaptchaToken);
    }
}
