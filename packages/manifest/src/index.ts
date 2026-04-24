import type { AiConfig, ElementMocks } from '@tailor-cms/cek-common';
import { v4 as uuid } from 'uuid';

import type {
  DataInitializer,
  ElementData,
  ElementManifest,
} from './interfaces';

// Element unique id within the target system (e.g. Tailor)
export const type = 'NUMERICAL_RESPONSE';

// Display name (e.g. shown to the author)
export const name = 'Numerical Response';

// Function which inits element state (data property on the Content Element
// entity)
export const initState: DataInitializer = (config): ElementData => {
  const isGradable = config?.isGradable ?? true;
  return {
    isGradable,
    embeds: {},
    question: [],
    prefixes: [''],
    suffixes: [''],
    hint: '',
    ...(isGradable && { correct: [0] }),
  };
};

// Can be loaded from package.json
export const version = '1.0';

export const isEmpty = (data: ElementData): boolean =>
  !data.question?.length ||
  !data.prefixes?.some(Boolean) ||
  !data.suffixes?.some(Boolean);

export const mocks: ElementMocks = {
  displayContexts: [
    { name: 'No answer', data: {} },
    {
      name: 'Correct answer',
      data: { response: [0], isCorrect: true, isSubmitted: true },
    },
    {
      name: 'Wrong answer',
      data: { response: [1], isCorrect: false, isSubmitted: true },
    },
  ],
};

// UI configuration for Tailor CMS
const ui = {
  // Display icon, https://pictogrammers.com/library/mdi/
  icon: 'mdi-numeric',
  // Does element support only full width or can be used within layouts
  // (e.g. 50/50 layout)
  forceFullWidth: true,
};

export const ai: AiConfig = {
  Schema: {
    type: 'json_schema',
    name: 'ce_numerical_response',
    schema: {
      type: 'object',
      properties: {
        question: { type: 'string' },
        answers: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'object',
            properties: {
              correct: { type: 'number' },
              prefix: { type: 'string' },
              suffix: { type: 'string' },
            },
            required: ['correct', 'prefix', 'suffix'],
            additionalProperties: false,
          },
        },
        hint: { type: 'string' },
      },
      required: ['question', 'hint', 'answers'],
      additionalProperties: false,
    },
  },
  getPrompt: () => `
    Generate a numerical response question as an object with the following
    properties:
    {
      "question": "",
      "answers": [
        {
          "correct": 0,
          "prefix": "",
          "suffix": "",
        }
      ]
      "hint": "",
    }
    where:
      - 'question' is the question prompt.
      - 'answers' is an array of answer objects, where:
        - 'correct' is a number representing the correct answer.
        - 'prefix' is a string representing the prefix of the correct
          number, such as a currency, unit of measurement, percentage, etc.
        - 'suffix' is a string representing the suffix of the correct
          number, such as a currency, unit of measurement, percentage, etc.
        Suffix and prefix are optional. There can be multiple answers if the
        correct answer consists of multiple numbers; in that case, split them
        into separate answers.
      - 'hint' is an optional hint for the correct solution
  `,
  processResponse: (val: any) => {
    const questionId = uuid();
    const question = {
      id: questionId,
      data: { content: val.question },
      embedded: true,
      position: 1,
      type: 'TIPTAP_HTML',
    };
    const answers = val.answers.reduce(
      (acc: Record<string, any>, { correct, prefix, suffix }: any) => {
        acc.prefixes.push(prefix || '');
        acc.suffixes.push(suffix || '');
        acc.correct.push(correct);
        return acc;
      },
      { prefixes: [], suffixes: [], correct: [] },
    );
    return {
      isGradable: true,
      hint: val.hint || '',
      ...answers,
      question: [questionId],
      embeds: { [questionId]: question },
    };
  },
};

const manifest: ElementManifest = {
  type,
  version,
  name,
  ssr: false,
  isComposite: true,
  isQuestion: true,
  isGradable: true,
  showFeedback: false,
  initState,
  isEmpty,
  ui,
  ai,
  mocks,
};

export default manifest;
export * from './interfaces';
