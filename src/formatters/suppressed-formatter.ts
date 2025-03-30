import { Formatter } from 'src/blueprints/Formatter';
import { defaultParser } from 'src/parsers/default-parser';

/**
 * Suppressed `Formatter` instance.
 */
export const supressedFormatter = new Formatter(
  defaultParser,
  (parseResults) => {
    if (parseResults.length === 0) {
      return '';
    }

    return `suppressed ${parseResults.length} tsc errors.`;
  }
);
