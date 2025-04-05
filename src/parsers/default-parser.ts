import { type ParseResult, Parser } from 'src/blueprints/Parser';

const KEYS = [
  'file',
  'line',
  'column',
  'errorCode',
  'message',
  'source',
  'sourceClean'
] as const;

/**
 * Default `Parser` instance.
 */
export const defaultParser = new Parser(
  /^(?:(?:(.*?)[:(](\d+)[:,](\d+)[)]? ?[:-] ?)|(?:error ?))(?:error ?)?(TS\d+)?(?:(?:: )|(?: - )|(?: ))(.*(?:\r?\n {2,}.*)*)(?:(?:\r?\n){2,}((?:\d+\s+.*\r?\n\s+~+(?:\r?\n)?)*))?$/gm,
  KEYS,
  (input) => {
    // biome-ignore lint/suspicious/noControlCharactersInRegex: needed for removing colored text
    return input.replaceAll(/\x1b\[[0-9;]*m/g, '');
  },
  (result) => {
    result._match = result._match.trimEnd();

    if (result.source) {
      result.source = result.source.trim();

      const matches = Array.from(
        result.source.trim().matchAll(/^(?:\d+)(\s.*)$/gm)
      );

      let minIndent: number;

      const codeLines = matches.reduce<string[]>((acc, curr) => {
        if (curr?.[1]) {
          const indentLength = (curr[1].match(/^(\s+).*$/)?.[1] || '').length;
          if (minIndent === undefined) {
            minIndent = indentLength;
          } else {
            minIndent = indentLength < minIndent ? indentLength : minIndent;
          }
          acc.push(curr[1]);
        }
        return acc;
      }, []);

      if (codeLines.length > 0) {
        result.sourceClean = codeLines.reduce((acc, curr, currIndex) => {
          let res = acc;
          res += curr.slice(minIndent);

          if (currIndex !== codeLines.length - 1) {
            res += '\n';
          }

          return res;
        }, '');
      }
    }

    return result;
  }
);

/**
 * Default `Parser` result type.
 */
export type DefaultParserResult = ParseResult<typeof KEYS>;
