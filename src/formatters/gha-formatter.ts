import { Formatter } from 'src/blueprints/Formatter';
import { defaultParser } from 'src/parsers/default-parser';

/**
 * Githuh Actions Annotation `Formatter` instance.
 */
export const ghaFormatter = new Formatter(defaultParser, (parseResults) => {
  let result = '';
  const lastIndex = parseResults.length - 1;

  const newLineReplacer = (str: string) => {
    return str.replaceAll(/\r?\n/g, '%0A');
  };

  for (let i = 0; i < parseResults.length; i++) {
    const parseResult = parseResults[i];

    result += '::error title=TS Diagnostic';

    if (parseResult.errorCode) {
      result += ` (${parseResult.errorCode})`;
    }

    if (parseResult.file) {
      result += `,file=${parseResult.file}`;
    }

    if (parseResult.line) {
      result += `,line=${parseResult.line},endLine=${parseResult.line}`;
    }

    if (parseResult.column) {
      result += `,col=${parseResult.column}`;
    }

    result += `::${newLineReplacer(parseResult.message)}`;

    if (i !== lastIndex) {
      result += '\n';
    }
  }

  return result;
});
