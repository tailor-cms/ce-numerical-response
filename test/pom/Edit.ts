import type { Locator, Page } from '@playwright/test';
import { pom } from '@tailor-cms/cek-e2e';

export class Edit extends pom.EditPanel {
  readonly form: pom.EditQuestionForm;
  readonly root: Locator;
  readonly prefixInputs: Locator;
  readonly correctInputs: Locator;
  readonly suffixInputs: Locator;
  readonly addAnswerBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.form = new pom.EditQuestionForm(this.el);
    this.root = this.form.el.locator('.tce-numerical-response');
    this.prefixInputs = this.root.getByPlaceholder('Prefix');
    this.correctInputs = this.root.getByPlaceholder('Correct value...');
    this.suffixInputs = this.root.getByPlaceholder('Suffix');
    this.addAnswerBtn = this.root.getByRole('button', { name: 'Add Answer' });
  }

  removeAnswerBtn(index: number): Locator {
    return this.root
      .locator('.d-flex.mb-2')
      .nth(index)
      .getByRole('button', { name: 'Remove answer' });
  }
}
