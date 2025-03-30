import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test';
import ERROR_MOCKS from '__tests__/_errors.mock';
import { Formatter, type FormatterOptions } from 'src/blueprints';
import { jsonPrettyFormatter } from 'src/formatters';
import { defaultParser } from 'src/parsers';

const EXPECTED_OUTPUT = {
  PRETTY: JSON.stringify(defaultParser.parse(ERROR_MOCKS.PRETTY), null, 2),
  NOT_PRETTY: JSON.stringify(
    defaultParser.parse(ERROR_MOCKS.NOT_PRETTY),
    null,
    2
  )
};

describe('formatters > jsonPrettyFormatter', () => {
  let options: FormatterOptions;

  beforeEach(() => {
    options = {
      prefix: Math.random().toString(),
      suffix: Math.random().toString()
    };
  });

  it('should be instance of Formatter', () => {
    expect(jsonPrettyFormatter).toBeInstanceOf(Formatter);
  });

  describe('output test', () => {
    describe('empty errors', () => {
      it('should return empty string', () => {
        expect(jsonPrettyFormatter.format('')).toBe('');
      });
    });

    describe('non-empty errors', () => {
      describe('pretty format enabled', () => {
        it('should return correctly', () => {
          expect(jsonPrettyFormatter.format(ERROR_MOCKS.PRETTY, options)).toBe(
            `${options.prefix}${EXPECTED_OUTPUT.PRETTY}${options.suffix}`
          );
        });
      });

      describe('pretty format disabled', () => {
        it('should return correctly', () => {
          expect(
            jsonPrettyFormatter.format(ERROR_MOCKS.NOT_PRETTY, options)
          ).toBe(
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
      jsonPrettyFormatter.format('');
      expect(spyParse).toHaveBeenCalledTimes(1);
    });
  });
});
