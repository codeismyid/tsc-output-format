import { describe, expect, it } from 'bun:test';
import ERROR_MOCKS from '__tests__/_errors.mock';
import { Parser } from 'src/blueprints';
import { defaultParser } from 'src/parsers';

describe('parsers > defaultParser', () => {
  it('should be instance of Parser', () => {
    expect(defaultParser).toBeInstanceOf(Parser);
  });

  describe('result test', () => {
    describe('empty errors', () => {
      it('should return empty array', () => {
        const errors = '';
        const result = defaultParser.parse(errors);
        expect(result).toEqual([]);
      });
    });

    describe('non-empty errors', () => {
      describe('pretty format enabled', () => {
        it('should return correctly', () => {
          expect(defaultParser.parse(ERROR_MOCKS.PRETTY)).toEqual(
            EXPECTED_RESULTS
          );
        });
      });

      describe('pretty format disabled', () => {
        it('should return correctly', () => {
          expect(defaultParser.parse(ERROR_MOCKS.NOT_PRETTY)).toEqual(
            EXPECTED_RESULTS.map((results) => {
              results._match = results._match.split('\n\n')[0];
              results.source = '';
              results.sourceClean = '';

              return results;
            })
          );
        });
      });
    });
  });
});

const EXPECTED_RESULTS = [
  {
    _match: 'error TS1000: Unexpected error.',
    file: '',
    line: '',
    column: '',
    errorCode: 'TS1000',
    message: 'Unexpected error.',
    source: '',
    sourceClean: ''
  },
  {
    _match:
      'index.ts(1,1): error TS1000: Unexpected error.\n\n1  const unexpected_error = unexpected_error;\n                            ~~~~~~~~~~~~~~~~',
    file: 'index.ts',
    line: '1',
    column: '1',
    errorCode: 'TS1000',
    message: 'Unexpected error.',
    source:
      '1  const unexpected_error = unexpected_error;\n                            ~~~~~~~~~~~~~~~~',
    sourceClean: 'const unexpected_error = unexpected_error;'
  },
  {
    _match:
      'index.ts(1,1): error TS1000: Unexpected error.\n  Sub error.\n    Grand sub error.\n\n1    const unexpected_error = unexpected_error;\n                              ~~~~~~~~~~~~~~~~',
    file: 'index.ts',
    line: '1',
    column: '1',
    errorCode: 'TS1000',
    message: 'Unexpected error.\n  Sub error.\n    Grand sub error.',
    source:
      '1    const unexpected_error = unexpected_error;\n                              ~~~~~~~~~~~~~~~~',
    sourceClean: 'const unexpected_error = unexpected_error;'
  },
  {
    _match:
      'index.ts(1,1): error Unexpected error.\n\n1      const unexpected_error = unexpected_error;\n                                ~~~~~~~~~~~~~~~~',
    file: 'index.ts',
    line: '1',
    column: '1',
    errorCode: '',
    message: 'Unexpected error.',
    source:
      '1      const unexpected_error = unexpected_error;\n                                ~~~~~~~~~~~~~~~~',
    sourceClean: 'const unexpected_error = unexpected_error;'
  },
  {
    _match:
      'index.ts(1,1): Unexpected error.\n\n1        const unexpected_error = unexpected_error;\n                                  ~~~~~~~~~~~~~~~~',
    file: 'index.ts',
    line: '1',
    column: '1',
    errorCode: '',
    message: 'Unexpected error.',
    source:
      '1        const unexpected_error = unexpected_error;\n                                  ~~~~~~~~~~~~~~~~',
    sourceClean: 'const unexpected_error = unexpected_error;'
  },
  {
    _match: 'error TS1000 - Unexpected error.',
    file: '',
    line: '',
    column: '',
    errorCode: 'TS1000',
    message: 'Unexpected error.',
    source: '',
    sourceClean: ''
  },
  {
    _match:
      'index2.ts:1:1 - error TS1000: Unexpected error.\n\n1  const unexpected_error = unexpected_error;\n                            ~~~~~~~~~~~~~~~~',
    file: 'index2.ts',
    line: '1',
    column: '1',
    errorCode: 'TS1000',
    message: 'Unexpected error.',
    source:
      '1  const unexpected_error = unexpected_error;\n                            ~~~~~~~~~~~~~~~~',
    sourceClean: 'const unexpected_error = unexpected_error;'
  },
  {
    _match:
      'index2.ts:1:1 - error TS1000: Unexpected error.\n  Sub error.\n    Grand sub error.\n\n1    const unexpected_error = unexpected_error;\n                              ~~~~~~~~~~~~~~~~',
    file: 'index2.ts',
    line: '1',
    column: '1',
    errorCode: 'TS1000',
    message: 'Unexpected error.\n  Sub error.\n    Grand sub error.',
    source:
      '1    const unexpected_error = unexpected_error;\n                              ~~~~~~~~~~~~~~~~',
    sourceClean: 'const unexpected_error = unexpected_error;'
  },
  {
    _match:
      'index2.ts:1:1 - error Unexpected error.\n\n1      const unexpected_error = unexpected_error;\n                                ~~~~~~~~~~~~~~~~',
    file: 'index2.ts',
    line: '1',
    column: '1',
    errorCode: '',
    message: 'Unexpected error.',
    source:
      '1      const unexpected_error = unexpected_error;\n                                ~~~~~~~~~~~~~~~~',
    sourceClean: 'const unexpected_error = unexpected_error;'
  },
  {
    _match:
      'index2.ts:1:1 - Unexpected error.\n\n1        const unexpected_error = unexpected_error;\n                                  ~~~~~~~~~~~~~~~~',
    file: 'index2.ts',
    line: '1',
    column: '1',
    errorCode: '',
    message: 'Unexpected error.',
    source:
      '1        const unexpected_error = unexpected_error;\n                                  ~~~~~~~~~~~~~~~~',
    sourceClean: 'const unexpected_error = unexpected_error;'
  }
];
