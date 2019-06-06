// tslint:disable:no-string-literal
import { IContractAnalyzeResult, IContractAnalyzeResultIssue } from "./IContractAnalyzeResult";
import { readContractIssueSeverity } from "./readContractIssueSeverity";

export class ContractAnalyzeResultReader {
    read(data: any) {
        let contractAnalyzeResult: IContractAnalyzeResult = {
            issues: data["result"]["issues"].map((issue: any) => {
                let is: IContractAnalyzeResultIssue = {
                    description: {
                        head: issue["description"]["head"],
                        tail: issue["description"]["tail"]
                    },
                    severity: readContractIssueSeverity( issue["severity"] ),
                    swcId: issue["swcID"],
                    swcTitle: issue["swcTitle"]
                };
                return is;
            }),
            version: data["version"],
            createdAt: Number(data["createdAt"])
        };
        return contractAnalyzeResult;
    }
}
