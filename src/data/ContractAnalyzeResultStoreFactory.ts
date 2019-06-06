import { HttpRequest } from "@puzzl/browser/lib/network/HttpRequest";
import { ContractAnalyzeResultStore } from "./ContractAnalyzeResultStore";
import { IContractAnalyzeResult } from "./IContractAnalyzeResult";
import { ContractAnalyzeResultApi } from "./ContractAnalyzeResultApi";
import { ContractAnalyzeResultReader } from "./ContractAnalyzeResultReader";
import { SubmitApi } from "./SubmitApi";
import { FifoCache } from "../util/cache/FifoCache";

const CACHE_SIZE = 20;

export class ContractAnalyzeResultStoreFactory {
    constructor(
        private contractAnalyseResultUrlMask: string,
        private contractAnalyzeScanUrl: string
    ) {

    }

    create() {
        return new ContractAnalyzeResultStore(
            new FifoCache<number, IContractAnalyzeResult>(CACHE_SIZE),
            new ContractAnalyzeResultApi(
                new HttpRequest(),
                new ContractAnalyzeResultReader(),
                this.contractAnalyseResultUrlMask,
                this.contractAnalyzeScanUrl,
                new SubmitApi(new HttpRequest())
            )
        );
    }
}
