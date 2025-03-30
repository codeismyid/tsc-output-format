import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  spyOn
} from 'bun:test';
import { Util } from 'lib';
import { runFormatOnly } from 'lib/runners/run-format-only';
import type { Context } from 'lib/utils';

let context: Context;
let stdinOnSpy: Mock<typeof process.stdin.on>;
let formatAndWriteSpy: Mock<typeof Util.formatAndWrite>;

const mockStdinOn = (data = '') => {
  stdinOnSpy.mockImplementation((event, callback) => {
    const cb = callback as (...args: unknown[]) => void;

    switch (event) {
      case 'data': {
        cb(Buffer.from(data));

        break;
      }
      case 'end': {
        cb();
        break;
      }
    }

    return process.stdin;
  });
};

describe('lib > runners > runFormatOnly', () => {
  beforeEach(() => {
    context = {
      argv: [],
      argvFormat: [],
      argvTsc: [],
      help: false,
      formatter: null,
      formatOptions: {
        formatOnly: false,
        formatOutput: 'raw'
      },
      watch: false
    };
    stdinOnSpy = spyOn(process.stdin, 'on');
    formatAndWriteSpy = spyOn(Util, 'formatAndWrite').mockImplementation(
      () => {}
    );
  });

  afterEach(() => {
    stdinOnSpy.mockRestore();
    formatAndWriteSpy.mockRestore();
  });

  it('should be function with 1 param', () => {
    expect(runFormatOnly).toBeFunction();
    expect(runFormatOnly.length).toBe(1);
  });

  describe('watch mode', () => {
    beforeEach(() => {
      context.watch = true;
    });

    it('should invoke stdin.on correctly', () => {
      expect(stdinOnSpy).toHaveBeenCalledTimes(0);
      runFormatOnly(context);
      expect(stdinOnSpy).toHaveBeenCalledTimes(1);
      expect(stdinOnSpy).toHaveBeenLastCalledWith('data', expect.any(Function));
    });

    it('should invoke formatAndWrite on data event and right condition', () => {
      let errors = 'src/index.ts(1,1): Unexpected error.';
      mockStdinOn(errors);

      expect(formatAndWriteSpy).toHaveBeenCalledTimes(0);
      runFormatOnly(context);
      expect(formatAndWriteSpy).toHaveBeenCalledTimes(0);

      const printCondition = 'Watching for file changes.';
      errors += printCondition;

      mockStdinOn(errors);
      runFormatOnly(context);
      expect(formatAndWriteSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('non-watch mode', () => {
    beforeEach(() => {
      context.watch = false;
    });

    it('should invoke stdin.on correctly', () => {
      expect(stdinOnSpy).toHaveBeenCalledTimes(0);
      runFormatOnly(context);
      expect(stdinOnSpy).toHaveBeenCalledTimes(2);
      expect(stdinOnSpy).toHaveBeenCalledWith('data', expect.any(Function));
      expect(stdinOnSpy).toHaveBeenCalledWith('end', expect.any(Function));
    });

    it('should invoke formatAndWrite on end event', () => {
      mockStdinOn();

      expect(formatAndWriteSpy).toHaveBeenCalledTimes(0);
      runFormatOnly(context);
      expect(formatAndWriteSpy).toHaveBeenCalledTimes(1);
    });
  });
});
