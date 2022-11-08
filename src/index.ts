#!/usr/bin/env node

import {writeFile} from 'fs/promises';
import path from 'path'
const PublicGoogleSheetsParser = require('public-google-sheets-parser')

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const program = require('commander');

clear();
console.log(
  chalk.red(
    figlet.textSync('i18n-build', { horizontalLayout: 'full' })
  )
);

program
  .version('0.0.1')
  .description("A utility script to generate i18n-json-files from a google spreadsheet")
  .option('-s, --source <google-sheet-id>', 'Define the Google Sheet ID to fetch from')
  .option('-o, --output <target-folder>', 'Target path relative from src (default: ./locales)')
  .parse(process.argv);

if (program.source) console.log('Google Spreadsheet ID: ' + program.source);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
