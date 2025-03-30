import { type ParsedArgv, parseArgv } from 'lib/utils/parse-argv';
import { Formatter } from 'src';

/** @internal */
export type Context = {
  formatter: (typeof Formatter)[keyof typeof Formatter] | null;
} & ParsedArgv;

/** @internal */
export const prepareContext = (): Context => {
  const parsedArgv = parseArgv();
  const isInputPiped = !process.stdin.isTTY;

  const getFormatter = () => {
    const {
      help,
      formatOptions: { formatOutput }
    } = parsedArgv;

    if (help || formatOutput === 'raw') {
      return null;
    }

    return Formatter[`${formatOutput}Formatter` as keyof typeof Formatter];
  };

  return {
    ...parsedArgv,
    formatOptions: {
      ...parsedArgv.formatOptions,
      formatOnly: isInputPiped || parsedArgv.formatOptions.formatOnly
    },
    formatter: getFormatter()
  };
};
