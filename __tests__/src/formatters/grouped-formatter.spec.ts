import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test';
import ERROR_MOCKS from '__tests__/_errors.mock';
import { Formatter, type FormatterOptions } from 'src/blueprints';
import { groupedFormatter } from 'src/formatters';
import { defaultParser } from 'src/parsers';

const EXPECTED_OUTPUT = {
  PRETTY: `
index.ts: found 4 errors.
  index.ts(1,1): error TS1000: Unexpected error.
  
  1  const unexpected_error = unexpected_error;
                              ~~~~~~~~~~~~~~~~

  index.ts(1,1): error TS1000: Unexpected error.
    Sub error.
      Grand sub error.
  
  1    const unexpected_error = unexpected_error;
                                ~~~~~~~~~~~~~~~~

  index.ts(1,1): error Unexpected error.
  
  1      const unexpected_error = unexpected_error;
                                  ~~~~~~~~~~~~~~~~

  index.ts(1,1): Unexpected error.
  
  1        const unexpected_error = unexpected_error;
                                    ~~~~~~~~~~~~~~~~

index2.ts: found 4 errors.
  index2.ts:1:1 - error TS1000: Unexpected error.
  
  1  const unexpected_error = unexpected_error;
                              ~~~~~~~~~~~~~~~~

  index2.ts:1:1 - error TS1000: Unexpected error.
    Sub error.
      Grand sub error.
  
  1    const unexpected_error = unexpected_error;
                                ~~~~~~~~~~~~~~~~

  index2.ts:1:1 - error Unexpected error.
  
  1      const unexpected_error = unexpected_error;
                                  ~~~~~~~~~~~~~~~~

  index2.ts:1:1 - Unexpected error.
  
  1        const unexpected_error = unexpected_error;
                                    ~~~~~~~~~~~~~~~~

not in file: found 2 errors.
  error TS1000: Unexpected error.

  error TS1000 - Unexpected error.
`.trim(),
  NOT_PRETTY: `
index.ts: found 4 errors.
  index.ts(1,1): error TS1000: Unexpected error.
  index.ts(1,1): error TS1000: Unexpected error.
    Sub error.
      Grand sub error.
  index.ts(1,1): error Unexpected error.
  index.ts(1,1): Unexpected error.

index2.ts: found 4 errors.
  index2.ts:1:1 - error TS1000: Unexpected error.
  index2.ts:1:1 - error TS1000: Unexpected error.
    Sub error.
      Grand sub error.
  index2.ts:1:1 - error Unexpected error.
  index2.ts:1:1 - Unexpected error.

not in file: found 2 errors.
  error TS1000: Unexpected error.
  error TS1000 - Unexpected error.
`.trim()
};

describe('formatters > groupedFormatter', () => {
  let options: FormatterOptions;

  beforeEach(() => {
    options = {
      prefix: Math.random().toString(),
      suffix: Math.random().toString()
    };
  });

  it('should be instance of Formatter', () => {
    expect(groupedFormatter).toBeInstanceOf(Formatter);
  });

  describe('output test', () => {
    describe('empty errors', () => {
      it('should return empty string', () => {
        expect(groupedFormatter.format('')).toBe('');
      });
    });

    describe('non-empty errors', () => {
      describe('pretty format enabled', () => {
        it('should return correctly', () => {
          expect(groupedFormatter.format(ERROR_MOCKS.PRETTY, options)).toBe(
            `${options.prefix}${EXPECTED_OUTPUT.PRETTY}${options.suffix}`
          );
        });
      });

      describe('pretty format disabled', () => {
        it('should return correctly', () => {
          expect(groupedFormatter.format(ERROR_MOCKS.NOT_PRETTY, options)).toBe(
            `${options.prefix}${EXPECTED_OUTPUT.NOT_PRETTY}${options.suffix}`
          );
        });
      });
    });
  });

  describe('dependence', () => {
    let spyParse: JestMock.SpiedFunction<typeof defaultParser.parse>;

    beforeEach(() => {
      spyParse = spyOn(defaultParser, 'parse');
      spyParse.mockImplementationOnce(() => []);
    });

    afterEach(() => {
      spyParse.mockRestore();
    });

    it('should call parse method from defaultParser instance', () => {
      expect(spyParse).toHaveBeenCalledTimes(0);
      groupedFormatter.format('');
      expect(spyParse).toHaveBeenCalledTimes(1);
    });
  });
});
