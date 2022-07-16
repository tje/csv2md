# csv2md

CLI tool for converting CSV/TSV formatted text to neat markdown tables. Thin convenience wrapper for [csv-parse](https://csv.js.org/parse/) under its hood

## Usage

```sh
# Parse a CSV file and print its converted output to the terminal
node app.js /path/to/file.csv

# The `-t` flag switches to a tab delimiter (default is comma)
node app.js -t /path/to/file.tsv

# Pipe from stdin
cat /path/to/file.csv | node app.js

# Build a fat bin to use instead of `node app.js`
npm run build
chmod +x csv2md
mv csv2md ~/bin/csv2md # Or wherever you keep your $PATHs

# Clipboard conversion
# macOS:
pbpaste | csv2md | pbcopy
# Windows (PowerShell):
gcb | csv2md.exe | scb
```
