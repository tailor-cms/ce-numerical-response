import { elementClient, pom } from '@tailor-cms/cek-e2e';
import { expect, test } from '@playwright/test';

import { Display } from '../pom';

const ELEMENT_ID = 'test-numerical-response-display';

const SEED = {
  isGradable: true,
  prefixes: ['$', ''],
  suffixes: ['USD', 'items'],
  correct: [42, 7],
  embeds: {
    prompt: {
      id: 'prompt',
      type: 'TIPTAP_HTML',
      position: 1,
      embedded: true,
      data: { content: 'Enter the values.' },
    },
  },
  question: ['prompt'],
  hint: '',
  feedback: {},
};

test.beforeEach(async ({ page }) => {
  await elementClient.reset(ELEMENT_ID);
  await elementClient.resetState(ELEMENT_ID);
  await page.goto(`/?id=${ELEMENT_ID}`);
  await page.waitForLoadState('networkidle');
});

test.describe('Empty state', () => {
  test('Renders placeholder when no answers are set', async ({ page }) => {
    const display = new Display(page);
    await expect(display.placeholder).toBeVisible();
  });
});

test.describe('With answers set', () => {
  test.beforeEach(async ({ page }) => {
    await elementClient.update(ELEMENT_ID, SEED);
    await page.reload({ waitUntil: 'networkidle' });
  });

  test('Renders one input per answer slot', async ({ page }) => {
    const display = new Display(page);
    await expect(display.inputs).toHaveCount(2);
  });

  test('Renders configured prefixes and suffixes', async ({ page }) => {
    const display = new Display(page);
    await expect(display.editor.getByText('$')).toBeVisible();
    await expect(display.editor.getByText('USD')).toBeVisible();
    await expect(display.editor.getByText('items')).toBeVisible();
  });

  test('Typing and submitting locks the inputs', async ({ page }) => {
    const display = new Display(page);
    const form = new pom.DisplayQuestionForm(display.el);
    await expect(display.inputs.nth(0)).not.toHaveAttribute('readonly');
    await display.inputs.nth(0).fill('42');
    await display.inputs.nth(1).fill('7');
    await form.submit();
    await expect(display.inputs.nth(0)).toHaveAttribute('readonly');
  });

  test('Submitting correct values shows success icons', async ({ page }) => {
    const display = new Display(page);
    const form = new pom.DisplayQuestionForm(display.el);
    await display.inputs.nth(0).fill('42');
    await display.inputs.nth(1).fill('7');
    await form.submit();
    await expect(
      display.editor.locator('.v-number-input .mdi-check-circle'),
    ).toHaveCount(2);
  });

  test('Submitting a wrong value shows an error icon', async ({ page }) => {
    const display = new Display(page);
    const form = new pom.DisplayQuestionForm(display.el);
    await display.inputs.nth(0).fill('0');
    await display.inputs.nth(1).fill('7');
    await form.submit();
    await expect(
      display.editor.locator('.mdi-close-circle').first(),
    ).toBeVisible();
  });

  test('Submitting correct values marks feedback as success', async ({
    page,
  }) => {
    const display = new Display(page);
    const form = new pom.DisplayQuestionForm(display.el);
    await display.inputs.nth(0).fill('42');
    await display.inputs.nth(1).fill('7');
    await form.submit();
    await expect(form.feedback).toHaveClass(/success/);
  });

  test('Submitting wrong values marks feedback as error', async ({ page }) => {
    const display = new Display(page);
    const form = new pom.DisplayQuestionForm(display.el);
    await display.inputs.nth(0).fill('0');
    await display.inputs.nth(1).fill('0');
    await form.submit();
    await expect(form.feedback).toHaveClass(/error/);
  });
});
