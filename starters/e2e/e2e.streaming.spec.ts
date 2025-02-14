import { test, expect } from '@playwright/test';

test.describe('streaming', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/e2e/streaming', {
      waitUntil: 'domcontentloaded',
    });
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        expect(msg.text()).toEqual(undefined);
      }
    });

    page.on('pageerror', (err) => expect(err).toEqual(undefined));
  });

  test('should render correctly', async ({ page }) => {
    const ul = await page.locator('ul > li');
    const ol = await page.locator('ol > li');
    const cmps = await page.locator('.cmp');

    await expect(ul).toHaveCount(5);
    await expect(ol).toHaveCount(10);
    await expect(cmps).toHaveCount(5);
  });

  test('should rerender correctly', async ({ page }) => {
    const ul = await page.locator('ul > li');
    const ol = await page.locator('ol > li');
    const cmps = await page.locator('.cmp');
    const count = await page.locator('button#count');
    await count.click();

    await expect(count).toHaveText('Rerender 1');
    await expect(ul).toHaveCount(5);
    await expect(ol).toHaveCount(10);
    await expect(cmps).toHaveCount(5);
  });

  test('should render in client correctly', async ({ page }) => {
    const ul = await page.locator('ul > li');
    const ol = await page.locator('ol > li');
    const cmps = await page.locator('.cmp');
    const count = await page.locator('button#count');
    const rerender = await page.locator('button#client-render');
    await count.click();
    await expect(count).toHaveText('Rerender 1');

    await rerender.click();
    await page.waitForTimeout(500);
    await count.click();
    await page.waitForTimeout(3000);

    await expect(count).toHaveText('Rerender 0');
    await expect(ul).toHaveCount(0);
    await expect(ol).toHaveCount(0);
    await expect(cmps).toHaveCount(5);

    await count.click();
    await expect(count).toHaveText('Rerender 1');
  });
});
