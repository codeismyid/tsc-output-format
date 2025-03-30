import { Formatter } from 'src/blueprints/Formatter';
import { defaultParser } from 'src/parsers/default-parser';

/**
 * Grouped minify `Formatter` instance.
 */
export const groupedMinFormatter = new Formatter(
  defaultParser,
  (parseResults) => {
    let result = '';
    let notInFileMatch = '';
    const temp: Record<string, number> = {};

    for (let i = 0; i < parseResults.length; i++) {
      const parseResult = parseResults[i];
      const fname = parseResult.file;

      if (fname) {
        temp[fname] = (temp[fname] ?? 0) + 1;
      } else {
        temp['not in file'] = (temp['not in file'] ?? 0) + 1;
        if (notInFileMatch !== '') {
          notInFileMatch += '\n';
        }
        notInFileMatch += `  ${parseResult._match.replaceAll(/\r?\n/g, '\n  ')}`;
      }
    }

    let [inFile, notInFile] = ['', ''];

    for (const [key, count] of Object.entries(temp)) {
      if (key === 'not in file') {
        notInFile = `not in file: found ${count} errors\n${notInFileMatch}`;
      } else {
        const inFileShort = `${key}: found ${count} errors.`;
        if (inFile === '') {
          inFile += inFileShort;
        } else {
          inFile += '\n';
          inFile += inFileShort;
        }
      }
    }

    if (inFile !== '') {
      result += inFile;
    }

    if (notInFile !== '') {
      if (result !== '') {
        result += '\n';
      }

      result += notInFile;
    }

    return result;
  }
);
