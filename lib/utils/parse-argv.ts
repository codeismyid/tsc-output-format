import { Formatter } from 'src';

export const AVAILABLE_FORMAT_OUTPUT = [
  'raw',
  ...Object.keys(Formatter).map((key) => key.replace('Formatter', ''))
];

const DEFAULT_FORMAT_OPTION: FormatOptions = {
  formatOnly: false,
  formatOutput: 'raw'
};

const getArgValue = <Type extends readonly unknown[] | 'boolean'>(
  arg: string,
  value: string | undefined,
  type: Type
) => {
  const result: { args: string[]; value: string | boolean } = {
    args: [arg],
    value: value ?? true
  };

  if (type === 'boolean') {
    if (!value) {
      return result;
    }

    const isKey = value.startsWith('-');

    if (isKey) {
      result.value = true;
      return result;
    }

    if (value !== 'true' && value !== 'false') {
      throw new TypeError(`'${arg}' must be 'true' | 'false'.`);
    }

    result.args.push(value);
    result.value = value === 'true';
    return result;
  }

  const oneOf = type.reduce(
    (acc, curr, currIndex) =>
      `${currIndex === 1 ? `'${acc}'` : acc} | '${curr}'`
  );

  if (!value) {
    throw new TypeError(`'${arg}' must be ${oneOf}.`);
  }

  const isKey = value.startsWith('-');

  if (isKey || !type.includes(value)) {
    throw new TypeError(`'${arg}' must be ${oneOf}.`);
  }

  result.args.push(value);
  return result;
};

/** @internal */
export const parseArgv = () => {
  const argv = process.argv.slice(2);
  const result: ParsedArgv = {
    argv,
    argvTsc: [],
    argvFormat: [],
    help: false,
    formatOptions: { ...DEFAULT_FORMAT_OPTION },
    watch: false
  };

  for (let i = 0; i < argv.length; ) {
    const nextIndex = i + 1;
    const arg = argv[i];
    const nextArg = argv[nextIndex];

    if (arg === '--formatOnly') {
      const argValue = getArgValue(arg, nextArg, 'boolean');

      result.formatOptions.formatOnly = argValue.value as boolean;
      result.argvFormat.push(...argValue.args);
      i += argValue.args.length;
      continue;
    }

    if (arg === '--formatOutput') {
      const argValue = getArgValue(arg, nextArg, AVAILABLE_FORMAT_OUTPUT);

      result.formatOptions.formatOutput =
        argValue.value as FormatOptions['formatOutput'];
      result.argvFormat.push(...argValue.args);
      i += argValue.args.length;
      continue;
    }

    if (arg === '--help' || arg === '-h') {
      const argValue = getArgValue(arg, nextArg, 'boolean');

      result.help = argValue.value as boolean;
      result.argvTsc.push(...argValue.args);
      i += argValue.args.length;
      continue;
    }

    if (arg === '--watch' || arg === '-w') {
      const argValue = getArgValue(arg, nextArg, 'boolean');

      result.watch = argValue.value as boolean;
      result.argvTsc.push(...argValue.args);
      i += argValue.args.length;
      continue;
    }

    result.argvTsc.push(arg);
    i++;
  }

  return result;
};

/** @internal */
export type FormatOptions = {
  formatOnly: boolean;
  formatOutput: (typeof AVAILABLE_FORMAT_OUTPUT)[number];
};

/** @internal */
export type ParsedArgv = {
  argv: string[];
  argvTsc: string[];
  argvFormat: string[];
  help: boolean;
  formatOptions: FormatOptions;
  watch: boolean;
};
