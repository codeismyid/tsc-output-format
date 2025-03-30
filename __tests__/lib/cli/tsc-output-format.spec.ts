import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  spyOn
} from 'bun:test';
import { Cli, Runner, Util } from 'lib';

let context: Util.Context;
let prepareContextSpy: Mock<typeof Util.prepareContext>;

describe('lib > cli > tscOutputFormat', () => {
  beforeEach(() => {
    context = {
      argv: [],
      argvTsc: [],
      argvFormat: [],
      help: false,
      formatter: null,
      formatOptions: {
        formatOutput: 'raw' as const,
        formatOnly: false
      },
      watch: false
    };
    prepareContextSpy = spyOn(Util, 'prepareContext');
  });

  it('should be function with 0 param', () => {
    expect(Cli.tscOutputFormat).toBeFunction();
    expect(Cli.tscOutputFormat.length).toBe(0);
  });

  describe('runHelp', () => {
    let runnerSpy: Mock<typeof Runner.runHelp>;

    beforeEach(() => {
      context.help = true;
      prepareContextSpy.mockReturnValue(context);
      runnerSpy = spyOn(Runner, 'runHelp').mockImplementationOnce(() => {});
    });

    afterEach(() => {
      prepareContextSpy.mockRestore();
      runnerSpy.mockRestore();
    });

    it('should invoke prepareContext', () => {
      expect(prepareContextSpy).toHaveBeenCalledTimes(0);
      Cli.tscOutputFormat();
      expect(prepareContextSpy).toHaveBeenCalledTimes(1);
    });

    it('should invoke runHelp if help flag from context is true', () => {
      expect(runnerSpy).toHaveBeenCalledTimes(0);
      Cli.tscOutputFormat();
      expect(runnerSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('runFormatOnly', () => {
    let runnerSpy: Mock<typeof Runner.runFormatOnly>;

    beforeEach(() => {
      context.formatOptions.formatOnly = true;
      prepareContextSpy.mockReturnValue(context);
      runnerSpy = spyOn(Runner, 'runFormatOnly').mockImplementationOnce(
        () => {}
      );
    });

    afterEach(() => {
      prepareContextSpy.mockRestore();
      runnerSpy.mockRestore();
    });

    it('should invoke prepareContext', () => {
      expect(prepareContextSpy).toHaveBeenCalledTimes(0);
      Cli.tscOutputFormat();
      expect(prepareContextSpy).toHaveBeenCalledTimes(1);
    });

    it('should invoke runFormatOnly if formatOnly option from context is true', () => {
      expect(runnerSpy).toHaveBeenCalledTimes(0);
      Cli.tscOutputFormat();
      expect(runnerSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('runTsc', () => {
    let runnerSpy: Mock<typeof Runner.runTsc>;

    beforeEach(() => {
      prepareContextSpy.mockReturnValue(context);
      runnerSpy = spyOn(Runner, 'runTsc').mockImplementationOnce(
        async () => {}
      );
    });

    afterEach(() => {
      prepareContextSpy.mockRestore();
      runnerSpy.mockRestore();
    });

    it('should invoke prepareContext', () => {
      expect(prepareContextSpy).toHaveBeenCalledTimes(0);
      Cli.tscOutputFormat();
      expect(prepareContextSpy).toHaveBeenCalledTimes(1);
    });

    it('should invoke runTsc', () => {
      expect(runnerSpy).toHaveBeenCalledTimes(0);
      Cli.tscOutputFormat();
      expect(runnerSpy).toHaveBeenCalledTimes(1);
    });
  });
});
