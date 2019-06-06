import { ContractAnalyzeResultIssueSeverity } from "./IContractAnalyzeResult";

export function readContractIssueSeverity(severityRaw: string) {
    if (/^(.*)(high)(.*)$/i.test(severityRaw)) {
        return ContractAnalyzeResultIssueSeverity.High;
    }
    if (/^(.*)(medium)(.*)$/i.test(severityRaw)) {
        return ContractAnalyzeResultIssueSeverity.Medium;
    }
    if (/^(.*)(low)(.*)$/i.test(severityRaw)) {
        return ContractAnalyzeResultIssueSeverity.Low;
    }
    return ContractAnalyzeResultIssueSeverity.None;
}
