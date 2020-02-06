import * as React from "react";
import styled from "@alethio/explorer-ui/lib/styled-components";
import { IContractAnalyzeResult, IContractAnalyzeResultIssue } from "../data/IContractAnalyzeResult";
import { LayoutSection } from "@alethio/ui/lib/layout/content/LayoutSection";
import { LayoutRow } from "@alethio/ui/lib/layout/content/LayoutRow";
import { LayoutRowItem } from "@alethio/ui/lib/layout/content/LayoutRowItem";
import { Label } from "@alethio/ui/lib/data/Label";
import { ValueBox } from "@alethio/ui/lib/layout/content/box/ValueBox";
import { ExternalLink } from "@alethio/ui/lib/control/ExternalLink";
import { ITranslation } from "plugin-api/ITranslation";
import { ContractIssueIdBox } from "./ContractIssueIdBox";
import { ContractIssueValueBox } from "./ContractIssueValueBox";
import { ContractNoIssueBox } from "./ContractNoIssueBox";
import { ContractIssueSeverityBox } from "./ContractIssueSeverityBox";
import { Button } from "@alethio/ui/lib/control/Button";
import { RecaptchaV3 } from "../util/RecaptchaV3";
import { ILogger } from "plugin-api/ILogger";
import { IContractVerifications } from "../data/verifications/IContractVerifications";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { ContractAnalyzeResultStore } from "../data/ContractAnalyzeResultStore";
import poweredByMythX from "../../assets/poweredByMythX.svg";

const READ_CONTRACT_LINE_BASE_HEIGHT = 44;

const AnalyzeResultSectionRoot = styled.div`
    background-color: ${({theme}) => theme.colors.readContractSectionBg};
    padding: 20px 0 20px 241px;
`;
const StyledLabel = styled(Label)`
    color: ${({theme}) => theme.colors.readContractLabelBg};
`;
const ContractIssueDescription = styled.div`
    max-width: 700px;
    padding: 8px;
    font-size: 18px;
    font-weight: 400;
    line-height: 27px;
    color: ${({theme}) => theme.colors.base.primary.color};
`;
const Separator = styled.div`
    max-width: 700px;
    width: 700px;
    height: 0;
    border: 1px solid ${({theme}) => theme.colors.separator };
`;

interface IAnalyzeReducedResult {
    issue: IContractAnalyzeResultIssue;
    occurrences: number;
}
interface IContractAnalyzeResultSectionProps {
    resultStore: ContractAnalyzeResultStore;
    contractAddress: string;
    result?: IContractAnalyzeResult;
    verifications: IContractVerifications | undefined;
    recaptchaV3: RecaptchaV3 | undefined;
    logger: ILogger;
    translation: ITranslation;
    locale: string;
}

@observer
export class ContractAnalyzeResultSection extends React.Component<IContractAnalyzeResultSectionProps> {
    @observable
    private scanRequested = false;
    @observable
    private scanRequestInProgress = false;

    constructor(props: IContractAnalyzeResultSectionProps) {
        super(props);

        this.scanRequested = (this.props.verifications !== undefined && this.props.verifications.mythX === true);
    }

    private handleRequestScan = async () => {
        if (this.scanRequested) {
            return;
        }
        this.scanRequestInProgress = true;

        let recaptchaToken: string | undefined;
        if (this.props.recaptchaV3) {
            recaptchaToken = await this.props.recaptchaV3.execute("requestscan");
        }

        try {
            await this.props.resultStore.requestScan(this.props.contractAddress, recaptchaToken);
            this.scanRequested = true;
            this.scanRequestInProgress = false;
        } catch (e) {
            this.props.logger.error("Failed scan request", e, { address: this.props.contractAddress });
        }
    }

    render() {
        let tr = this.props.translation;
        let reducedResults = this.props.result !== void 0 ?
            this.props.result.issues.reduce((accumulator: IAnalyzeReducedResult[], issue, idx) => {
                let reducedIssue = accumulator.find((iss) => issue.swcId === iss.issue.swcId);
                if (reducedIssue !== void 0) {
                    reducedIssue.occurrences++;
                } else {
                    accumulator.push({
                        issue,
                        occurrences: 1
                    });
                }
                return accumulator;
            }, []).sort((a, b) => {
                /**
                 * Sord descending, the highest severity has the highest value
                 */
                let order = b.issue.severity - a.issue.severity;
                if (order === 0) {
                    /**
                     * Sort ascending by issue id
                     */
                    try {
                        let [, aId] = a.issue.swcId.match(/^SWC\-(\d+)$/i)!;
                        let [, bId] = b.issue.swcId.match(/^SWC\-(\d+)$/i)!;
                        order = parseInt(aId, 10) - parseInt(bId, 10);
                    } catch {
                        order = 0;
                    }
                }
                return order;
            })
            : void 0;

        return (
            <AnalyzeResultSectionRoot>
                { reducedResults === void 0 ?
                    this.renderNoResultAvailableBlock()
                : (reducedResults.length === 0 ?
                    this.renderNoIssuesBlock()
                : reducedResults.map((result, idx) =>
                    <LayoutSection key={result.issue.swcId}>
                        <LayoutRow>
                            <LayoutRowItem baseHeight={READ_CONTRACT_LINE_BASE_HEIGHT}>
                                <StyledLabel>{ tr.get("accountView.contract.issues.issue.label") }</StyledLabel>
                                <ContractIssueIdBox issueId={result.issue.swcId} />
                                <ContractIssueValueBox>{ result.issue.swcTitle }</ContractIssueValueBox>
                            </LayoutRowItem>
                            <LayoutRowItem baseHeight={READ_CONTRACT_LINE_BASE_HEIGHT}>
                                <Label>{ tr.get("accountView.contract.issues.severity.label") }</Label>
                                <ContractIssueSeverityBox
                                    severity={result.issue.severity}
                                    translation={tr}
                                />
                            </LayoutRowItem>
                            <LayoutRowItem baseHeight={READ_CONTRACT_LINE_BASE_HEIGHT}>
                                <Label>{ tr.get("accountView.contract.issues.occurrences.label") }</Label>
                                <ContractIssueValueBox>{ result.occurrences.toLocaleString() }</ContractIssueValueBox>
                            </LayoutRowItem>
                        </LayoutRow>
                        <LayoutRow>
                            <LayoutRowItem baseHeight={READ_CONTRACT_LINE_BASE_HEIGHT}>
                                <Label>{ tr.get("accountView.contract.issues.description.label") }</Label>
                                <ValueBox variant="normalThin">
                                    { result.issue.description.head } { /* issue.description.tail */ }
                                </ValueBox>
                            </LayoutRowItem>
                        </LayoutRow>
                        <LayoutRow>
                            <LayoutRowItem baseHeight={READ_CONTRACT_LINE_BASE_HEIGHT} autoHeight>
                                <Label></Label>
                                <ContractIssueDescription>
                                    { result.issue.description.tail }
                                </ContractIssueDescription>
                            </LayoutRowItem>
                        </LayoutRow>
                    </LayoutSection>
                )) }
                { this.props.result && reducedResults !== void 0 ?
                    this.renderDisclaimer(this.props.result)
                : null }
                { this.renderPoweredByMythX() }
            </AnalyzeResultSectionRoot>
        );
    }

    private renderNoIssuesBlock() {
        let tr = this.props.translation;
        return (
            <LayoutSection>
                <LayoutRow>
                    <LayoutRowItem baseHeight={READ_CONTRACT_LINE_BASE_HEIGHT}>
                        <Label>{ tr.get("accountView.contract.issues.label") }</Label>
                        <ContractNoIssueBox translation={tr} />
                        <ContractIssueValueBox>
                            { tr.get("accountView.contract.issues.noIssues.description") }
                        </ContractIssueValueBox>
                    </LayoutRowItem>
                </LayoutRow>
            </LayoutSection>
        );
    }

    private renderNoResultAvailableBlock() {
        let tr = this.props.translation;
        return (
            <LayoutSection>
                <LayoutRow>
                    <LayoutRowItem baseHeight={READ_CONTRACT_LINE_BASE_HEIGHT}>
                        <Label>{ tr.get("accountView.contract.issues.unavailable.label") }</Label>
                        <ValueBox variant="normalThin">
                            { tr.get("accountView.contract.issues.unavailable.text") }
                        </ValueBox>
                    </LayoutRowItem>
                </LayoutRow>
                <LayoutRow>
                    <LayoutRowItem baseHeight={READ_CONTRACT_LINE_BASE_HEIGHT}>
                        <Label></Label>
                        <ValueBox variant="normalThin">
                            { tr.get("accountView.contract.issues.provider.text") }
                        </ValueBox>
                    </LayoutRowItem>
                </LayoutRow>
                <LayoutRow>
                    <LayoutRowItem baseHeight={READ_CONTRACT_LINE_BASE_HEIGHT}>
                        <Label></Label>
                        <Button colors={this.scanRequested ? "secondary" : "primary"} onClick={this.handleRequestScan}
                        disabled={this.scanRequested || this.scanRequestInProgress}>
                            { tr.get("accountView.contract.issues.requestScan.button") }
                        </Button>
                        { this.scanRequested ?
                        <ValueBox>{ tr.get("accountView.contract.issues.scanInProgress.text") }</ValueBox>
                        : null }
                    </LayoutRowItem>
                </LayoutRow>
                {this.props.recaptchaV3 ?
                <LayoutRow>
                    <LayoutRowItem baseHeight={READ_CONTRACT_LINE_BASE_HEIGHT}>
                        <Label></Label>
                        <div><p dangerouslySetInnerHTML={{
                            __html: tr.get("recaptchaDisclaimer.text", {
                                "{privacyLink}": `<a href="https://policies.google.com/privacy" target="_blank">`,
                                "{/privacyLink}": "</a>",
                                "{tosLink}": `<a href="https://policies.google.com/terms" target="_blank">`,
                                "{/tosLink}": "</a>"
                            })
                        }}></p></div>
                    </LayoutRowItem>
                </LayoutRow>
                : null }
            </LayoutSection>
        );
    }

    private renderDisclaimer(result: IContractAnalyzeResult) {
        let tr = this.props.translation;
        let disclaimerText = tr.get("accountView.contract.issues.disclaimer1")
            .replace("{version}", result.version)
            // TODO: Use ShortDate from ethstats-ui
            .replace("{createdAt}", new Date(result.createdAt * 1000).toLocaleDateString(this.props.locale, {
                timeZone: "UTC", year: "numeric", month: "short", day: "numeric"
            }));
        let [, disclaimerPre, disclaimerTextLink, disclaimerPost] = disclaimerText.match(/(.*){link}(.*){\/link}(.*)/)!;

        return (
            <LayoutRow>
                <LayoutRowItem baseHeight={READ_CONTRACT_LINE_BASE_HEIGHT} autoHeight>
                    <Label></Label>
                    <ContractIssueDescription>
                        {disclaimerPre}
                        <ExternalLink href="https://mythx.io/">
                            {disclaimerTextLink}
                        </ExternalLink>
                        {disclaimerPost}
                        <br />
                        { tr.get("accountView.contract.issues.disclaimer2") }
                    </ContractIssueDescription>
                </LayoutRowItem>
            </LayoutRow>
        );
    }

    private renderPoweredByMythX() {
        let tr = this.props.translation;
        return (
            <LayoutSection>
                <LayoutRow>
                    <LayoutRowItem baseHeight={READ_CONTRACT_LINE_BASE_HEIGHT}>
                        <Label></Label>
                        <Separator />
                    </LayoutRowItem>
                </LayoutRow>
                <LayoutRow>
                    <LayoutRowItem baseHeight={READ_CONTRACT_LINE_BASE_HEIGHT}>
                        <Label></Label>
                        <ValueBox variant="smallThin">
                            { tr.get("accountView.contract.issues.poweredBy.text") }
                        </ValueBox>
                        <img src={poweredByMythX} />
                    </LayoutRowItem>
                </LayoutRow>
            </LayoutSection>
        );
    }
}
