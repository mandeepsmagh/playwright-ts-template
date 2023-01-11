import { Page } from 'playwright';
import { BasePageActions } from './base-page-actions';

let pageActions: BasePageActions;

export class LoginPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        pageActions = new BasePageActions(this.page);
    }

    async naviateToUrl(): Promise<void> {
        await pageActions.navigateToURL('google.com.au');
    }
}
