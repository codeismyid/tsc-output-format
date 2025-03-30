import { formatAndWrite } from 'lib/utils/format-and-write';
import type { Context } from 'lib/utils/prepare-context';

const bun = async (context: Context) => {
  const args = [...context.argvTsc];
  const watchMode = context.watch;

  const spawn = (await import('bun')).spawn;

  const tsc = spawn({
    cmd: ['bunx', 'tsc', ...args]
  });

  let tempErrors = '';

  for await (const chunk of tsc.stdout as AsyncIterable<Uint8Array>) {
    const str = Buffer.from(chunk).toString('utf-8');
    tempErrors += str;

    if (watchMode && str.trimEnd().endsWith('Watching for file changes.')) {
      formatAndWrite(tempErrors, context);
      tempErrors = '';
    }
  }

  if (!watchMode) {
    formatAndWrite(tempErrors, context);
    tempErrors = '';
  }
};

const node = async (context: Context) => {
  const args = [...context.argvTsc];
  const watchMode = context.watch;

  const spawn = (await import('node:child_process')).spawn;
  const tsc = spawn('npx', ['-p', 'typescript', 'tsc', ...args], {
    shell: true
  });

  let tempErrors = '';

  tsc.stdout.on('data', (data: Buffer) => {
    const str = data.toString();
    tempErrors += str;

    if (watchMode && str.trimEnd().endsWith('Watching for file changes.')) {
      formatAndWrite(tempErrors, context);
      tempErrors = '';
    }
  });

  if (!watchMode) {
    tsc.stdout.on('end', () => {
      formatAndWrite(tempErrors, context);
      tempErrors = '';
    });
  }
};

/** @internal */
export const runTsc = async (context: Context) => {
  const isBun = Boolean(process.versions.bun);

  if (isBun) {
    await bun(context);
  } else {
    await node(context);
  }
};
