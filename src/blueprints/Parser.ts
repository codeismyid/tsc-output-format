/**
 * Blueprint class that parses a string using a regular expression and returns the matched results.
 *
 * @template MatcherKeys The keys used to capture groups from the regex.
 */
export class Parser<MatcherKeys extends readonly string[] = string[]> {
  #matcher: RegExp;
  #matcherKeys: MatcherKeys;
  #inputModifier?: (input: string) => string;
  #resultModifier?: (
    result: ParseResult<MatcherKeys>
  ) => ParseResult<MatcherKeys>;

  /**
   * Creates a new Parser instance.
   *
   * @param matcher The global regex to use for matching.
   * @param matcherKeys The keys for the captured groups from the regex.
   * @param inputModifier An optional function to modify the input string before parsing.
   * @throws {TypeError} If the regex is not global.
   */
  constructor(
    matcher: RegExp,
    matcherKeys: MatcherKeys,
    inputModifier?: (input: string) => string,
    resultModifier?: (
      result: ParseResult<MatcherKeys>
    ) => ParseResult<MatcherKeys>
  ) {
    if (!matcher.global) {
      throw new TypeError("argument 'matcher' must be a global regex.");
    }
    this.#matcher = matcher;
    this.#matcherKeys = matcherKeys;
    this.#inputModifier = inputModifier;
    this.#resultModifier = resultModifier;
  }

  /**
   * Builds the result object from the match.
   *
   * @param matchError The match result from `RegExpExecArray`.
   * @returns An object with the full match and the captured groups.
   */
  #constructResult = (matchError: RegExpExecArray) => {
    const groups = matchError.groups || {};
    return {
      _match: matchError[0],
      ...Object.fromEntries(
        this.#matcherKeys.map((key, index) => {
          const value =
            key in groups ? groups[key] : matchError[index + 1] || '';
          return [key, value];
        })
      )
    } as ParseResult<MatcherKeys>;
  };

  /**
   * Parses the input string and returns an array of matched results.
   *
   * @param input The string you want to parse.
   * @returns An array of results with the full match and captured groups.
   */
  parse = (input: string) => {
    const results: ParseResult<MatcherKeys>[] = [];
    const matches = (this.#inputModifier?.(input) ?? input).matchAll(
      this.#matcher
    );

    for (const matchError of matches) {
      let result = this.#constructResult(matchError);

      if (this.#resultModifier) {
        result = this.#resultModifier({ ...result });
      }

      results.push(result);
    }

    return results;
  };
}

/**
 * The result of a parsing operation, including the full match and the captured groups.
 *
 * @template MatcherKeys The keys used to capture groups from the regex.
 */
export type ParseResult<MatcherKeys extends readonly string[]> = Record<
  '_match' | MatcherKeys[number],
  string
>;
