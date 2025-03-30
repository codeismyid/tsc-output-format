import type { ParseResult, Parser } from './Parser';

/**
 * Blueprint class that formats the results from a `Parser`, adding a transformation and optional prefix/suffix.
 *
 * @template MatcherKeys The keys used to capture groups from the regex in the `Parser`.
 */
export class Formatter<MatcherKeys extends readonly string[] = string[]> {
  #parser: Parser<MatcherKeys>;
  #transform: FormatterTransform<MatcherKeys>;
  #options: FormatterOptions;

  /**
   * Creates a new Formatter instance.
   *
   * @param parser The `Parser` to use for parsing the input.
   * @param transform A function to transform the parsed results into a formatted string.
   * @param options Optional settings for adding a prefix or suffix to the result.
   */
  constructor(
    parser: Parser<MatcherKeys>,
    transform: FormatterTransform<MatcherKeys>,
    options?: FormatterOptions
  ) {
    this.#parser = parser;
    this.#transform = transform;
    this.#options = options || {};
  }

  /**
   * Combines default options with any custom ones.
   *
   * @param options Any options you want to override the default ones.
   * @returns The final set of options (including defaults).
   */
  #getOptions = (options?: FormatterOptions): Required<FormatterOptions> => ({
    prefix: '',
    suffix: '',
    ...this.#options,
    ...options
  });

  /**
   * Formats the input string by parsing it, transforming it, and adding optional prefix and suffix.
   *
   * @param input The string you want to format.
   * @param options Optional prefix and suffix to add to the result.
   * @returns The formatted string.
   */
  format = (input: string, options?: FormatterOptions) => {
    const { prefix, suffix } = this.#getOptions(options);
    const parseResults = this.#parser.parse(input);
    const transformed = this.#transform(parseResults);
    return `${prefix}${transformed}${suffix}`;
  };
}

/**
 * Options for the `Formatter`, such as prefix and suffix.
 */
export type FormatterOptions = {
  prefix?: string;
  suffix?: string;
};

/**
 * A function that takes parsed results and turns them into a formatted string.
 *
 * @template MatcherKeys The keys used to capture groups from the regex.
 */
export type FormatterTransform<
  MatcherKeys extends readonly string[] = string[]
> = (parseResults: ParseResult<MatcherKeys>[]) => string;
