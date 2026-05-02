#!/usr/bin/env bun
import conventionalCommitsChangelog from 'conventional-changelog-conventionalcommits';
import type { Options as WriterOptions } from 'conventional-changelog-writer';
import type { ParserOptions } from 'conventional-commits-parser';
import packageJson from 'package.json';
import * as SemanticRelease from 'semantic-release';

const { CI, GITHUB_ACTIONS } = process.env;
const isCI = CI && ['1', 'true', 'yes', 'y'].includes(CI.toLowerCase());
const isGHA =
  GITHUB_ACTIONS &&
  ['1', 'true', 'yes', 'y'].includes(GITHUB_ACTIONS.toLowerCase());
const isDryRun = !isCI || process.argv.includes('--dry-run');
if (isCI) {
  process.env.NO_COLOR = 'true';
}
const ansis = await import('ansis');
const RELEASE_BRANCHES: SemanticRelease.BranchSpec[] = ['main'];

const changelogPreset = await conventionalCommitsChangelog({
  types: [
    { type: 'feat', section: 'Features', hidden: false },
    { type: 'fix', section: 'Fixes', hidden: false },
    {
      type: 'perf',
      section: 'Performance Improvements',
      hidden: false
    },
    { type: 'docs', section: 'Documentations', hidden: false },
    { type: 'revert', section: 'Reverts', hidden: false },
    {
      type: 'chore',
      scope: 'release',
      section: 'Others',
      hidden: false
    },
    { type: 'build', hidden: true },
    { type: 'chore', hidden: true },
    { type: 'ci', hidden: true },
    { type: 'refactor', hidden: true },
    { type: 'style', hidden: true },
    { type: 'test', hidden: true }
  ]
});

const parserOpts: ParserOptions = {
  ...changelogPreset.parser,
  headerPattern: /^(\w*)(?:\((.*)\))?!?: (.*)$/,
  breakingHeaderPattern: /^(\w*)(?:\((.*)\))?!: (.*)$/,
  headerCorrespondence: ['type', 'scope', 'subject'],
  noteKeywords: ['BREAKING CHANGE', 'BREAKING-CHANGE'],
  notesPattern: (noteKeywords: string) => {
    return new RegExp(`^[\\s|*]*(${noteKeywords})[:\\s]+(.*)`);
  },
  revertPattern:
    /^(?:Revert|revert:)\s"?([\s\S]+?)"?\s*This reverts commit (\w*)\./i,
  revertCorrespondence: ['header', 'hash'],
  issuePrefixes: ['#']
};

const writerOpts: WriterOptions = {
  ...(changelogPreset.writer as unknown as WriterOptions),
  transform: (commit, context, _options) => {
    const commitObj = commit as typeof commit & {
      scope: string | null;
    };

    const result = changelogPreset.writer.transform(commitObj, context);

    if (!result) {
      return;
    }

    if (commitObj.scope === 'release') {
      result.scope = '';
    }

    if (commitObj.notes.length) {
      const notes = commitObj.notes.map((note) => {
        let newText = '';

        const lines = note.text.split('\n');

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];

          const matchesTrailer = line.match(/^([A-Za-z0-9-]+):\s(.+)$/);

          if (matchesTrailer) {
            break;
          }

          newText += `${line}\n`;
        }

        return {
          ...note,
          title: 'BREAKING CHANGE',
          text: newText.trim()
        };
      });

      result.notes = notes;
    }

    return result;
  }
} as WriterOptions;

const releaseOptions: SemanticRelease.Options = (() => {
  const plugins: SemanticRelease.PluginSpec[] = [
    [
      '@semantic-release/commit-analyzer',
      {
        releaseRules: [
          { breaking: true, release: 'major' },
          {
            type: 'feat',
            release: 'minor'
          },
          {
            type: 'fix',
            release: 'patch'
          },
          {
            type: 'perf',
            release: 'patch'
          },
          {
            type: 'chore',
            scope: 'release',
            release: 'patch'
          },
          { revert: true, release: 'patch' },
          {
            scope: 'no-release',
            release: false
          }
        ],
        parserOpts
      }
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        parserOpts,
        writerOpts
      }
    ]
  ];

  if (!isDryRun) {
    plugins.push(
      [
        '@semantic-release/npm',
        {
          pkgRoot: '.'
        }
      ],
      [
        '@semantic-release/github',
        {
          addReleases: 'bottom'
        }
      ]
    );
  }

  return {
    branches: RELEASE_BRANCHES,
    repositoryUrl: packageJson.repository.url,
    // biome-ignore lint/suspicious/noTemplateCurlyInString: intended
    tagFormat: 'v${version}',
    plugins
  };
})();

const generateSummary = (result: SemanticRelease.Result) => {
  let content = '## 🚀 Release Report';

  if (result) {
    const { nextRelease } = result;
    const repoUrl = (releaseOptions.repositoryUrl as string)
      .replace(/^git\+/, '')
      .replace(/.git$/, '');

    content += `
- Type: ${nextRelease.type}
- Version: ${nextRelease.version}
- Tag: ${nextRelease.gitTag}

See this release at this [link](${repoUrl}/releases/tag/${nextRelease.gitTag}).

## 📝 Generated Notes
${nextRelease.notes}`;
  } else {
    content += `
- Type: N/A
- Version: N/A
- Tag: N/A

No release published.`;
  }

  return content;
};

const runRelease = async () => {
  try {
    const release = SemanticRelease.default;
    const result = await release(releaseOptions);

    console.info('--------------------------------------------------\n');

    const summary = generateSummary(result);

    console.info(summary);

    if (isGHA) {
      await Bun.$`printf "%s" "${summary}" >> $GITHUB_STEP_SUMMARY`;
    }

    console.info();
    console.info('--------------------------------------------------\n');
  } catch (err) {
    if (err instanceof Error) {
      console.error(`${err.name}:`, `${ansis.white(err.message)}`);
    }

    process.exit(1);
  }
};

const main = async () => {
  const startTime = performance.now();
  await runRelease();
  const endTime = performance.now();
  console.info(
    `\nrelease script completed in ${ansis.bold(`${(endTime - startTime).toFixed(2)}ms`)}.`
  );
};

main().catch((err: unknown) => {
  throw err;
});
