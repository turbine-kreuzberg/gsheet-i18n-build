import {writeFile} from 'fs/promises';
import path from 'path'
const PublicGoogleSheetsParser = require('public-google-sheets-parser')

/**
 * This ID can be extracted from the Google Docs URL
 * https://docs.google.com/spreadsheets/d/1ODbsOmAkvr9exvRNWehPvuQpD_cdaCLsLHMkzZKWb68
 * Duplicate it via "File -> Make a copy" and make it accessible to "Anyone with the link"
 * When adding a new category add the sheet name into the 'index' sheet
 */
type Row = { [key: string]: string };
type Sheet = Row[];

const getSheet = (spreadsheetId: string, sheetName?: string): Promise<Sheet> => {
  const parser = new PublicGoogleSheetsParser(spreadsheetId, sheetName);
  return parser.parse();
};

const getIndexFile = (languages: string[]) =>
  languages.map((language) => `export { default as ${language} } from './${language}.json';\n`).join('');

export default async function (spreadsheetId: string, outputPath = path.resolve(__dirname, './locales')) {
  const indexSheet = await getSheet(spreadsheetId);

  // => ["general", "errors", ...]
  const sheetNames = indexSheet.map((row) => row.sheetName);

  // => [{ "general": Sheet }, { "errors": Sheet }]
  const sheetsResult = await Promise.all(
    sheetNames.map(async (sheetName) => ({
      [sheetName]: await getSheet(spreadsheetId, sheetName),
    })),
  );

  // => { "general": Sheet, "errors": Sheet }
  // => { "general": [{ "key": "book", "de-DE": "Buch", "en-EN": "book" }], ... }
  const categories = sheetsResult.reduce((acc, cur) => ({ ...acc, ...cur }), {});

  // collects all the keys found in those sheets and filters out the "key"
  // => [ 'de-DE', 'en-EN' ]
  const languages = Object.keys(
    // => { key: 'german', 'de-DE': 'Deutsch', 'en-EN': 'German' }
    Object.values(categories).reduce(
      (acc, cur) => ({ ...acc, ...cur.reduce((acc2, cur2) => ({ ...cur2, ...acc2 })) }),
      {},
    ),
  ).filter((key) => key !== 'key');

  // eslint-disable-next-line no-console
  console.info(`languages: ${languages}`);

  const getLocale = (language: string) =>
    Object.entries(categories).reduce(
      (acc, [category, sheet]) => ({
        ...acc,
        ...sheet.reduce(
          (acc2: any, row) => ({
            ...acc2,
            [category]: {
              ...acc2[category],
              [row.key]: row[language],
            },
          }),
          {},
        ),
      }),
      {},
    );

  await Promise.all(
    languages.map(async (language) => {
      const locale = getLocale(language);
      const fileName = `${outputPath}/${language}.json`;
      await writeFile(fileName, JSON.stringify(locale));
      // eslint-disable-next-line no-console
      console.info(`wrote: ${fileName}`);
    }),
  );

  const indexFilePath = `${outputPath}/index.ts`;
  await writeFile(indexFilePath, getIndexFile(languages));
  // eslint-disable-next-line no-console
  console.info(`wrote ${indexFilePath}`);
};
