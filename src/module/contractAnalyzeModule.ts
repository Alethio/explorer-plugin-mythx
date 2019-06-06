import { IModuleDef } from "plugin-api";
import { IContractAnalyzeAccordionItemProps } from "../component/ContractAnalyzeAccordionItem";
import { IContractVerifications } from "../data/verifications/IContractVerifications";
import { RecaptchaV3 } from "../util/RecaptchaV3";
import { ContractAnalyzeResultStore } from "../data/ContractAnalyzeResultStore";

interface IAccountContext {
    accountHash: string;
}

interface IContractDetails {
    contractId: number;
    contractPotentialIssues?: number;
    verifications?: IContractVerifications;
}

export const contractAnalyzeModule: (
    recaptchaV3: RecaptchaV3 | undefined,
    contractAnalyzeResultStore: ContractAnalyzeResultStore
) => IModuleDef<IContractAnalyzeAccordionItemProps, IAccountContext> = (recaptchaV3, contractAnalyzeResultStore) => ({
    contextType: {
        accountHash: "string"
    },

    dataAdapters: [{
        ref: "adapter://aleth.io/extended/account/details"
    }],

    getContentComponent: async () => import("../component/ContractAnalyzeAccordionItem")
        .then(({ ContractAnalyzeAccordionItem }) => ContractAnalyzeAccordionItem),

    getContentProps(contextProps) {
        let { translation, locale, logger, asyncData, context } = contextProps;

        let accountDetails = asyncData.get("adapter://aleth.io/extended/account/details")!.data as IContractDetails;

        let props: IContractAnalyzeAccordionItemProps = {
            contractAddress: context.accountHash,
            contractId: accountDetails.contractId,
            contractPotentialIssues: accountDetails.contractPotentialIssues,
            contractVerifications: accountDetails.verifications,
            recaptchaV3,
            contractAnalyzeResultStore,
            locale,
            logger,
            translation
        };

        return props;
    }
});
