import { RuleConfigSeverity, type UserConfig } from '@commitlint/types';
import type { ParserOptions } from 'conventional-commits-parser';

const { CI } = process.env;
const isCI = CI && ['1', 'true', 'yes', 'y'].includes(CI.toLowerCase());
const formatter = isCI
  ? 'commitlint-format/gha-annotation'
  : 'commitlint-format/default';

const config: UserConfig = {
  formatter,
  rules: {
    'body-leading-blank': [RuleConfigSeverity.Error, 'always'],
    'body-max-line-length': [RuleConfigSeverity.Error, 'always', 100],
    'footer-leading-blank': [RuleConfigSeverity.Error, 'always'],
    'footer-max-line-length': [RuleConfigSeverity.Error, 'always', 100],
    'header-max-length': [RuleConfigSeverity.Error, 'always', 100],
    'header-trim': [RuleConfigSeverity.Error, 'always'],
    'subject-case': [
      RuleConfigSeverity.Error,
      'never',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case']
    ],
    'subject-empty': [RuleConfigSeverity.Error, 'never'],
    'subject-full-stop': [RuleConfigSeverity.Error, 'never', '.'],
    'type-case': [RuleConfigSeverity.Error, 'always', 'lower-case'],
    'type-empty': [RuleConfigSeverity.Error, 'never'],
    'type-enum': [
      RuleConfigSeverity.Error,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test'
      ]
    ]
  },
  parserPreset: {
    parserOpts: {
      headerPattern: /^(\w*)(?:\((.*)\))?!?: (.*)$/,
      breakingHeaderPattern: /^(\w*)(?:\((.*)\))?!: (.*)$/,
      headerCorrespondence: ['type', 'scope', 'subject'],
      fieldPattern: /^-(.*?)-$/,
      noteKeywords: ['BREAKING CHANGE', 'BREAKING-CHANGE'],
      notesPattern: (noteKeywordsSelection: string) => {
        return new RegExp(`^[\\s|*]*(${noteKeywordsSelection})[:\\s]+(.*)`);
      },
      revertPattern:
        /^(?:Revert|revert:)\s"?([\s\S]+?)"?\s*This reverts commit (\w*)\./i,
      revertCorrespondence: ['header', 'hash'],
      issuePrefixes: ['#']
    } as ParserOptions
  }
};

export default config;
