import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  mock,
  spyOn
} from 'bun:test';
import type { Context } from 'lib/utils';
import { formatAndWrite } from 'lib/utils/format-and-write';
import type { Formatter } from 'src/blueprints/Formatter';

let context: Context;
let format: Mock<Formatter['format']>;
let consoleClearSpy: Mock<typeof console.clear>;
let processStdoutWrite: Mock<typeof process.stdout.write>;

describe('lib > utils > formatAndWrite', () => {
  beforeEach(() => {
    format = mock();
    context = {
      argv: [],
      argvFormat: [],
      argvTsc: [],
      help: false,
      formatter: {
        format
      } as unknown as Context['formatter'],
      formatOptions: {
        formatOnly: false,
        formatOutput: 'raw'
      },
      watch: false
    };
    consoleClearSpy = spyOn(console, 'clear').mockImplementation(() => {});
    processStdoutWrite = spyOn(process.stdout, 'write').mockImplementation(
      () => true
    );
  });

  afterEach(() => {
    consoleClearSpy.mockRestore();
    processStdoutWrite.mockRestore();
    format.mockRestore();
  });

  it('should be function with 2 params', () => {
    expect(formatAndWrite).toBeFunction();
    expect(formatAndWrite.length).toBe(2);
  });

  describe('format', () => {
    it('should invoke formatter.format from context', () => {
      expect(context.formatter?.format).toHaveBeenCalledTimes(0);
      formatAndWrite('', context);
      expect(context.formatter?.format).toHaveBeenCalledTimes(1);
    });
  });

  describe('write', () => {
    it('should invoke console.clear if context.watch is true', () => {
      context.watch = true;

      expect(consoleClearSpy).toHaveBeenCalledTimes(0);
      formatAndWrite('', context);
      expect(consoleClearSpy).toHaveBeenCalledTimes(1);
    });

    it('should invoke process.stdout.write', () => {
      expect(processStdoutWrite).toHaveBeenCalledTimes(0);
      formatAndWrite('', context);
      expect(processStdoutWrite).toHaveBeenCalledTimes(1);
      context.formatter = null;
      formatAndWrite('', context);
      expect(processStdoutWrite).toHaveBeenCalledTimes(2);
    });
  });
});
