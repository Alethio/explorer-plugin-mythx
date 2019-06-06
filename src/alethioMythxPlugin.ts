import { IPlugin } from "plugin-api";
import { ContractAnalyzeResultStoreFactory } from "./data/ContractAnalyzeResultStoreFactory";
import { RecaptchaV3 } from "./util/RecaptchaV3";
import { contractAnalyzeModule } from "./module/contractAnalyzeModule";
import { injectGlobal } from "@alethio/ui/lib/styled-components";

const alethioMythxPlugin: IPlugin = {
    init(config, api, logger, publicPath) {
        __webpack_public_path__ = publicPath;

        if (!config.CONTRACT_ANALYSE_RESULT_URL_MASK) {
            throw new Error(`Missing config "CONTRACT_ANALYSE_RESULT_URL_MASK"`);
        }

        let contractAnalyzeResultStore = new ContractAnalyzeResultStoreFactory(
            config.CONTRACT_ANALYSE_RESULT_URL_MASK as string,
            config.CONTRACT_ANALYZE_SCAN_URL as string
        ).create();

        let recaptchaSiteKey = config.RECAPTCHA_SITE_KEY as string | undefined;
        let recaptchaV3: RecaptchaV3 | undefined;
        if (recaptchaSiteKey) {
            recaptchaV3 = new RecaptchaV3(recaptchaSiteKey);
            // Load at page render, deferred
            recaptchaV3.load().catch(e => {
                logger.error("Couldn't load recaptcha", e);
            });

            // tslint:disable-next-line:no-unused-expression
            injectGlobal`
                /* Hide reCAPTCHA v3 badge. Sometimes it's not correctly hidden from JS (race condition?) */
                .grecaptcha-badge {
                    display: none !important;
                }
            `;
        }

        api.addModuleDef("module://aleth.io/mythx/contract-analyze",
            contractAnalyzeModule(recaptchaV3, contractAnalyzeResultStore));

    },

    getAvailableLocales() {
        return ["en-US", "zh-CN"];
    },

    async loadTranslations(locale: string) {
        return await import("./translation/" + locale + ".json");
    }
};

// tslint:disable-next-line:no-default-export
export default alethioMythxPlugin;
