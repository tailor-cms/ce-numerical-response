import { expect, test } from '@playwright/test';
import { elementClient } from '@tailor-cms/cek-e2e';

import { Edit } from '../pom';

const ELEMENT_ID = 'test-numerical-response-edit';

test.beforeEach(async ({ page }) => {
  await elementClient.reset(ELEMENT_ID, { isGradable: true });
  await page.goto(`/?id=${ELEMENT_ID}`);
  await page.waitForLoadState('networkidle');
});

test.describe('Initial render', () => {
  test('Renders one answer row by default', async ({ page }) => {
    const edit = new Edit(page);
    await expect(edit.correctInputs).toHaveCount(1);
    await expect(edit.addAnswerBtn).toBeVisible();
  });
});

test.describe('Answer management', () => {
  test('Adds additional answer row', async ({ page }) => {
    const edit = new Edit(page);
    await edit.addAnswerBtn.click();
    await expect(edit.correctInputs).toHaveCount(2);
  });

  test('Persists prefix, correct value, and suffix', async ({ page }) => {
    const edit = new Edit(page);
    await edit.prefixInputs.nth(0).fill('$');
    await edit.correctInputs.nth(0).fill('42');
    await edit.suffixInputs.nth(0).fill('USD');
    await edit.form.saveBtn.click();
    await page.reload({ waitUntil: 'networkidle' });
    await expect(edit.prefixInputs.nth(0)).toHaveValue('$');
    await expect(edit.correctInputs.nth(0)).toHaveValue('42');
    await expect(edit.suffixInputs.nth(0)).toHaveValue('USD');
  });

  test('Removes an answer when more than one exists', async ({ page }) => {
    const edit = new Edit(page);
    await edit.addAnswerBtn.click();
    await expect(edit.correctInputs).toHaveCount(2);
    await edit.removeAnswerBtn(1).click();
    await expect(edit.correctInputs).toHaveCount(1);
  });
});

