import * as React from "react";
import { ValueBox } from "@alethio/ui/lib/layout/content/box/ValueBox";
import { ExternalLink } from "plugin-api/component/ExternalLink";

export interface IContractIssueIdBoxProps {
    issueId: string;
}

export class ContractIssueIdBox extends React.PureComponent<IContractIssueIdBoxProps> {
    render() {
        return (
            <ExternalLink
                target="_blank"
                href={ "https://smartcontractsecurity.github.io/SWC-registry/docs/" + this.props.issueId }
                rel="noopener noreferrer"
            >
                <ValueBox variant="normalThin" colors="primaryInvert">
                    { this.props.issueId }
                </ValueBox>
            </ExternalLink>
        );
    }
}
