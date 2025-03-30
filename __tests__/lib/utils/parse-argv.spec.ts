import { afterEach, describe, expect, it } from 'bun:test';
import { AVAILABLE_FORMAT_OUTPUT, parseArgv } from 'lib/utils/parse-argv';

const originalArgv = [...process.argv];

describe('lib > utils > parseArgv', () => {
  afterEach(() => {
    process.argv = [...originalArgv];
  });

  it('should be function with 0 param', () => {
    expect(parseArgv).toBeFunction();
    expect(parseArgv.length).toBe(0);
  });

  describe('formatOutput option', () => {
    it('should parses formatOutput argument', () => {
      process.argv = ['bun', 'parseArgv', '--formatOutput', 'json'];

      const { argvFormat, formatOptions } = parseArgv();

      expect(argvFormat).toEqual(process.argv.slice(2));
      expect(formatOptions.formatOutput).toEqual('json');
    });

    it(`should use 'raw' as a default value if argument is not provided`, () => {
      process.argv = ['bun', 'parseArgv'];

      const { argvFormat, formatOptions } = parseArgv();

      expect(argvFormat).toEqual([]);
      expect(formatOptions.formatOutput).toEqual('raw');
    });

    it('should use the last value', () => {
      process.argv = [
        'bun',
        'parseArgv',
        '--formatOutput',
        'json',
        '--formatOutput',
        'gha'
      ];

      const { argvFormat, formatOptions } = parseArgv();

      expect(argvFormat).toEqual([
        '--formatOutput',
        'json',
        '--formatOutput',
        'gha'
      ]);
      expect(formatOptions.formatOutput).toEqual('gha');
    });

    it('should throws error if an invalid value is provided', () => {
      process.argv = ['bun', 'parseArgv', '--formatOutput', 'jsonx'];
      const availableOutput = AVAILABLE_FORMAT_OUTPUT.map(
        (output) => `'${output}'`
      ).join(' | ');
      const throwMsg = `'--formatOutput' must be ${availableOutput}.`;

      expect(() => parseArgv()).toThrow(throwMsg);

      process.argv = ['bun', 'parseArgv', '--formatOutput'];

      expect(() => parseArgv()).toThrow(throwMsg);

      process.argv = ['bun', 'parseArgv', '--formatOutput', '--noEmit'];

      expect(() => parseArgv()).toThrow(throwMsg);
    });
  });

  describe('formatOnly option', () => {
    it('should parses formatOnly argument with empty value', () => {
      process.argv = ['bun', 'parseArgv', '--formatOnly'];

      const parsed = parseArgv();
      expect(parsed.argvFormat).toEqual(['--formatOnly']);
      expect(parsed.formatOptions.formatOnly).toBe(true);

      process.argv = ['bun', 'parseArgv', '--formatOnly', '--noEmit'];

      const parsed2 = parseArgv();
      expect(parsed2.argvFormat).toEqual(['--formatOnly']);
      expect(parsed2.formatOptions.formatOnly).toBe(true);
    });

    it('should parses formatOnly argument with non-empty value', () => {
      process.argv = ['bun', 'parseArgv', '--formatOnly', 'false'];

      const { argvFormat, formatOptions } = parseArgv();

      expect(argvFormat).toEqual(['--formatOnly', 'false']);
      expect(formatOptions.formatOnly).toBe(false);
    });

    it('should use false as a default value if argument is not provided', () => {
      process.argv = ['bun', 'parseArgv'];

      const { argvFormat, formatOptions } = parseArgv();

      expect(argvFormat).toEqual([]);
      expect(formatOptions.formatOnly).toBe(false);
    });

    it('should use the last value', () => {
      process.argv = [
        'bun',
        'parseArgv',
        '--formatOnly',
        'true',
        '--formatOnly',
        'false'
      ];

      const { argvFormat, formatOptions } = parseArgv();

      expect(argvFormat).toEqual(process.argv.slice(2));
      expect(formatOptions.formatOnly).toBe(false);
    });

    it('should throws error if an invalid value is provided', () => {
      process.argv = ['bun', 'parseArgv', '--formatOnly', 'yes'];

      expect(() => parseArgv()).toThrow(
        "'--formatOnly' must be 'true' | 'false'."
      );
    });
  });

  it('should add non-parser arguments to tsc arguments', () => {
    process.argv = ['bun', 'parseArgv', '--noEmit'];

    const { argvTsc } = parseArgv();

    expect(argvTsc).toEqual(['--noEmit']);
  });

  describe('help flag', () => {
    it('should return false, if help argument is false or not provided', () => {
      process.argv = ['bun', 'parseArgv'];
      expect(parseArgv().help).toBe(false);

      process.argv = ['bun', 'parseArgv', '--help', 'false'];
      expect(parseArgv().help).toBe(false);

      process.argv = ['bun', 'parseArgv', '-h', 'false'];
      expect(parseArgv().help).toBe(false);
    });

    it('should return true, if help argument is true or provided with no value', () => {
      process.argv = ['bun', 'parseArgv', '--help', 'true'];
      expect(parseArgv().help).toBe(true);

      process.argv = ['bun', 'parseArgv', '-h', 'true'];
      expect(parseArgv().help).toBe(true);

      process.argv = ['bun', 'parseArgv', '--help'];
      expect(parseArgv().help).toBe(true);

      process.argv = ['bun', 'parseArgv', '-h'];
      expect(parseArgv().help).toBe(true);
    });
  });

  describe('watch flag', () => {
    it('should return false, if watch argument is false or not provided', () => {
      process.argv = ['bun', 'parseArgv'];
      expect(parseArgv().watch).toBe(false);

      process.argv = ['bun', 'parseArgv', '--watch', 'false'];
      expect(parseArgv().watch).toBe(false);

      process.argv = ['bun', 'parseArgv', '-w', 'false'];
      expect(parseArgv().watch).toBe(false);
    });

    it('should return true, if watch argument is true or provided with no value', () => {
      process.argv = ['bun', 'parseArgv', '--watch', 'true'];
      expect(parseArgv().watch).toBe(true);

      process.argv = ['bun', 'parseArgv', '-w', 'true'];
      expect(parseArgv().watch).toBe(true);

      process.argv = ['bun', 'parseArgv', '--watch'];
      expect(parseArgv().watch).toBe(true);

      process.argv = ['bun', 'parseArgv', '-w'];
      expect(parseArgv().watch).toBe(true);
    });
  });
});
