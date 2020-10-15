# Node PDF Export Server

This project creates a Node server that can export webpages to PDF using a URL or raw HTML passed to it.

## Quick Start

1. `npm install`
1. `npm run start`

## PDF from URL

Make a request to `http://localhost:3000/export/pdf?url=#urlHere#`

## PDF from HTML

Make a POST request to `http://localhost:3000/export/pdf` with JSON body:
```json
{
	"html": "<h1>Test</h1>"
}
```