import { Formatter } from 'src/blueprints/Formatter';
import { defaultParser } from 'src/parsers/default-parser';

/**
 * JSON pretty `Formatter` instance.
 */
export const jsonPrettyFormatter = new Formatter(
  defaultParser,
  (parseResult) => {
    if (parseResult.length < 1) {
      return '';
    }

    return JSON.stringify(parseResult, null, 2);
  }
);
