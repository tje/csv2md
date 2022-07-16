const { parse } = require('csv-parse')
const fs = require('fs')
const path = require('path')

function getInput () {
  return new Promise((res, rej) => {
    const delimiter = process.argv.indexOf('-t') >= 0
      ? '\t'
      : ','
    if (!process.stdin.isTTY) {
      const out = []
      const parser = parse({ columns: true, delimiter })
      parser.on('readable', () => {
        let row
        while (row = parser.read()) {
          out.push(row)
        }
      })
      parser.on('error', rej)
      parser.on('end', () => {
        res(out)
      })
      process.stdin.pipe(parser)
    } else {
      const file = process.argv.slice(2).find((a) => !a.startsWith('-'))
      if (!file) {
        return rej('No input file specified')
      }

      const filePath = path.resolve(process.cwd(), file)
      fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
        if (err) {
          return rej(err)
        }
        parse(data, { columns: true, delimiter }, (err, records) => {
          if (err) {
            return rej(err)
          }
          res(records)
        })
      })
    }
  })
}

getInput()
  .then((parsed) => {
    const cols = parsed.reduce((a, b) => {
      const out = {}
      for (const key of Object.keys(b)) {
        out[key] = Math.max(a[key] || 0, b[key].length, key.length)
      }
      return out
    }, {})

    const lines = []

    const head = []
    for (const [ key, width ] of Object.entries(cols)) {
      head.push(key.padEnd(width))
    }
    lines.push(head.join(' | '))
    lines.push(head.map((c) => c.replace(/./g, '-')).join(' | '))

    for (const row of parsed) {
      const line = []
      for (const [ key, width ] of Object.entries(cols)) {
        line.push(row[key].padEnd(width))
      }
      lines.push(line.join(' | '))
    }

    const table = lines.map((l) => `| ${l} |`).join('\n')
    console.log(table)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
