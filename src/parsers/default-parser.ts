import { Parser } from 'src/blueprints/Parser';

/**
 * Default `Parser` instance.
 */
export const defaultParser = new Parser(
  /^(?:(?:(.*?)[:(](\d+)[:,](\d+)[)]? ?[:-] ?)|(?:error ?))(?:error ?)?(TS\d+)?(?:(?:: )|(?: - )|(?: ))(.*(?:\r?\n {2,}.*)*)(?:(?:\r?\n){2,}(\d+\s+(.*)\r?\n\s+~+))?$/gm,
  [
    'file',
    'line',
    'column',
    'errorCode',
    'message',
    'source',
    'sourceClean'
  ] as const,
  (input) => {
    // biome-ignore lint/suspicious/noControlCharactersInRegex: needed for removing colored text
    return input.replaceAll(/\x1b\[[0-9;]*m/g, '');
  }
);
