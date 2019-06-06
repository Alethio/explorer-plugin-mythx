import * as React from "react";
import { ValueBox } from "@alethio/ui/lib/layout/content/box/ValueBox";

export interface IContractIssueValueBoxProps {
    children: string;
}

export const ContractIssueValueBox: React.StatelessComponent<IContractIssueValueBoxProps> = ({ children }) => (
    <ValueBox variant="normalThin" colors="primaryAlt">
        { children }
    </ValueBox>
);
