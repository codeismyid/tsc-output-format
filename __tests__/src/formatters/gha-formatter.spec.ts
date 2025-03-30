import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test';
import ERROR_MOCKS from '__tests__/_errors.mock';
import { Formatter, type FormatterOptions } from 'src/blueprints';
import { ghaFormatter } from 'src/formatters';
import { defaultParser } from 'src/parsers';

const EXPECTED_OUTPUT = {
  PRETTY: `
::error title=TS Diagnostic (TS1000)::Unexpected error.
::error title=TS Diagnostic (TS1000),file=index.ts,line=1,endLine=1,col=1::Unexpected error.
::error title=TS Diagnostic (TS1000),file=index.ts,line=1,endLine=1,col=1::Unexpected error.%0A  Sub error.%0A    Grand sub error.
::error title=TS Diagnostic,file=index.ts,line=1,endLine=1,col=1::Unexpected error.
::error title=TS Diagnostic,file=index.ts,line=1,endLine=1,col=1::Unexpected error.
::error title=TS Diagnostic (TS1000)::Unexpected error.
::error title=TS Diagnostic (TS1000),file=index2.ts,line=1,endLine=1,col=1::Unexpected error.
::error title=TS Diagnostic (TS1000),file=index2.ts,line=1,endLine=1,col=1::Unexpected error.%0A  Sub error.%0A    Grand sub error.
::error title=TS Diagnostic,file=index2.ts,line=1,endLine=1,col=1::Unexpected error.
::error title=TS Diagnostic,file=index2.ts,line=1,endLine=1,col=1::Unexpected error.
`.trim(),
  NOT_PRETTY: `
::error title=TS Diagnostic (TS1000)::Unexpected error.
::error title=TS Diagnostic (TS1000),file=index.ts,line=1,endLine=1,col=1::Unexpected error.
::error title=TS Diagnostic (TS1000),file=index.ts,line=1,endLine=1,col=1::Unexpected error.%0A  Sub error.%0A    Grand sub error.
::error title=TS Diagnostic,file=index.ts,line=1,endLine=1,col=1::Unexpected error.
::error title=TS Diagnostic,file=index.ts,line=1,endLine=1,col=1::Unexpected error.
::error title=TS Diagnostic (TS1000)::Unexpected error.
::error title=TS Diagnostic (TS1000),file=index2.ts,line=1,endLine=1,col=1::Unexpected error.
::error title=TS Diagnostic (TS1000),file=index2.ts,line=1,endLine=1,col=1::Unexpected error.%0A  Sub error.%0A    Grand sub error.
::error title=TS Diagnostic,file=index2.ts,line=1,endLine=1,col=1::Unexpected error.
::error title=TS Diagnostic,file=index2.ts,line=1,endLine=1,col=1::Unexpected error.
`.trim()
};

describe('formatters > ghaFormatter', () => {
  let options: FormatterOptions;

  beforeEach(() => {
    options = {
      prefix: Math.random().toString(),
      suffix: Math.random().toString()
    };
  });

  it('should be instance of Formatter', () => {
    expect(ghaFormatter).toBeInstanceOf(Formatter);
  });

  describe('output test', () => {
    describe('empty errors', () => {
      it('should return empty string', () => {
        expect(ghaFormatter.format('')).toBe('');
      });
    });

    describe('non-empty errors', () => {
      describe('pretty format enabled', () => {
        it('should return correctly', () => {
          expect(ghaFormatter.format(ERROR_MOCKS.PRETTY, options)).toBe(
            `${options.prefix}${EXPECTED_OUTPUT.PRETTY}${options.suffix}`
          );
        });
      });

      describe('pretty format disabled', () => {
        it('should return correctly', () => {
          expect(ghaFormatter.format(ERROR_MOCKS.NOT_PRETTY, options)).toBe(
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
      ghaFormatter.format('');
      expect(spyParse).toHaveBeenCalledTimes(1);
    });
  });
});
