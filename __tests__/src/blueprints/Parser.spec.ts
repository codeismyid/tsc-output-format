import { beforeEach, describe, expect, it, jest } from 'bun:test';
import { Parser } from 'src/blueprints';

describe('blueprint > Parser', () => {
  let input: string;
  let matcher: RegExp;
  let matcherKeys: string[] = [];
  let inputModifier: jest.Mock;
  let resultModifier: jest.Mock;
  let parser: Parser;

  beforeEach(() => {
    input = '12';
    matcher = /^(\d)(\d)/g;
    matcherKeys = ['first', 'second'];
    inputModifier = jest.fn((input: string) => input);
    resultModifier = jest.fn((result: object) => result);
    parser = new Parser(matcher, matcherKeys, inputModifier, resultModifier);
  });

  describe('instantiation', () => {
    it('should return correctly', () => {
      expect(parser).toBeObject();
      expect(parser.parse.length).toBe(1);
      expect(parser.parse).toBeFunction();
    });

    it('should throw error if matcher is not a global regex', () => {
      expect(() => {
        new Parser(/^/, []);
      }).toThrow(`argument 'matcher' must be a global regex.`);
    });
  });

  describe('parse method', () => {
    it(`should return empty array if 'input' is empty string`, () => {
      expect(parser.parse('')).toEqual([]);
    });

    it('should return array of objects with matcherKeys as object properties', () => {
      expect(parser.parse(input)).toEqual([
        {
          _match: input,
          first: '1',
          second: '2'
        }
      ]);
    });

    it('should call inputModifier correctly', () => {
      expect(inputModifier).toHaveBeenCalledTimes(0);
      parser.parse(input);
      expect(inputModifier).toHaveBeenCalledTimes(1);
      expect(inputModifier).toHaveBeenLastCalledWith(input);
    });

    it('should call resultModifier correctly', () => {
      expect(resultModifier).toHaveBeenCalledTimes(0);
      parser.parse(input);
      expect(resultModifier).toHaveBeenCalledTimes(1);
      expect(resultModifier).toHaveBeenLastCalledWith({
        _match: input,
        first: '1',
        second: '2'
      });
    });
  });
});
