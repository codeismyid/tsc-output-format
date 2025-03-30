import type { Context } from 'lib/utils';
import { formatAndWrite } from 'lib/utils/format-and-write';

/** @internal */
export const runFormatOnly = (context: Context) => {
  const watchMode = context.watch;
  let tempErrors = '';

  process.stdin.on('data', (data) => {
    const str = data.toString();

    tempErrors += str;

    if (watchMode && str.trimEnd().endsWith('Watching for file changes.')) {
      formatAndWrite(tempErrors, context);
      tempErrors = '';
    }
  });

  if (!watchMode) {
    process.stdin.on('end', () => {
      formatAndWrite(tempErrors, context);
      tempErrors = '';
    });
  }
};
