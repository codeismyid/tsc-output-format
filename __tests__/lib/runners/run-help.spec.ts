import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  spyOn
} from 'bun:test';
import { Runner } from 'lib';
import { runHelp } from 'lib/runners';
import type { Context } from 'lib/utils';

let runTscSpy: Mock<typeof Runner.runTsc>;
let context: Context;
let processStdoutWrite: Mock<typeof process.stdout.write>;

describe('lib > runners > runHelp', () => {
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
    runTscSpy = spyOn(Runner, 'runTsc').mockImplementationOnce(async () => {});
    processStdoutWrite = spyOn(process.stdout, 'write').mockImplementationOnce(
      () => true
    );
  });

  afterEach(() => {
    runTscSpy.mockRestore();
  });

  it('should be function with 1 param', () => {
    expect(runHelp).toBeFunction();
    expect(runHelp.length).toBe(1);
  });

  it('should invoke process.stdout.write', () => {
    expect(processStdoutWrite).toHaveBeenCalledTimes(0);
    runHelp(context);
    expect(processStdoutWrite).toHaveBeenCalledTimes(1);
  });

  it('should invoke runTsc', () => {
    expect(runTscSpy).toHaveBeenCalledTimes(0);
    runHelp(context);
    expect(runTscSpy).toHaveBeenCalledTimes(1);
  });
});
