import type { Content } from '../src/types'
import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, rmdirSync, unlinkSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createSpreadsheet, spreadsheet } from '../src/index'

function runCLI(command: string): string {
  try {
    // Use proper path handling
    const cliPath = resolve(__dirname, '../bin/cli.ts')

    // Don't split the command by spaces, pass it as a single argument
    const result = spawnSync('bun', [cliPath, ...command.match(/(?:[^\s"]|"[^"]*")+/g)?.map(arg =>
      arg.startsWith('"') && arg.endsWith('"') ? arg.slice(1, -1) : arg,
    ) || []], {
      encoding: 'utf8',
      env: {
        ...process.env,
        NODE_ENV: 'test',
        NO_COLOR: '1',
      },
      cwd: process.cwd(), // Ensure we're in the right directory
    })

    // Combine stdout and stderr
    const output = [
      result.stdout?.trim(),
      result.stderr?.trim(),
    ].filter(Boolean).join('\n')

    if (result.error) {
      console.error('CLI execution error:', result.error)
    }

    return output || ''
  }
  catch (error) {
    console.error('Unexpected error in runCLI:', error)
    return error instanceof Error ? error.message : String(error)
  }
}

// Helper function to wait for file to exist
async function waitForFile(filepath: string, timeoutMs = 2000): Promise<boolean> {
  const startTime = Date.now()
  while (Date.now() - startTime < timeoutMs) {
    if (existsSync(filepath))
      return true
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  return false
}

describe('ts-spreadsheets', () => {
  let testData: Content

  beforeEach(() => {
    testData = {
      headings: ['Name', 'Age', 'City'],
      data: [
        ['John Doe', 30, 'New York'],
        ['Jane Smith', 25, 'London'],
        ['Bob Johnson', 35, 'Paris'],
      ],
    }
  })

  afterEach(() => {
    // Clean up any files created during tests
    const filesToDelete = ['output.csv', 'output.xlsx']
    filesToDelete.forEach((file) => {
      if (existsSync(file))
        unlinkSync(file)
    })
  })

  describe('Content Creation', () => {
    it('should create valid Content object', () => {
      expect(testData.headings.length).toBe(3)
      expect(testData.data.length).toBe(3)
      expect(testData.data[0].length).toBe(3)
    })

    it('should handle empty data', () => {
      const emptyData: Content = { headings: [], data: [] }
      expect(() => createSpreadsheet(emptyData)).not.toThrow()
    })

    it('should handle single row data', () => {
      const singleRowData: Content = {
        headings: ['Test'],
        data: [['Value']],
      }
      expect(() => createSpreadsheet(singleRowData)).not.toThrow()
    })
  })

  describe('CSV Generation', () => {
    it('should generate valid CSV content', () => {
      const csvContent = spreadsheet(testData).csv().getContent() as string
      const lines = csvContent.split('\n')
      expect(lines[0]).toBe('Name,Age,City')
      expect(lines[1]).toBe('John Doe,30,New York')
    })

    it('should handle special characters in CSV', () => {
      const specialData: Content = {
        headings: ['Name', 'Description'],
        data: [['John, Doe', 'Likes "quotes"']],
      }
      const csvContent = spreadsheet(specialData).csv().getContent() as string
      expect(csvContent).toBe('Name,Description\n"John, Doe","Likes ""quotes"""')
    })

    it('should correctly store numbers in CSV', () => {
      const numericData: Content = {
        headings: ['Name', 'Age', 'Score'],
        data: [
          ['Alice', 28, 95.5],
          ['Bob', 32, 88],
          ['Charlie', 45, 72.75],
        ],
      }
      const csvContent = spreadsheet(numericData).csv().getContent() as string
      const lines = csvContent.split('\n')
      expect(lines[0]).toBe('Name,Age,Score')
      expect(lines[1]).toBe('Alice,28,95.5')
      expect(lines[2]).toBe('Bob,32,88')
      expect(lines[3]).toBe('Charlie,45,72.75')
    })

    it('should handle empty cells', () => {
      const dataWithEmpty: Content = {
        headings: ['Col1', 'Col2'],
        data: [['', 'value'], ['value', '']],
      }
      const csvContent = spreadsheet(dataWithEmpty).csv().getContent() as string
      expect(csvContent).toBe('Col1,Col2\n,value\nvalue,')
    })
  })

  describe('Excel Generation', () => {
    it('should generate valid Excel content', () => {
      const excelContent = spreadsheet(testData).excel().getContent() as Uint8Array
      expect(excelContent).toBeInstanceOf(Uint8Array)
      expect(excelContent.length).toBeGreaterThan(0)
    })

    it('should generate larger Excel files correctly', () => {
      const largeData: Content = {
        headings: ['ID', 'Value'],
        data: Array.from({ length: 1000 }, (_, i) => [i, `Value ${i}`]),
      }
      const excelContent = spreadsheet(largeData).excel().getContent() as Uint8Array
      expect(excelContent).toBeInstanceOf(Uint8Array)
      expect(excelContent.length).toBeGreaterThan(0)
    })
  })

  describe('File Storage', () => {
    it('should store CSV file', async () => {
      await spreadsheet(testData).store('output.csv')
      expect(existsSync('output.csv')).toBe(true)
    })

    it('should store Excel file', async () => {
      await spreadsheet(testData).store('output.xlsx')
      expect(existsSync('output.xlsx')).toBe(true)
    })

    it('should handle file overwrite', async () => {
      await spreadsheet(testData).store('output.csv')
      await spreadsheet(testData).store('output.csv')
      expect(existsSync('output.csv')).toBe(true)
    })
  })

  describe('Download Response', () => {
    it('should create valid download response for CSV', () => {
      const response = spreadsheet(testData).csv().download('test.csv')
      expect(response).toBeInstanceOf(Response)
      expect(response.headers.get('Content-Type')).toBe('text/csv')
      expect(response.headers.get('Content-Disposition')).toBe('attachment; filename="test.csv"')
    })

    it('should create valid download response for Excel', () => {
      const response = spreadsheet(testData).excel().download('test.xlsx')
      expect(response).toBeInstanceOf(Response)
      expect(response.headers.get('Content-Type')).toBe(
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      )
      expect(response.headers.get('Content-Disposition')).toBe('attachment; filename="test.xlsx"')
    })
  })

  describe('Method Chaining', () => {
    it('should support method chaining', async () => {
      await spreadsheet(testData).csv().store('output.csv')
      expect(existsSync('output.csv')).toBe(true)
    })

    it('should support multiple operations', async () => {
      const result = spreadsheet(testData)
      await result.csv().store('output.csv')
      await result.excel().store('output.xlsx')
      expect(existsSync('output.csv')).toBe(true)
      expect(existsSync('output.xlsx')).toBe(true)
    })
  })

  describe('Error Handling', () => {
    it('should throw error for unsupported spreadsheet type', () => {
      // @ts-expect-error: Testing invalid type
      expect(() => createSpreadsheet(testData, { type: 'pdf' })).toThrow()
    })

    it('should handle invalid file paths', async () => {
      await expect(
        spreadsheet(testData).store('/invalid/path/file.csv'),
      ).rejects.toThrow()
    })
  })

  describe('CLI Integration', () => {
    const testDir = resolve(process.cwd(), '.test-output')
    let testData: Content
    let testFilePath: string

    beforeEach(() => {
      // Ensure test directory exists
      mkdirSync(testDir, { recursive: true })

      testData = {
        headings: ['Name', 'Age', 'City'],
        data: [
          ['John Doe', 30, 'New York'],
          ['Jane Smith', 25, 'London'],
          ['Bob Johnson', 35, 'Paris'],
        ],
      }
      testFilePath = resolve(testDir, 'test-input.json')
      writeFileSync(testFilePath, JSON.stringify(testData, null, 2))
    })

    afterEach(() => {
      if (existsSync(testDir)) {
        readdirSync(testDir).forEach((file) => {
          unlinkSync(resolve(testDir, file))
        })
        rmdirSync(testDir)
      }
    })

    describe('create command', () => {
      it('should create CSV file from JSON input', async () => {
        const outputPath = resolve(testDir, 'output.csv')
        const output = runCLI(`create "${testFilePath}" -o "${outputPath}"`)

        await waitForFile(outputPath)
        expect(existsSync(outputPath)).toBe(true)
        expect(output).toContain('Spreadsheet saved')
      })

      it('should create Excel file from JSON input', async () => {
        const outputPath = resolve(testDir, 'output.xlsx')
        const output = runCLI(`create "${testFilePath}" --type excel -o "${outputPath}"`)

        await waitForFile(outputPath)
        expect(existsSync(outputPath)).toBe(true)
        expect(output).toContain('Spreadsheet saved')
      })

      it('should output to stdout when no output file specified', () => {
        const output = runCLI(`create "${testFilePath}"`)
        expect(output).toContain('Name,Age,City')
      })

      it('should handle invalid JSON input', () => {
        const invalidPath = resolve(testDir, 'invalid.json')
        writeFileSync(invalidPath, '{ invalid json }')
        const output = runCLI(`create "${invalidPath}"`)
        expect(output).toContain('Failed to create spreadsheet')
      })
    })

    describe('convert command', () => {
      it('should convert CSV to Excel', async () => {
        const csvPath = resolve(testDir, 'test-output.csv')
        const xlsxPath = resolve(testDir, 'test-output.xlsx')

        // First create CSV
        runCLI(`create "${testFilePath}" -o "${csvPath}"`)
        await waitForFile(csvPath)

        // Then convert
        const output = runCLI(`convert "${csvPath}" "${xlsxPath}"`)
        await waitForFile(xlsxPath)

        expect(existsSync(xlsxPath)).toBe(true)
        expect(output).toContain('Converted')
      })

      it('should warn when input and output formats are the same', async () => {
        const csvPath = resolve(testDir, 'test-output.csv')
        const samePath = resolve(testDir, 'same-output.csv')

        runCLI(`create "${testFilePath}" -o "${csvPath}"`)
        await waitForFile(csvPath)

        const output = runCLI(`convert "${csvPath}" "${samePath}"`)
        expect(output).toContain('same')
      })

      it('should handle invalid input file', () => {
        const nonexistentPath = resolve(testDir, 'nonexistent.csv')
        const outputPath = resolve(testDir, 'output.xlsx')
        const output = runCLI(`convert "${nonexistentPath}" "${outputPath}"`)
        expect(output).toContain('Failed to convert spreadsheet')
      })
    })

    describe('validate command', () => {
      it('should validate correct JSON format', () => {
        const output = runCLI(`validate "${testFilePath}"`)
        expect(output).toContain('Input JSON is valid')
      })

      it('should catch missing headings', () => {
        const invalidPath = resolve(testDir, 'invalid.json')
        const invalidData = { data: [['test']] }
        writeFileSync(invalidPath, JSON.stringify(invalidData))
        const output = runCLI(`validate "${invalidPath}"`)
        expect(output).toContain('Missing or invalid headings array')
      })

      it('should catch invalid data types', () => {
        const invalidPath = resolve(testDir, 'invalid.json')
        const invalidData = {
          headings: ['Test'],
          data: [[{ invalid: 'object' }]],
        }
        writeFileSync(invalidPath, JSON.stringify(invalidData))
        const output = runCLI(`validate "${invalidPath}"`)
        expect(output).toContain('Data must be an array of arrays')
      })

      it('should catch non-string headings', () => {
        const invalidPath = resolve(testDir, 'invalid.json')
        const invalidData = {
          headings: [42],
          data: [['test']],
        }
        writeFileSync(invalidPath, JSON.stringify(invalidData))
        const output = runCLI(`validate "${invalidPath}"`)
        expect(output).toContain('Headings must be strings')
      })
    })
  })
})
