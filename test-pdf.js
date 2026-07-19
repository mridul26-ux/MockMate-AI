/* eslint-disable @typescript-eslint/no-require-imports */
const { PDFParse } = require('pdf-parse'); const fs = require('fs'); const buf = fs.readFileSync('test-pdf.js'); const parser = new PDFParse({ data: buf }); parser.load().then(() => parser.getText()).then(console.log).catch(console.error);
