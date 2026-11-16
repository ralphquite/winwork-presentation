import { expect, test as base } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, runTest) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.exposeFunction('__recordWinWorkError', (message: string) => {
      errors.push(message);
    });
    await page.addInitScript(() => {
      window.addEventListener('error', (event) => {
        const report = Reflect.get(window, '__recordWinWorkError') as (
          message: string,
        ) => Promise<void>;
        void report(event.message);
      });
    });
    await runTest(page);
    expect(errors, 'Uncaught browser errors').toEqual([]);
  },
});

export { expect };
