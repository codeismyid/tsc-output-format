import { Formatter } from 'src/blueprints/Formatter';
import { defaultParser } from 'src/parsers/default-parser';

/**
 * Grouped `Formatter` instance.
 */
export const groupedFormatter = new Formatter(defaultParser, (parseResults) => {
  let result = '';
  let isPretty = false;
  const temp: Record<string, (typeof parseResults)[number][]> = {};

  for (let i = 0; i < parseResults.length; i++) {
    const parseResult = parseResults[i];
    const fname = parseResult.file;

    if (fname) {
      temp[fname] = [...(temp[fname] || []), parseResult];
    } else {
      temp['not in file'] = [...(temp['not in file'] || []), parseResult];
    }

    if (!isPretty && parseResult.source) {
      isPretty = true;
    }
  }

  let [inFile, notInFile] = ['', ''];

  for (const [key, value] of Object.entries(temp)) {
    const list = value.reduce((acc, curr, currIndex) => {
      let res = acc;
      const lines = curr._match.split(/\r?\n/);

      if (lines.length === 1) {
        res += `  ${lines}`;
      }

      if (lines.length > 1) {
        lines.forEach((line, index) => {
          if (index !== 0) {
            res += '\n';
          }

          res += `  ${line}`;
        });
      }

      if (currIndex !== value.length - 1) {
        res += isPretty ? '\n\n' : '\n';
      }

      return res;
    }, '');

    const grouped = `${key}: found ${value.length} errors.\n${list}`;

    if (key === 'not in file') {
      notInFile = grouped;
    } else {
      if (inFile === '') {
        inFile += grouped;
      } else {
        inFile += '\n\n';
        inFile += grouped;
      }
    }
  }

  if (inFile !== '') {
    result += inFile;
  }

  if (notInFile !== '') {
    if (result !== '') {
      result += '\n\n';
    }

    result += notInFile;
  }

  return result;
});
