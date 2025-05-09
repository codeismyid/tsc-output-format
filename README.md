<div align="center">
  
# tsc-output-format

Format Typescript compiler (tsc) diagnostic output into JSON, [Github Actions Annotation](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/workflow-commands-for-github-actions#setting-an-error-message) and more.

[![License](https://img.shields.io/github/license/codeismyid/tsc-output-format?style=flat-square&color=blue)](/LICENSE)
[![NPM Latest](https://img.shields.io/npm/v/tsc-output-format.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/tsc-output-format)
[![NPM Downloads](https://img.shields.io/npm/dt/tsc-output-format.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/tsc-output-format)
[![NPM Min Size](https://img.shields.io/bundlejs/size/tsc-output-format?style=flat-square&color=blue)](https://www.npmjs.com/package/tsc-output-format)

[![CI](https://img.shields.io/github/actions/workflow/status/codeismyid/tsc-output-format/ci.yaml?style=flat-square&logo=github&label=CI&labelColor=383f47)](https://github.com/codeismyid/tsc-output-format/actions/workflows/ci.yaml)
[![CodeQL](https://img.shields.io/github/actions/workflow/status/codeismyid/tsc-output-format/codeql.yaml?style=flat-square&logo=github&label=CodeQL&labelColor=383f47)](https://github.com/codeismyid/tsc-output-format/actions/workflows/codeql.yaml)
[![Codecov](https://img.shields.io/codecov/c/github/codeismyid/tsc-output-format?style=flat-square&logo=codecov&label=Coverage&labelColor=383f47)](https://app.codecov.io/github/codeismyid/tsc-output-format)
[![Type Coverage](https://img.shields.io/badge/dynamic/json.svg?style=flat-square&logo=typescript&label=Coverage&labelColor=383f47&color=44cc11&prefix=≥&suffix=%&query=$.typeCoverage.atLeast&uri=https://github.com/codeismyid/tsc-output-format/raw/main/package.json)](https://github.com/codeismyid/tsc-output-format)

</div>

- **Supports CLI and programmatic use**: Use it directly from the command line for quick compile and formatting, or integrate it into your workflows programmatically.
- **TSC command friendly**: Works with the existing tsc CLI options.
- **Works on Pretty Mode**: Works with `--pretty` flag enabled.
- **Supports Watch Mode**: Use it directly from the command line to enable watch mode.
- **GitHub-Action Output**: Format into GitHub-Action annotations for more visible and actionable error reporting in CI-environment.
- **JSON Output**: Format into a structured JSON format for easy integration with other tools or workflows.
- **Customizable**: Leverage the Formatter and Parser blueprint to create custom formatter and parser.

#### Format Example

From:

```text
src/index.ts(1,1): error TS1000: Unexpected Error.

1  const unexpected_error = unexpected_error;
                            ~~~~~~~~~~~~~~~~
                            
src/index2.ts:1:1 - error TS1000: Unexpected Error.

1  const unexpected_error = unexpected_error;
                            ~~~~~~~~~~~~~~~~
```

To GHA annotations:

```text
::error title=TS Diagnostic (TS1000),file=src/index.ts,line=1,endLine=1,col=1::Unexpected Error.
::error title=TS Diagnostic (TS1000),file=src/index2.ts,line=1,endLine=1,col=1::Unexpected Error.
```

To JSON Pretty:

```jsonc
[
  {
    "file": "src/index.ts",
    "line": "1",
    "column": "1",
    "errorCode": "TS1000",
    "message": "Unexpected Error",
    "source": "1  const unexpected_error = unexpected_error;\n                            ~~~~~~~~~~~~~~~~",
    "sourceClean": "const unexpected_error = unexpected_error;"
  },
  {
    "file": "src/index2.ts",
    "line": "2",
    "column": "2",
    "errorCode": "TS1000",
    "message": "Unexpected Error",
    "source": "1  const unexpected_error = unexpected_error;\n                            ~~~~~~~~~~~~~~~~",
    "sourceClean": "const unexpected_error = unexpected_error;"
  }
]
```

To Grouped:

```txt
src/index.ts: found 1 errors.
  src/index.ts(1,1): error TS1000: Unexpected Error.

  1  const unexpected_error = unexpected_error;
                              ~~~~~~~~~~~~~~~~

src/index2.ts: found 1 errors.
  src/index.ts:1:1 - error TS1000: Unexpected Error.

  1  const unexpected_error = unexpected_error;
                              ~~~~~~~~~~~~~~~~
```

To Grouped Minify:

```txt
src/index.ts: found 1 errors.
src/index2.ts: found 1 errors.
```

To Suppressed:

```text
suppressed 2 tsc errors.
```

## Installation

```bash
# NPM
npm install --save-dev tsc-output-format

# BUN
bun add -d tsc-output-format
```

## Usage

### CLI

#### CLI Options

- `--formatOnly`: `boolean`
- `--formatOutput`: `raw` | `gha` | `grouped` | `groupedMin` | `json` | `jsonPretty` | `suppressed`
- Other `tsc` cli options, such as:
  - `--watch`
  - `--noEmit`
  - etc.

#### Compile and Format

```bash
# NODE
npx tsc-output-format --formatOutput=json

# BUN
bunx tsc-output-format --formatOutput=json
```

use `-w` or `--watch` flag for watch-mode.

```bash
# NODE
npx tsc-output-format --formatOutput=json --watch

# BUN
bunx tsc-output-format --formatOutput=json --watch
```

#### Format Only

```bash
# NODE
npx -p typescript tsc | npx tsc-output-format --formatOnly --formatOutput=json

# BUN
bunx tsc | bunx tsc-output-format --formatOnly --formatOutput=json
```

use `-w` or `--watch` flag for watch-mode.

```bash
# NODE
npx -p typescript tsc --watch | npx tsc-output-format --formatOnly --formatOutput=json --watch

# BUN
bunx tsc --watch | bunx tsc-output-format --formatOnly --formatOutput=json --watch
```

#### Parse only

> Not available with CLI.

#### Custom

> Not available with CLI.

<hr/>

### Programmatically

#### Compile and Format

> Not available programmatically.

#### Format Only

```ts
import { Formatter } from "tsc-output-format";

const errors = `src/index.ts(1,1): error TS1000: Unexpected error.`;

const gha = Formatter.ghaFormatter.format(errors);
const json = Formatter.jsonFormatter.format(errors);
const jsonPretty = Formatter.jsonPrettyFormatter.format(errors);
const grouped = Formatter.groupedFormatter.format(errors);
const groupedMin = Formatter.groupedMinFormatter.format(errors);
const suppressed = Formatter.suppressedFormatter.format(errors);

// do anything with all outputs...
```

#### Parse only

```ts
import { Parser } from "tsc-output-format";

const errors = `src/index.ts(1,1): error TS1000: Unexpected error.`;

const _default = Parser.defaultParser.parse(errors);

// do anything with parse result...
```

#### Custom

```ts
import { Blueprint } from "tsc-output-format";

const errors = `
src/index.ts(1,1): error TS1000: Unexpected error.
src/index.ts(2,1): error TS1001: Unknown error.
`;

const errorCodeParser = new Blueprint.Parser(/^.*(TS\d+).*$/gm, ['errorCode']);
const errorCodeFormatter = new Blueprint.Formatter(errorCodeParser, (parseResults) => {
  return JSON.stringify(parseResults.map(result => result.errorCode));
})

const errorCodeList = errorCodeFormatter.format(errors); // [TS1000, TS1001]
```

## Developed With

- [Typescript](https://www.typescriptlang.org/) - Strongly typed programming language that builds on JavaScript.
- [Bun](https://bun.sh/) - All-in-one JavaScript runtime & toolkit designed for speed, complete with a bundler, test runner, and Node.js-compatible package manager.


## License

The code in this project is released under the [MIT License](LICENSE).