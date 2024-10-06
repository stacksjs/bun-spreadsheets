<p align="center"><img src="https://github.com/stacksjs/bun-spreadsheets/blob/main/.github/art/cover.jpg" alt="Social Card of this Bun Spreadsheets repo"></p>

[![npm version][npm-version-src]][npm-version-href]
[![GitHub Actions][github-actions-src]][github-actions-href]
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
<!-- [![npm downloads][npm-downloads-src]][npm-downloads-href] -->
<!-- [![Codecov][codecov-src]][codecov-href] -->

# Bun Spreadsheets

Easily generate spreadsheets, like CSVs and Excel files.

## ☘️ Features

- Generate CSV files
- Generate Excel files
- Store spreadsheets to disk
- Download spreadsheets as a Response object
- Simple API for creating and manipulating spreadsheets
- Fully typed
- Optimized for Bun
- Lightweight & dependency-free

## 🤖 Usage

```bash
bun install bun-spreadsheets
```

Now, you can use it in your project:

```ts
import { spreadsheet, createSpreadsheet } from 'bun-spreadsheets'

// Create a spreadsheet
const data = {
  headings: ['Name', 'Age', 'City'],
  data: [
    ['John Doe', '30', 'New York'],
    ['Jane Smith', '25', 'London'],
    ['Bob Johnson', '35', 'Paris']
  ]
}

// Generate and manipulate spreadsheets

// 1. Using createSpreadsheet function
const spreadsheet = createSpreadsheet(data) // defaults to csv
const csvSpreadsheet = createSpreadsheet(data, { type: 'csv' })
const excelSpreadsheet = createSpreadsheet(data, { type: 'excel' })

// Store the spreadsheet to disk
await spreadsheet.store('output.csv')

// Create a download response
const response1 = excelSpreadsheet.download('data.xlsx') // downloads and stores as data.xlsx on your filesystem

// 2. Using spreadsheet object directly, and chain if desired
const csvContent = spreadsheet(data).generateCSV().store('output2.csv')
const csvContent2 = spreadsheet(data).csv().store('output3.csv') // same as above

const excelContent = spreadsheet(data).generateExcel()
await excelContent.store('output3.xlsx')
const response2 = await excelContent.download('output3.xlsx') // downloads and stores as output3.xlsx

// 3. Accessing raw content
const rawCsvContent = spreadsheet(data).csv().getContent()
const rawCsvContent2 = spreadsheet(data).generateCSV().getContent()
const rawExcelContent = spreadsheet(data).excel().getContent()
const rawExcelContent2 = spreadsheet(data).generateExcel().getContent()

console.log('CSV Content:', rawCsvContent)
console.log('Excel Content:', rawExcelContent)
```

## 📚 API Documentation

### Main Functions

#### spreadsheet(data: Content)

Creates a spreadsheet object with various methods.

- `data`: An object containing `headings` and `data` for the spreadsheet.

Returns an object with the following methods:

- `csv()`: Generates a CSV SpreadsheetWrapper
- `excel()`: Generates an Excel SpreadsheetWrapper
- `store(path: string)`: Stores the spreadsheet to a file
- `generateCSV()`: Generates a CSV SpreadsheetWrapper
- `generateExcel()`: Generates an Excel SpreadsheetWrapper

Example:

```typescript
const csvWrapper = await spreadsheet(data).csv() // equivalent to spreadsheet(data).generateCSV()
```

#### createSpreadsheet(data: Content, options?: SpreadsheetOptions)

Creates a SpreadsheetWrapper with the given data and options.

- `data`: An object containing `headings` and `data` for the spreadsheet.
- `options`: Optional. An object specifying the spreadsheet type ('csv' or 'excel').

Returns a SpreadsheetWrapper.

Example:

```typescript
const spreadsheet = createSpreadsheet(data, { type: 'csv' })
```

### SpreadsheetWrapper Methods

#### getContent()

Returns the content of the spreadsheet as a string or Uint8Array.

#### download(filename: string)

Creates a download Response for the spreadsheet.

- `filename`: The name of the file to be downloaded.

Returns a Response object.

#### store(path: string)

Stores the spreadsheet to a file.

- `path`: The file path where the spreadsheet will be stored.

Returns a Promise that resolves when the file is written.

### Utility Functions

#### spreadsheet.create(data: Content, options?: SpreadsheetOptions)

Creates a SpreadsheetContent object.

- `data`: An object containing `headings` and `data` for the spreadsheet.
- `options`: Optional. An object specifying the spreadsheet type ('csv' or 'excel').

Returns a SpreadsheetContent object.

#### spreadsheet.generate(data: Content, options?: SpreadsheetOptions)

Generates spreadsheet content based on the given data and options.

- `data`: An object containing `headings` and `data` for the spreadsheet.
- `options`: Optional. An object specifying the spreadsheet type ('csv' or 'excel').

Returns a string or Uint8Array representing the spreadsheet content.

#### spreadsheet.generateCSV(content: Content)

Generates a CSV SpreadsheetWrapper.

- `content`: An object containing `headings` and `data` for the spreadsheet.

Returns a SpreadsheetWrapper for CSV, which can be used to chain other methods like `store()` or `download()`.

Example:

```typescript
await spreadsheet(data).generateCSV().store('output.csv')

// if one can rely on the file extension to determine the type, you may do this:
await spreadsheet(data).store('output.csv')
```

#### spreadsheet.generateExcel(content: Content)

Generates an Excel SpreadsheetWrapper.

- `content`: An object containing `headings` and `data` for the spreadsheet.

Returns a SpreadsheetWrapper for Excel, which can be used to chain other methods like `store()` or `download()`.

Example:

```ts
await spreadsheet(data).store('output.xlsx')
// or
await spreadsheet(data).generateExcel().store('output.xlsx')
```

To view the full documentation, please visit [https://stacksjs.org/docs/bun-spreadsheets](https://stacksjs.org/docs/bun-spreadsheets).

## 🧪 Testing

```bash
bun test
```

## 📈 Changelog

Please see our [releases](https://github.com/stacksjs/stacks/releases) page for more information on what has changed recently.

## 🚜 Contributing

Please review the [Contributing Guide](https://github.com/stacksjs/contributing) for details.

## 🏝 Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable:

[Discussions on GitHub](https://github.com/stacksjs/stacks/discussions)

For casual chit-chat with others using this package:

[Join the Stacks Discord Server](https://discord.gg/stacksjs)

## 🙏🏼 Credits

Many thanks to the following core technologies & people who have contributed to this package:

- [Chris Breuer](https://github.com/chrisbbreuer)
- [All Contributors](../../contributors)

## 📄 License

The MIT License (MIT). Please see [LICENSE](https://github.com/stacksjs/bun-spreadsheets/tree/main/LICENSE.md) for more information.

Made with 💙

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/bun-spreadsheets?style=flat-square
[npm-version-href]: https://npmjs.com/package/bun-spreadsheets
[github-actions-src]: https://img.shields.io/github/actions/workflow/status/stacksjs/ts-starter/ci.yml?style=flat-square&branch=main
[github-actions-href]: https://github.com/stacksjs/ts-starter/actions?query=workflow%3Aci

<!-- [codecov-src]: https://img.shields.io/codecov/c/gh/stacksjs/ts-starter/main?style=flat-square
[codecov-href]: https://codecov.io/gh/stacksjs/ts-starter -->
