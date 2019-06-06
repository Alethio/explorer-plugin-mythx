import * as React from "react";
import { ValueBox } from "@alethio/ui/lib/layout/content/box/ValueBox";
import { ContractAnalyzeResultIssueSeverity } from "../data/IContractAnalyzeResult";
import { ITranslation } from "plugin-api/ITranslation";

export interface IContractIssueSeverityBoxProps {
    severity: ContractAnalyzeResultIssueSeverity;
    translation: ITranslation;
}

export class ContractIssueSeverityBox extends React.PureComponent<IContractIssueSeverityBoxProps> {
    render() {
        return (
            <ValueBox variant="normalThin" colors={(theme) => ({
                background: theme.colors.valueBox.primaryAlt.background,
                text: this.props.severity === ContractAnalyzeResultIssueSeverity.High ?
                    theme.colors.base.status.error : theme.colors.valueBox.primaryAlt.text
            })}>
                { this.props.translation.get(
                    "accountView.contract.issue.severity." +
                    ContractAnalyzeResultIssueSeverity[this.props.severity] +
                    ".text"
                ) }
            </ValueBox>
        );
    }
}
