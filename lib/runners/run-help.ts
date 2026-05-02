import { AVAILABLE_FORMAT_OUTPUT, type Context } from 'lib/utils';
import { runTsc } from './run-tsc';

const helpText = `
FORMAT OPTIONS

--formatOnly
Only run format process (value will always 'true' if input is piped).
type: boolean
default: false

--formatOutput
Specify generated output.
one of: ${AVAILABLE_FORMAT_OUTPUT.join(', ')}
default: raw
_______________________________________________________________________________

`.trimStart();

/** @internal */
export const runHelp = (context: Context) => {
  process.stdout.write(helpText);
  runTsc(context);
};
