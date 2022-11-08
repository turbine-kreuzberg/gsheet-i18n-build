"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var promises_1 = require("fs/promises");
var path_1 = __importDefault(require("path"));
var PublicGoogleSheetsParser = require('public-google-sheets-parser');
var getSheet = function (spreadsheetId, sheetName) {
    var parser = new PublicGoogleSheetsParser(spreadsheetId, sheetName);
    return parser.parse();
};
var getIndexFile = function (languages) {
    return languages.map(function (language) { return "export { default as ".concat(language, " } from './").concat(language, ".json';\n"); }).join('');
};
function default_1(spreadsheetId, outputPath) {
    if (outputPath === void 0) { outputPath = path_1.default.resolve(__dirname, './locales'); }
    return __awaiter(this, void 0, void 0, function () {
        var indexSheet, sheetNames, sheetsResult, categories, languages, getLocale, indexFilePath;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getSheet(spreadsheetId)];
                case 1:
                    indexSheet = _a.sent();
                    sheetNames = indexSheet.map(function (row) { return row.sheetName; });
                    return [4 /*yield*/, Promise.all(sheetNames.map(function (sheetName) { return __awaiter(_this, void 0, void 0, function () {
                            var _a;
                            var _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        _b = {};
                                        _a = sheetName;
                                        return [4 /*yield*/, getSheet(spreadsheetId, sheetName)];
                                    case 1: return [2 /*return*/, (_b[_a] = _c.sent(),
                                            _b)];
                                }
                            });
                        }); }))];
                case 2:
                    sheetsResult = _a.sent();
                    categories = sheetsResult.reduce(function (acc, cur) { return (__assign(__assign({}, acc), cur)); }, {});
                    languages = Object.keys(
                    // => { key: 'german', 'de-DE': 'Deutsch', 'en-EN': 'German' }
                    Object.values(categories).reduce(function (acc, cur) { return (__assign(__assign({}, acc), cur.reduce(function (acc2, cur2) { return (__assign(__assign({}, cur2), acc2)); }))); }, {})).filter(function (key) { return key !== 'key'; });
                    // eslint-disable-next-line no-console
                    console.info("languages: ".concat(languages));
                    getLocale = function (language) {
                        return Object.entries(categories).reduce(function (acc, _a) {
                            var category = _a[0], sheet = _a[1];
                            return (__assign(__assign({}, acc), sheet.reduce(function (acc2, row) {
                                var _a, _b;
                                return (__assign(__assign({}, acc2), (_a = {}, _a[category] = __assign(__assign({}, acc2[category]), (_b = {}, _b[row.key] = row[language], _b)), _a)));
                            }, {})));
                        }, {});
                    };
                    return [4 /*yield*/, Promise.all(languages.map(function (language) { return __awaiter(_this, void 0, void 0, function () {
                            var locale, fileName;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        locale = getLocale(language);
                                        fileName = "".concat(outputPath, "/").concat(language, ".json");
                                        return [4 /*yield*/, (0, promises_1.writeFile)(fileName, JSON.stringify(locale))];
                                    case 1:
                                        _a.sent();
                                        // eslint-disable-next-line no-console
                                        console.info("wrote: ".concat(fileName));
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 3:
                    _a.sent();
                    indexFilePath = "".concat(outputPath, "/index.ts");
                    return [4 /*yield*/, (0, promises_1.writeFile)(indexFilePath, getIndexFile(languages))];
                case 4:
                    _a.sent();
                    // eslint-disable-next-line no-console
                    console.info("wrote ".concat(indexFilePath));
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = default_1;
;
