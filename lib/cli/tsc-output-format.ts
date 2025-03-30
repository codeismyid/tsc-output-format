import { Runner, Util } from 'lib';

/** @internal */
export const tscOutputFormat = () => {
  const context = Util.prepareContext();

  if (context.help) {
    return Runner.runHelp(context);
  }

  if (context.formatOptions.formatOnly) {
    return Runner.runFormatOnly(context);
  }

  return Runner.runTsc(context);
};
