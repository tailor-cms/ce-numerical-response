import baseManifest from '@tailor-cms/ce-numerical-response-manifest';
import type { ElementManifest } from '@tailor-cms/ce-numerical-response-manifest';

import Display from './components/Display.vue';

const manifest: ElementManifest = {
  ...baseManifest,
  Display,
};

export default manifest;
export { Display };
