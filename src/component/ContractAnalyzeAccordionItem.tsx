import * as React from "react";
import { AccordionItem } from "@alethio/ui/lib/control/accordion/AccordionItem";
import { ContractAnalyzeResultSection } from "./ContractAnalyzeResultSection";
import { ITranslation, ILogger } from "plugin-api";
import { ContractAnalyzeResultStore } from "../data/ContractAnalyzeResultStore";
import { RecaptchaV3 } from "../util/RecaptchaV3";
import { IContractVerifications } from "../data/verifications/IContractVerifications";

// TODO: import this from eth-extended plugin
interface IContractAccordionItemConfig {
    label: string;
    value: number | undefined;
    content(): Promise<React.ReactElement<{}>>;
}

export interface IContractAnalyzeAccordionItemProps {
    locale: string;
    logger: ILogger;
    translation: ITranslation;
    contractPotentialIssues: number | undefined;
    contractId: number;
    contractAddress: string;
    contractAnalyzeResultStore: ContractAnalyzeResultStore;
    contractVerifications: IContractVerifications | undefined;
    recaptchaV3: RecaptchaV3 | undefined;
}

export class ContractAnalyzeAccordionItem extends React.Component<IContractAnalyzeAccordionItemProps> {
    render() {
        let { translation: tr, contractId, contractAddress, contractPotentialIssues, logger, recaptchaV3 } = this.props;
        return (
            <AccordionItem<IContractAccordionItemConfig>
                label={tr.get("accountView.contract.issues.label")}
                value={contractPotentialIssues}
                content={async () => {
                    let analyzeResult = await this.props.contractAnalyzeResultStore.fetch(contractId);

                    return <ContractAnalyzeResultSection
                        contractAddress={contractAddress}
                        logger={logger}
                        recaptchaV3={recaptchaV3}
                        resultStore={this.props.contractAnalyzeResultStore}
                        verifications={this.props.contractVerifications}
                        result={analyzeResult}
                        translation={tr}
                        locale={this.props.locale}
                    />;
                }}
            />
        );
    }
}
