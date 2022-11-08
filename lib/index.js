#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PublicGoogleSheetsParser = require('public-google-sheets-parser');
var chalk = require('chalk');
var clear = require('clear');
var figlet = require('figlet');
var program = require('commander');
clear();
console.log(chalk.red(figlet.textSync('i18n-build', { horizontalLayout: 'full' })));
program
    .version('0.0.1')
    .description("A utility script to generate i18n-json-files from a google spreadsheet")
    .option('-s, --source <google-sheet-id>', 'Define the Google Sheet ID to fetch from')
    .option('-o, --output <target-folder>', 'Target path relative from src (default: ./locales)')
    .parse(process.argv);
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
