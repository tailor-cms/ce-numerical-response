# @tailor-cms/ce-numerical-response-server

Server-side module for the **Numerical Response** content element in [Tailor CMS](https://github.com/tailor-cms/author).

Provides the server half of the element: state initialisation, lifecycle hooks and any AI configuration, registered by the Tailor server runtime.

## Installation

```sh
npm install @tailor-cms/ce-numerical-response-server
```

## Usage

Content elements are normally registered with Tailor through the element
registry rather than imported directly, but the package can be consumed on its
own:

```ts
import serverModule from '@tailor-cms/ce-numerical-response-server';
```

## Element

| Property | Value |
| --- | --- |
| Name | Numerical Response |
| Type | `NUMERICAL_RESPONSE` |
| Icon | [`mdi-numeric`](https://pictogrammers.com/library/mdi/) |
| Composite | Yes |
| Question | Yes |

## Packages

This element ships as four packages, published together from the
[`ce-numerical-response`](https://github.com/tailor-cms/ce-numerical-response) repository:

| Package | Role |
| --- | --- |
| [`@tailor-cms/ce-numerical-response-manifest`](https://www.npmjs.com/package/@tailor-cms/ce-numerical-response-manifest) | Shared element definition |
| [`@tailor-cms/ce-numerical-response-edit`](https://www.npmjs.com/package/@tailor-cms/ce-numerical-response-edit) | Authoring component |
| [`@tailor-cms/ce-numerical-response-display`](https://www.npmjs.com/package/@tailor-cms/ce-numerical-response-display) | End-user component |
| [`@tailor-cms/ce-numerical-response-server`](https://www.npmjs.com/package/@tailor-cms/ce-numerical-response-server) | Server-side module |

## Development

```sh
pnpm install
pnpm dev     # start the Content Element Kit runtime
pnpm build   # build all packages
pnpm test    # Playwright end-to-end suite
```

Changes are released with [changesets](https://github.com/changesets/changesets);
run `pnpm changeset` to record one.
