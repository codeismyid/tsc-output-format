import { Formatter } from 'src/blueprints/Formatter';
import { defaultParser } from 'src/parsers/default-parser';

/**
 * JSON `Formatter` instance.
 */
export const jsonFormatter = new Formatter(defaultParser, (parseResult) => {
  if (parseResult?.length < 1) {
    return '';
  }

  return JSON.stringify(parseResult);
});
