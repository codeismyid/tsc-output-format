import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  spyOn
} from 'bun:test';
import * as Node from 'node:child_process';
import { Util } from 'lib';
import { runTsc } from 'lib/runners/run-tsc';
import type { Context } from 'lib/utils';

const originalBunVersion = process.versions.bun;
let context: Context;
let formatAndWriteSpy: Mock<typeof Util.formatAndWrite>;

const run = async (runtime: 'node' | 'bun' = 'bun', stdout = '') => {
  if (runtime === 'bun') {
    process.versions.bun = originalBunVersion || '1.0.0';

    spyOn(Bun, 'spawn').mockImplementationOnce(() => {
      return {
        stdout: [stdout]
      } as unknown as ReturnType<typeof Bun.spawn>;
    });
  }

  if (runtime === 'node') {
    process.versions.bun = '';
    spyOn(Node, 'spawn').mockImplementationOnce((() => {
      const out = {
        on: (event: string, cb: (data?: Buffer) => void) => {
          if (event === 'data') {
            cb(Buffer.from(stdout, 'utf-8'));
          }

          if (event === 'end') {
            cb();
          }
        }
      };

      return { stdout: out };
    }) as unknown as typeof Node.spawn);
  }

  await runTsc(context);
  process.versions.bun = originalBunVersion;
};

describe('lib > runners > runTsc', () => {
  beforeEach(() => {
    context = {
      argv: [],
      argvTsc: [],
      argvFormat: [],
      help: false,
      formatter: null,
      formatOptions: {
        formatOutput: 'raw',
        formatOnly: false
      },
      watch: false
    };
    formatAndWriteSpy = spyOn(Util, 'formatAndWrite').mockImplementation(
      () => {}
    );
  });

  afterEach(() => {
    formatAndWriteSpy.mockRestore();
  });

  it('should be function with 1 param', () => {
    expect(runTsc).toBeFunction();
    expect(runTsc.length).toBe(1);
  });

  describe('bun environment', () => {
    let spawnSpy: Mock<typeof Bun.spawn>;

    beforeEach(() => {
      spawnSpy = spyOn(Bun, 'spawn');
    });

    afterEach(() => {
      spawnSpy.mockClear();
    });

    it('should invoke spawn from bun module', async () => {
      expect(spawnSpy).toHaveBeenCalledTimes(0);
      await run('bun');
      expect(spawnSpy).toHaveBeenCalledTimes(1);
    });

    describe('spawn cmd', () => {
      it('should have run `bunx tsc`', async () => {
        await run('bun');
        expect(spawnSpy).toHaveBeenLastCalledWith({
          cmd: ['bunx', 'tsc']
        });
      });

      it('should use args from context.argvTsc value', async () => {
        context.argvTsc = ['--noEmit', '--strict'];
        await run('bun');
        expect(spawnSpy).toHaveBeenLastCalledWith({
          cmd: ['bunx', 'tsc', ...context.argvTsc]
        });
      });
    });

    describe('watch mode', () => {
      beforeEach(() => {
        context.watch = true;
      });

      it('should invoke formatAndWrite on data event correctly', async () => {
        let errors = 'src/index.ts(1,1): Unexpected error.';

        expect(formatAndWriteSpy).toHaveBeenCalledTimes(0);
        await run('bun', errors);
        expect(formatAndWriteSpy).toHaveBeenCalledTimes(0);

        const printCondition = 'Watching for file changes.';
        errors += printCondition;

        await run('bun', errors);
        expect(formatAndWriteSpy).toHaveBeenCalledTimes(1);
        expect(formatAndWriteSpy).toHaveBeenLastCalledWith(errors, context);
      });
    });

    describe('non-watch mode', () => {
      beforeEach(() => {
        context.watch = false;
      });

      it('should invoke formatAndWrite on exit event correctly', async () => {
        const errors = 'src/index.ts(1,1): Unexpected error.';
        expect(formatAndWriteSpy).toHaveBeenCalledTimes(0);
        await run('bun', errors);
        expect(formatAndWriteSpy).toHaveBeenCalledTimes(1);
        expect(formatAndWriteSpy).toHaveBeenLastCalledWith(errors, context);
      });
    });
  });

  describe('node environment', () => {
    let spawnSpy: Mock<typeof Node.spawn>;

    beforeEach(() => {
      spawnSpy = spyOn(Node, 'spawn');
    });

    afterEach(() => {
      spawnSpy.mockClear();
    });

    it('should invoke spawn from node:child_process module', async () => {
      expect(spawnSpy).toHaveBeenCalledTimes(0);
      await run('node');
      expect(spawnSpy).toHaveBeenCalledTimes(1);
    });

    describe('spawn cmd', () => {
      it('should have run `npx -p typescript tsc`', async () => {
        await run('node');
        expect(spawnSpy).toHaveBeenLastCalledWith(
          'npx',
          ['-p', 'typescript', 'tsc'],
          { shell: true }
        );
      });

      it('should use args from context.argvTsc value', async () => {
        context.argvTsc = ['--noEmit', '--strict'];
        await run('node');
        expect(spawnSpy).toHaveBeenLastCalledWith(
          'npx',
          ['-p', 'typescript', 'tsc', ...context.argvTsc],
          { shell: true }
        );
      });
    });

    describe('watch mode', () => {
      beforeEach(() => {
        context.watch = true;
      });

      it('should invoke formatAndWrite on data event correctly', async () => {
        let errors = 'src/index.ts(1,1): Unexpected error.';

        expect(formatAndWriteSpy).toHaveBeenCalledTimes(0);
        await run('node', errors);
        expect(formatAndWriteSpy).toHaveBeenCalledTimes(0);

        const printCondition = 'Watching for file changes.';
        errors += printCondition;

        await run('node', errors);
        expect(formatAndWriteSpy).toHaveBeenCalledTimes(1);
        expect(formatAndWriteSpy).toHaveBeenLastCalledWith(errors, context);
      });
    });

    describe('non-watch mode', () => {
      beforeEach(() => {
        context.watch = false;
      });

      it('should invoke formatAndWrite on exit event', async () => {
        const errors = 'Unexpected error.';
        expect(formatAndWriteSpy).toHaveBeenCalledTimes(0);
        await run('node', errors);
        expect(formatAndWriteSpy).toHaveBeenCalledTimes(1);
        expect(formatAndWriteSpy).toHaveBeenLastCalledWith(errors, context);
      });
    });
  });
});
