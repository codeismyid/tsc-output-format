import type { Context } from './prepare-context';

/** @internal */
export const formatAndWrite = (errors: string, context: Context) => {
  if (context.watch) {
    console.clear();
  }

  if (context.formatter === null) {
    process.stdout.write(errors);
    return;
  }

  const formatted = context.formatter.format(errors);

  process.stdout.write(formatted);
};
