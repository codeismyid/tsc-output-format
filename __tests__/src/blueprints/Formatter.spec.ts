import { beforeEach, describe, expect, it, jest } from 'bun:test';
import {
  Formatter,
  type FormatterOptions,
  type FormatterTransform,
  type Parser
} from 'src/blueprints';

describe('blueprint > Formatter', () => {
  let parser: {
    parse: jest.Mock;
  };
  let input: string;
  let transform: FormatterTransform;
  let options: FormatterOptions;
  let formatter: Formatter;

  beforeEach(() => {
    parser = {
      parse: jest.fn()
    };
    input = '12';
    transform = jest.fn();
    options = { prefix: '', suffix: '' };
    formatter = new Formatter(parser as unknown as Parser, transform, options);
  });

  describe('instantiation', () => {
    it('should return correctly', () => {
      expect(formatter).toBeObject();
      expect(formatter.format.length).toBe(2);
      expect(formatter.format).toBeFunction();
    });
  });

  describe('format method', () => {
    it('should call parse method from parser instance correctly', () => {
      expect(parser.parse).toHaveBeenCalledTimes(0);
      formatter.format(input);
      expect(parser.parse).toHaveBeenCalledTimes(1);
      expect(parser.parse).toHaveBeenLastCalledWith(input);
    });

    it('should call transform correctly', () => {
      const mockResult = ['123456789'];
      parser.parse.mockReturnValueOnce(mockResult);
      expect(transform).toHaveBeenCalledTimes(0);
      formatter.format(input);
      expect(transform).toHaveBeenCalledTimes(1);
      expect(transform).toHaveBeenLastCalledWith(mockResult);
    });
  });
});
