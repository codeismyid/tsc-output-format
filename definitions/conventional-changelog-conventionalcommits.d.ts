declare module 'conventional-changelog-conventionalcommits' {
  type CommitsConfig = {
    ignoreCommits?: unknown;
  };

  type ChangelogConfig = {
    header?: string;
    types?: {
      type: string;
      scope?: string;
      section?: string;
      hidden?: boolean;
    }[];
    preMajor?: boolean;
    commitUrlFormat?: string;
    compareUrlFormat?: string;
    issueUrlFormat?: string;
    userUrlFormat?: string;
    releaseCommitMessageFormat?: string;
    issuePrefixes?: string[];
  };

  type Config = CommitsConfig & ChangelogConfig;

  type TransformFn = <Commit, Context>(
    commit: Commit,
    context: Context
  ) =>
    | {
        notes: { title: string; text: string }[];
        type: string;
        scope: string;
        shortHash: string;
        subject: string;
        references: unknown[];
      }
    | undefined;

  type Preset<TConfig extends Config> = {
    commits: { ignore: unknown; merge: false };
    parser: {
      headerPattern: RegExp;
      breakingHeaderPattern: RegExp;
      headerCorrespondence: ['type', 'scope', 'subject'];
      noteKeywords: ['BREAKING CHANGE', 'BREAKING-CHANGE'];
      revertPattern: RegExp;
      revertCorrespondence: ['header', 'hash'];
      issuePrefixes: Exclude<TConfig['issuePrefixes'], undefined>;
    };
    writer: {
      transform: TransformFn;
      groupBy: string;
      commitGroupsSort: (a: { title: string }, b: { title: string }) => number;
      commitsSort: string[];
      noteGroupsSort: string;
      notesSort: (props: unknown) => (a: unknown, b: unknown) => number;

      mainTemplate: string;
      headerTemplate: string;
      commitPartial: string;
      footerPartial: string;
    };
    whatBump: <Commit>(commits: Commit) => {
      level: number;
      reason: string;
    };
  };

  /**
   * @param config - Based on {@link https://github.com/conventional-changelog/conventional-changelog-config-spec/tree/master/versions/2.2.0 conventional-changelog-config-spec-2.2.0}
   * @return `Object` based on {@link https://github.com/conventional-changelog/conventional-changelog/tree/conventional-changelog-conventionalcommits-v8.0.0 conventional-changelog-conventionalcommits-v8.0.0}
   */
  const createPreset: (config?: Config) => Promise<Preset<Config>>;

  export default createPreset;
}
