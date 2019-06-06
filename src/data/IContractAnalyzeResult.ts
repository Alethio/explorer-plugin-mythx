export enum ContractAnalyzeResultIssueSeverity {
    None,
    Low,
    Medium,
    High
}

export interface IContractAnalyzeResultIssue {
    description: {
        head: string;
        tail: string;
    };
    severity: ContractAnalyzeResultIssueSeverity;
    swcId: string;
    swcTitle: string;
}

export interface IContractAnalyzeResult {
    issues: IContractAnalyzeResultIssue[];
    version: string;
    createdAt: number;
}
