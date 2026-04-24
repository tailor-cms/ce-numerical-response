import type { Locator, Page } from '@playwright/test';
import { pom } from '@tailor-cms/cek-e2e';

export class Display extends pom.DisplayPanel {
  readonly inputs: Locator;

  constructor(page: Page) {
    super(page);
    this.inputs = this.editor.getByLabel('Answer');
  }
}
