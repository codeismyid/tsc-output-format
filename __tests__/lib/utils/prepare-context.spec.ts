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
import {
  ghaFormatter,
  jsonFormatter,
  jsonPrettyFormatter
} from 'src/formatters';

const originalArgv = [...process.argv];
const originalIsTTY = process.stdin.isTTY;
let parsedArgv: Util.ParsedArgv;
let parseArgvSpy: Mock<typeof Util.parseArgv>;

describe('cli > utils > prepareContext', () => {
  beforeEach(() => {
    process.stdin.isTTY = true;
    parsedArgv = {
      argv: [],
      argvFormat: [],
      argvTsc: [],
      help: false,
      formatOptions: {
        formatOnly: false,
        formatOutput: 'raw'
      },
      watch: false
    };
    parseArgvSpy = spyOn(Util, 'parseArgv');
  });

  afterEach(() => {
    process.argv = [...originalArgv];
    process.stdin.isTTY = originalIsTTY;
    parseArgvSpy.mockRestore();
  });

  it('should be function with 0 param', () => {
    expect(Util.prepareContext).toBeFunction();
    expect(Util.prepareContext.length).toBe(0);
  });

  it('should have keys & values from invoked _parsedArgv', () => {
    parseArgvSpy.mockReturnValueOnce(parsedArgv);

    const context = Util.prepareContext();

    expect(context).toContainKeys(Object.keys(parsedArgv));
    expect(context).toContainValues(Object.values(parsedArgv));
  });

  describe('formatOptions', () => {
    it('should force formatOnly to true if input is piped', () => {
      parseArgvSpy.mockReturnValueOnce(parsedArgv);

      process.stdin.isTTY = false;
      expect(Util.prepareContext().formatOptions.formatOnly).toBe(true);
    });
  });

  describe('formatter', () => {
    it('should return null if help flag is true', () => {
      parsedArgv.help = true;
      parseArgvSpy.mockReturnValueOnce(parsedArgv);
      expect(Util.prepareContext().formatter).toEqual(null);
    });

    it('should return based on formatOutput', () => {
      parsedArgv.formatOptions.formatOutput = 'raw';
      parseArgvSpy.mockReturnValueOnce(parsedArgv);
      expect(Util.prepareContext().formatter).toEqual(null);

      parsedArgv.formatOptions.formatOutput = 'gha';
      parseArgvSpy.mockReturnValueOnce(parsedArgv);
      expect(Util.prepareContext().formatter).toEqual(ghaFormatter);

      parsedArgv.formatOptions.formatOutput = 'json';
      parseArgvSpy.mockReturnValueOnce(parsedArgv);
      expect(Util.prepareContext().formatter).toEqual(jsonFormatter);

      parsedArgv.formatOptions.formatOutput = 'jsonPretty';
      parseArgvSpy.mockReturnValueOnce(parsedArgv);
      expect(Util.prepareContext().formatter).toEqual(jsonPrettyFormatter);
    });
  });
});
