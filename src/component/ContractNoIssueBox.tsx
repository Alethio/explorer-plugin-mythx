import * as React from "react";
import { ValueBox } from "@alethio/ui/lib/layout/content/box/ValueBox";
import { ITranslation } from "plugin-api/ITranslation";

export interface IContractNoIssueBoxProps {
    translation: ITranslation;
}

export const ContractNoIssueBox: React.StatelessComponent<IContractNoIssueBoxProps> = ({ translation }) => (
    <ValueBox variant="normalThin" colors="primaryInvert">
        { translation.get("accountView.contract.issues.noIssues.text") }
    </ValueBox>
);
