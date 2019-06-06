import { load, ReCaptchaInstance } from "recaptcha-v3";

export class RecaptchaV3 {
    private instance: ReCaptchaInstance | undefined;

    constructor(private siteKey: string) {

    }

    async load() {
        this.instance = await load(this.siteKey, { useRecaptchaNet: true, autoHideBadge: true });
    }

    /**
     * @returns token
     */
    async execute(action: string) {
        if (!this.instance) {
            await this.load();
        }

        return this.instance!.execute(action);
    }
}
