import type { Page } from '@playwright/test';
import { BrowserContext, expect } from '@playwright/test';

export class BasePageActions {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateToURL(url: string) {
        this.page.goto(url);
    }

    async waitForPageNavigation(event: string): Promise<void> {
        switch (event.toLowerCase()) {
            case `networkidle`:
                await this.page.waitForNavigation({
                    waitUntil: `networkidle`
                });
                break;
            case `load`:
                await this.page.waitForNavigation({
                    waitUntil: `load`
                });
                break;
            case `domcontentloaded`:
                await this.page.waitForNavigation({
                    waitUntil: `domcontentloaded`
                });
        }
    }

    async delay(time: number): Promise<void> {
        return new Promise(function (resolve) {
            setTimeout(resolve, time);
        });
    }

    async clickElement(locator: string): Promise<void> {
        await this.page.click(locator);
    }

    async clickElementJS(locator: string): Promise<void> {
        await this.page.$eval(locator, (element: HTMLElement) =>
            element.click()
        );
    }

    async enterElementText(locator: string, text: string): Promise<void> {
        await this.page.fill(locator, text);
    }

    async selectOptionFromDropdown(
        locator: string,
        option: string
    ): Promise<void> {
        const selectDropDownLocator = await this.page.$(locator);
        selectDropDownLocator.type(option);
    }

    async getTextFromWebElements(locator: string): Promise<string[]> {
        return this.page.$$eval(locator, (elements) =>
            elements.map((item) => item.textContent.trim())
        );
    }

    async keyPress(locator: string, key: string): Promise<void> {
        this.page.press(locator, key);
    }

    async verifyElementText(locator: string, text: string): Promise<void> {
        const textValue = await this.page.textContent(locator);
        expect(textValue.trim()).toBe(text);
    }

    async verifyNewWindowUrlAndClick(
        context: BrowserContext,
        newWindowLocator: string,
        urlText: string,
        clickOnNewWindowLocator: string
    ): Promise<void> {
        const [newPage] = await Promise.all([
            context.waitForEvent('page'),
            this.page.click(newWindowLocator)
        ]);
        await newPage.waitForLoadState();
        expect(newPage.url()).toContain(urlText);
        await newPage.click(clickOnNewWindowLocator);
        await newPage.close();
    }

    async verifyElementContainsText(
        locator: string,
        text: string
    ): Promise<void> {
        await expect(this.page.locator(locator)).toContainText(text);
    }

    async verifyJSElementValue(locator: string, text: string): Promise<void> {
        const textValue = await this.page.$eval(
            locator,
            (element: HTMLInputElement) => element.value
        );
        expect(textValue.trim()).toBe(text);
    }

    async verifyElementAttribute(
        locator: string,
        attribute: string,
        value: string
    ): Promise<void> {
        const textValue = await this.page.getAttribute(locator, attribute);
        expect(textValue.trim()).toBe(value);
    }

    async verifyElementIsDisplayed(
        locator: string,
        errorMessage: string,
        timeout: number
    ): Promise<void> {
        await this.page
            .waitForSelector(locator, {
                state: `visible`,
                timeout: timeout
            })
            .catch(() => {
                throw new Error(`${errorMessage}`);
            });
    }

    async expectToBeTrue(status: boolean, errorMessage: string): Promise<void> {
        expect(status, `${errorMessage}`).toBe(true);
    }

    async expectToBeValue(
        expectedValue: string,
        actualValue: string,
        errorMessage: string
    ): Promise<void> {
        expect(expectedValue.trim(), `${errorMessage}`).toBe(actualValue);
    }
}
