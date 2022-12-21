import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';
import * as envURLs from './environments.json';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import * as dotenv from 'dotenv';
dotenv.config();

// Environment URLS
const env = {
    dev: envURLs.dev,
    test: envURLs.test
};

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
    // testDir: '/tests',
    /* Maximum time one test can run for. */
    timeout: 30 * 1000,

    expect: {
        /**
         * Maximum time expect() should wait for the condition to be met.
         * For example in `await expect(locator).toHaveText();`
         */
        timeout: 5000
    },
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: process.env.CI ? 'html' : 'line',
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
        actionTimeout: 0,
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: env[process.env.ENV],

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'retain-on-failure',
        headless: process.env.CI ? true : false,
        screenshot: 'only-on-failure',
        httpCredentials: {
            username: process.env.USER,
            password: process.env.PWD
        }
    },
    /* Used to run tests by tags
     * Example: npm run testByEnvAndTag
     */
    grep: [new RegExp(process.env.TAGS)],
    /* Configure projects for major browsers */
    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                // Below launchoptions args is used to disable SSO in Chromium
                launchOptions: {
                    args: ['--auth-server-whitelist="_"']
                }
            }
        }

        /* Test against branded browsers. */
        // {
        //   name: 'Google Chrome',
        //   use: {
        //     channel: 'chrome',
        //   },
        // },
    ],

    /* Folder for test artifacts such as screenshots, videos, traces, etc. */
    outputDir: 'test-results/'

    /* Run your local dev server before starting the tests */
    // webServer: {
    //   command: 'npm run start',
    //   port: 3000,
    // }
};

export default config;
